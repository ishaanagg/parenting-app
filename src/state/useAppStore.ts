import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  PARENT_MOODS,
  STAGE_IDS,
  type ParentMood,
  type StageId,
} from '../domain/types';
import { getParentDayKey, parseIsoDate, pruneDateRecord } from '../domain/stageEngine';
import { localStorageAdapter } from './storage';

/** Bump when the persisted shape changes; add a branch in migratePersistedState. */
export const STORE_VERSION = 2;
export const RETENTION_DAYS = 30;

export interface PersistedAppState {
  hasCompletedOnboarding: boolean;
  babyDob: string | null;
  manualStageOverride: StageId | null;
  /** parentDayKey -> practice ids marked practiced */
  practicedByDate: Record<string, string[]>;
  /** parentDayKey -> how many times "Another" was tapped */
  anotherCountByDate: Record<string, number>;
  /** parentDayKey -> latest check-in (scoped per day so yesterday's mood never lingers) */
  moodByDate: Record<string, ParentMood>;
}

export interface AppActions {
  setBabyDob: (dob: string) => void;
  setManualStage: (stageId: StageId | null) => void;
  completeOnboardingWithStage: (stageId: StageId) => void;
  markPracticed: (practiceId: string, dateKey?: string) => void;
  togglePracticed: (practiceId: string, dateKey?: string) => void;
  showAnotherPractice: (dateKey?: string) => void;
  setMood: (mood: ParentMood, dateKey?: string) => void;
  resetProfile: () => void;
}

export type AppStore = PersistedAppState & AppActions;

export const INITIAL_PERSISTED_STATE: PersistedAppState = {
  hasCompletedOnboarding: false,
  babyDob: null,
  manualStageOverride: null,
  practicedByDate: {},
  anotherCountByDate: {},
  moodByDate: {},
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const isDateKey = (k: string) => parseIsoDate(k) !== null;
const isStageId = (v: unknown): v is StageId =>
  typeof v === 'string' && (STAGE_IDS as readonly string[]).includes(v);
const isMood = (v: unknown): v is ParentMood =>
  typeof v === 'string' && (PARENT_MOODS as readonly string[]).includes(v);

function sanitizeStringArrayRecord(v: unknown): Record<string, string[]> {
  if (!isRecord(v)) return {};
  const out: Record<string, string[]> = {};
  for (const [k, val] of Object.entries(v)) {
    if (isDateKey(k) && Array.isArray(val)) {
      out[k] = val.filter((x): x is string => typeof x === 'string');
    }
  }
  return out;
}

function sanitizeCountRecord(v: unknown): Record<string, number> {
  if (!isRecord(v)) return {};
  const out: Record<string, number> = {};
  for (const [k, val] of Object.entries(v)) {
    if (isDateKey(k) && typeof val === 'number' && Number.isFinite(val) && val >= 0) {
      out[k] = Math.floor(val);
    }
  }
  return out;
}

function sanitizeMoodRecord(v: unknown): Record<string, ParentMood> {
  if (!isRecord(v)) return {};
  const out: Record<string, ParentMood> = {};
  for (const [k, val] of Object.entries(v)) {
    if (isDateKey(k) && isMood(val)) out[k] = val;
  }
  return out;
}

/**
 * Validates and upgrades any previously persisted shape so a schema change
 * never breaks a parent's saved data.
 */
export function migratePersistedState(raw: unknown, fromVersion: number): PersistedAppState {
  if (!isRecord(raw)) return { ...INITIAL_PERSISTED_STATE };

  const anotherCountByDate = sanitizeCountRecord(raw.anotherCountByDate);
  if (fromVersion < 2) {
    // v1 stored skipped practice ids per day; translate to an "Another" count.
    for (const [k, ids] of Object.entries(sanitizeStringArrayRecord(raw.skippedByDate))) {
      anotherCountByDate[k] = ids.length;
    }
    // v1 `lastMood` was not date-scoped; intentionally dropped.
  }

  return {
    hasCompletedOnboarding: raw.hasCompletedOnboarding === true,
    babyDob:
      typeof raw.babyDob === 'string' && parseIsoDate(raw.babyDob) ? raw.babyDob : null,
    manualStageOverride: isStageId(raw.manualStageOverride) ? raw.manualStageOverride : null,
    practicedByDate: sanitizeStringArrayRecord(raw.practicedByDate),
    anotherCountByDate,
    moodByDate: sanitizeMoodRecord(raw.moodByDate),
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...INITIAL_PERSISTED_STATE,

      setBabyDob: (dob) =>
        set({ babyDob: dob, manualStageOverride: null, hasCompletedOnboarding: true }),

      setManualStage: (stageId) => set({ manualStageOverride: stageId }),

      completeOnboardingWithStage: (stageId) =>
        set({ babyDob: null, manualStageOverride: stageId, hasCompletedOnboarding: true }),

      markPracticed: (practiceId, dateKey = getParentDayKey()) =>
        set((state) => {
          const existing = state.practicedByDate[dateKey] ?? [];
          if (existing.includes(practiceId)) return state;
          return {
            practicedByDate: pruneDateRecord(
              { ...state.practicedByDate, [dateKey]: [...existing, practiceId] },
              dateKey,
              RETENTION_DAYS,
            ),
          };
        }),

      togglePracticed: (practiceId, dateKey = getParentDayKey()) =>
        set((state) => {
          const existing = state.practicedByDate[dateKey] ?? [];
          const next = existing.includes(practiceId)
            ? existing.filter((id) => id !== practiceId)
            : [...existing, practiceId];
          return {
            practicedByDate: pruneDateRecord(
              { ...state.practicedByDate, [dateKey]: next },
              dateKey,
              RETENTION_DAYS,
            ),
          };
        }),

      showAnotherPractice: (dateKey = getParentDayKey()) =>
        set((state) => ({
          anotherCountByDate: pruneDateRecord(
            {
              ...state.anotherCountByDate,
              [dateKey]: (state.anotherCountByDate[dateKey] ?? 0) + 1,
            },
            dateKey,
            RETENTION_DAYS,
          ),
        })),

      setMood: (mood, dateKey = getParentDayKey()) =>
        set((state) => ({
          moodByDate: pruneDateRecord(
            { ...state.moodByDate, [dateKey]: mood },
            dateKey,
            RETENTION_DAYS,
          ),
        })),

      resetProfile: () => set({ ...INITIAL_PERSISTED_STATE }),
    }),
    {
      name: 'anchor-parenting-store',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorageAdapter),
      migrate: (persistedState, version) => migratePersistedState(persistedState, version),
      partialize: (state): PersistedAppState => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        babyDob: state.babyDob,
        manualStageOverride: state.manualStageOverride,
        practicedByDate: state.practicedByDate,
        anotherCountByDate: state.anotherCountByDate,
        moodByDate: state.moodByDate,
      }),
    },
  ),
);
