import { beforeEach, describe, expect, it } from 'vitest';
import { migratePersistedState, useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
  });

  it('sets baby DOB and completes onboarding', () => {
    useAppStore.getState().setBabyDob('2026-10-01');
    const state = useAppStore.getState();
    expect(state.hasCompletedOnboarding).toBe(true);
    expect(state.babyDob).toBe('2026-10-01');
    expect(state.manualStageOverride).toBeNull();
  });

  it('records practiced reps without duplicates and counts "Another" taps', () => {
    const store = useAppStore.getState();
    store.markPracticed('rep-1', '2026-11-25');
    store.markPracticed('rep-1', '2026-11-25');
    store.showAnotherPractice('2026-11-25');
    store.showAnotherPractice('2026-11-25');

    const state = useAppStore.getState();
    expect(state.practicedByDate['2026-11-25']).toEqual(['rep-1']);
    expect(state.anotherCountByDate['2026-11-25']).toBe(2);
  });

  it('scopes mood to the day and prunes old entries', () => {
    const store = useAppStore.getState();
    store.setMood('triggered', '2026-09-01');
    store.setMood('steady', '2026-11-25');
    const state = useAppStore.getState();
    expect(state.moodByDate['2026-11-25']).toBe('steady');
    expect(state.moodByDate['2026-09-01']).toBeUndefined();
  });

  it('migrates v1 state and drops invalid fields', () => {
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
      babyDob: '2026-09-15',
      manualStageOverride: null,
      practicedByDate: { '2026-11-20': ['a'] },
      anotherCountByDate: { '2026-11-20': 2 },
      moodByDate: {},
    });
  });

  it('returns defaults for garbage input', () => {
    expect(migratePersistedState('nope', 0).hasCompletedOnboarding).toBe(false);
  });
});
