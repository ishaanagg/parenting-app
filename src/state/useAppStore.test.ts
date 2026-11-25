import { beforeEach, describe, expect, it } from 'vitest';
import {
  CURRENT_SCHEMA_VERSION,
  migratePersistedState,
  useAppStore,
} from './useAppStore';

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

  it('records practiced and skipped reps without duplicates', () => {
    const store = useAppStore.getState();
    store.markPracticed('rep-1', '2026-11-25');
    store.markPracticed('rep-1', '2026-11-25');
    store.skipPracticeForToday('rep-2', '2026-11-25');

    const state = useAppStore.getState();
    expect(state.practicedByDate['2026-11-25']).toEqual(['rep-1']);
    expect(state.skippedByDate['2026-11-25']).toEqual(['rep-2']);
  });

  it('migrates partial or older persisted state safely', () => {
    const migrated = migratePersistedState({ babyDob: '2026-09-15' }, 0);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.babyDob).toBe('2026-09-15');
    expect(migrated.practicedByDate).toEqual({});
  });
});
