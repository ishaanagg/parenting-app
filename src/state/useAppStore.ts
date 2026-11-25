import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ParentMood, StageId } from '../domain/types';
import { getDateKey } from '../domain/stageEngine';
import { localStorageAdapter } from './storage';

export const CURRENT_SCHEMA_VERSION = 1;

export interface PersistedAppState {
  schemaVersion: number;
  hasCompletedOnboarding: boolean;
  babyDob: string | null;
  manualStageOverride: StageId | null;
  practicedByDate: Record<string, string[]>;
  skippedByDate: Record<string, string[]>;
  lastMood: ParentMood | null;
}

export interface AppActions {
  setBabyDob: (dob: string) => void;
  setManualStage: (stageId: StageId | null) => void;
  completeOnboardingWithStage: (stageId: StageId) => void;
  markPracticed: (practiceId: string, dateKey?: string) => void;
  skipPracticeForToday: (practiceId: string, dateKey?: string) => void;
  setMood: (mood: ParentMood) => void;
  resetProfile: () => void;
}

export type AppStore = PersistedAppState & AppActions;

export const INITIAL_PERSISTED_STATE: PersistedAppState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  hasCompletedOnboarding: false,
  babyDob: null,
  manualStageOverride: null,
  practicedByDate: {},
  skippedByDate: {},
  lastMood: null,
};

/**
 * Pure migration helper so future schema updates never break saved parent data.
 */
export function migratePersistedState(
  raw: unknown,
  _fromVersion: number,
): PersistedAppState {
  if (!raw || typeof raw !== 'object') {
    return { ...INITIAL_PERSISTED_STATE };
  }
  const record = raw as Partial<PersistedAppState>;
  return {
    ...INITIAL_PERSISTED_STATE,
    ...record,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    practicedByDate: record.practicedByDate ?? {},
    skippedByDate: record.skippedByDate ?? {},
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...INITIAL_PERSISTED_STATE,

      setBabyDob: (dob) =>
        set({
          babyDob: dob,
          manualStageOverride: null,
          hasCompletedOnboarding: true,
        }),

      setManualStage: (stageId) =>
        set({
          manualStageOverride: stageId,
        }),

      completeOnboardingWithStage: (stageId) =>
        set({
          babyDob: null,
          manualStageOverride: stageId,
          hasCompletedOnboarding: true,
        }),

      markPracticed: (practiceId, dateKey = getDateKey()) =>
        set((state) => {
          const existing = state.practicedByDate[dateKey] ?? [];
          if (existing.includes(practiceId)) return state;
          return {
            practicedByDate: {
              ...state.practicedByDate,
              [dateKey]: [...existing, practiceId],
            },
          };
        }),

      skipPracticeForToday: (practiceId, dateKey = getDateKey()) =>
        set((state) => {
          const existing = state.skippedByDate[dateKey] ?? [];
          if (existing.includes(practiceId)) return state;
          return {
            skippedByDate: {
              ...state.skippedByDate,
              [dateKey]: [...existing, practiceId],
            },
          };
        }),

      setMood: (mood) => set({ lastMood: mood }),

      resetProfile: () => set({ ...INITIAL_PERSISTED_STATE }),
    }),
    {
      name: 'anchor-parenting-store',
      version: CURRENT_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorageAdapter),
      migrate: (persistedState, version) =>
        migratePersistedState(persistedState, version),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        babyDob: state.babyDob,
        manualStageOverride: state.manualStageOverride,
        practicedByDate: state.practicedByDate,
        skippedByDate: state.skippedByDate,
        lastMood: state.lastMood,
      }),
    },
  ),
);
