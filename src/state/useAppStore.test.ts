import { beforeEach, describe, expect, it } from 'vitest';
import { createSafeStorageAdapter } from './storage';
import {
  createBackupJson,
  migratePersistedState,
  parseBackupJson,
  useAppStore,
} from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
  });

  it('sets parent name, baby name, and DOB cleanly', () => {
    const store = useAppStore.getState();
    store.setParentName('  Ishaan  ');
    store.setBabyName('  Aarav ');
    store.setBabyDob('2026-10-01');

    const state = useAppStore.getState();
    expect(state.hasCompletedOnboarding).toBe(true);
    expect(state.parentName).toBe('Ishaan');
    expect(state.babyName).toBe('Aarav');
    expect(state.babyDob).toBe('2026-10-01');
    expect(state.manualStageOverride).toBeNull();
  });

  it('records practiced reps without duplicates and counts "Another" taps per track', () => {
    const store = useAppStore.getState();
    store.markPracticed('rep-1', '2026-11-25');
    store.markPracticed('rep-1', '2026-11-25');
    store.showAnotherPractice('2026-11-25');
    store.showAnotherPractice('2026-11-25');
    store.showAnotherPractice('2026-11-25', 'couple');

    const state = useAppStore.getState();
    expect(state.practicedByDate['2026-11-25']).toEqual(['rep-1']);
    expect(state.anotherCountByDate['2026-11-25']).toBe(2);
    expect(state.coupleAnotherCountByDate['2026-11-25']).toBe(1);
  });

  it('scopes mood to the day and prunes old entries', () => {
    const store = useAppStore.getState();
    store.setMood('triggered', '2026-09-01');
    store.setMood('steady', '2026-11-25');
    const state = useAppStore.getState();
    expect(state.moodByDate['2026-11-25']).toBe('steady');
    expect(state.moodByDate['2026-09-01']).toBeUndefined();
  });

  it('migrates v1 state to v3 and drops invalid fields', () => {
    const migrated = migratePersistedState(
      {
        schemaVersion: 1,
        hasCompletedOnboarding: true,
        babyDob: '2026-09-15',
        manualStageOverride: 'bogus',
        practicedByDate: { '2026-11-20': ['a', 3], junk: ['b'] },
        skippedByDate: { '2026-11-20': ['x', 'y'] },
        lastMood: 'triggered',
      },
      1,
    );
    expect(migrated).toEqual({
      hasCompletedOnboarding: true,
      parentName: '',
      babyName: '',
      babyDob: '2026-09-15',
      manualStageOverride: null,
      themePreference: 'auto',
      savedCardIds: [],
      practicedByDate: { '2026-11-20': ['a'] },
      anotherCountByDate: { '2026-11-20': 2 },
      coupleAnotherCountByDate: {},
      moodByDate: {},
    });
  });

  it('exports and restores a full backup safely and rejects invalid JSON', () => {
    const store = useAppStore.getState();
    store.setParentName('Ishaan');
    store.setBabyName('Aarav');
    store.setBabyDob('2026-10-01');
    store.markPracticed('rep-1', '2026-11-25');

    const json = createBackupJson(useAppStore.getState());
    store.resetProfile();
    expect(useAppStore.getState().parentName).toBe('');

    const restored = useAppStore.getState().restoreFromBackup(json);
    expect(restored.ok).toBe(true);
    expect(useAppStore.getState().parentName).toBe('Ishaan');
    expect(useAppStore.getState().babyName).toBe('Aarav');
    expect(useAppStore.getState().babyDob).toBe('2026-10-01');
    expect(useAppStore.getState().practicedByDate['2026-11-25']).toEqual(['rep-1']);

    expect(parseBackupJson('{bad json').ok).toBe(false);
    expect(parseBackupJson('{"hello":"world"}').ok).toBe(false);
  });

  it('recovers automatically from shadow backup if primary key is corrupted', () => {
    const map = new Map<string, string>();
    const memoryBackend = {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
    };
    const safeAdapter = createSafeStorageAdapter(() => memoryBackend);

    const key = 'anchor-test-recovery';
    const valid = JSON.stringify({ state: { parentName: 'Ishaan' }, version: 3 });
    safeAdapter.setItem(key, valid);

    // Simulate primary key corruption
    map.set(key, '{corrupted');
    expect(safeAdapter.getItem(key)).toBe(valid);
    // Primary key should also be healed
    expect(map.get(key)).toBe(valid);

    safeAdapter.removeItem(key);
    expect(map.size).toBe(0);
  });
});
