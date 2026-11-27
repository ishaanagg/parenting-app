import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  PARENT_MOODS,
  STAGE_IDS,
  THEME_PREFERENCES,
  type ParentMood,
  type StageId,
  type ThemePreference,
} from '../domain/types';
import { getParentDayKey, parseIsoDate, pruneDateRecord } from '../domain/stageEngine';
import { localStorageAdapter } from './storage';

/** Bump when the persisted shape changes; add a branch in migratePersistedState. */
export const STORE_VERSION = 5;
export const RETENTION_DAYS = 30;
const MAX_NAME_LENGTH = 40;

export interface PersistedAppState {
  hasCompletedOnboarding: boolean;
  parentName: string;
  babyName: string;
  babyDob: string | null;
  manualStageOverride: StageId | null;
  themePreference: ThemePreference;
  savedCardIds: string[];
  /** parentDayKey -> practice ids marked practiced */
  practicedByDate: Record<string, string[]>;
  /** parentDayKey -> how many times "Another" was tapped */
  anotherCountByDate: Record<string, number>;
  /** parentDayKey -> latest check-in (scoped per day so yesterday's mood never lingers) */
  moodByDate: Record<string, ParentMood>;
}

export interface BackupEnvelope {
  app: 'anchor';
  version: number;
  exportedAt: string;
  data: PersistedAppState;
}

export interface AppActions {
  setParentName: (name: string) => void;
  setBabyName: (name: string) => void;
  setBabyDob: (dob: string | null) => void;
  setManualStage: (stageId: StageId | null) => void;
  setThemePreference: (pref: ThemePreference) => void;
  toggleSavedCard: (cardId: string) => void;
  completeOnboardingWithStage: (stageId: StageId) => void;
  markPracticed: (practiceId: string, dateKey?: string) => void;
  togglePracticed: (practiceId: string, dateKey?: string) => void;
  showAnotherPractice: (dateKey?: string) => void;
  setMood: (mood: ParentMood, dateKey?: string) => void;
  restoreFromBackup: (rawJson: string) => { ok: true } | { ok: false; error: string };
  resetProfile: () => void;
}

export type AppStore = PersistedAppState & AppActions;

export const INITIAL_PERSISTED_STATE: PersistedAppState = {
  hasCompletedOnboarding: false,
  parentName: '',
  babyName: '',
  babyDob: null,
  manualStageOverride: null,
  themePreference: 'auto',
  savedCardIds: [],
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
const isThemePref = (v: unknown): v is ThemePreference =>
  typeof v === 'string' && (THEME_PREFERENCES as readonly string[]).includes(v);

function sanitizeName(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, MAX_NAME_LENGTH);
}

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
    for (const [k, ids] of Object.entries(sanitizeStringArrayRecord(raw.skippedByDate))) {
      anotherCountByDate[k] = ids.length;
    }
  }

  return {
    hasCompletedOnboarding: raw.hasCompletedOnboarding === true,
    parentName: sanitizeName(raw.parentName),
    babyName: sanitizeName(raw.babyName),
    babyDob:
      typeof raw.babyDob === 'string' && parseIsoDate(raw.babyDob) ? raw.babyDob : null,
    manualStageOverride: isStageId(raw.manualStageOverride) ? raw.manualStageOverride : null,
    themePreference: isThemePref(raw.themePreference) ? raw.themePreference : 'auto',
    savedCardIds: Array.isArray(raw.savedCardIds)
      ? Array.from(new Set(raw.savedCardIds.filter((x): x is string => typeof x === 'string')))
      : [],
    practicedByDate: sanitizeStringArrayRecord(raw.practicedByDate),
    anotherCountByDate,
    moodByDate: sanitizeMoodRecord(raw.moodByDate),
  };
}

/**
 * Serializes current persisted state into a portable JSON backup envelope.
 */
export function createBackupJson(state: PersistedAppState): string {
  const envelope: BackupEnvelope = {
    app: 'anchor',
    version: STORE_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      parentName: state.parentName,
      babyName: state.babyName,
      babyDob: state.babyDob,
      manualStageOverride: state.manualStageOverride,
      themePreference: state.themePreference,
      savedCardIds: state.savedCardIds,
      practicedByDate: state.practicedByDate,
      anotherCountByDate: state.anotherCountByDate,
      moodByDate: state.moodByDate,
    },
  };
  return JSON.stringify(envelope, null, 2);
}

/**
 * Parses and validates an Anchor backup JSON string without mutating live state on error.
 */
export function parseBackupJson(
  rawJson: string,
): { ok: true; state: PersistedAppState } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { ok: false, error: 'That doesn’t look like valid backup JSON.' };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'Backup file format is not recognized.' };
  }

  // Support both wrapped Anchor envelope and raw zustand persisted export
  if (parsed.app === 'anchor' && isRecord(parsed.data)) {
    const version = typeof parsed.version === 'number' ? parsed.version : STORE_VERSION;
    const migrated = migratePersistedState(parsed.data, version);
    return {
      ok: true,
      state: { ...migrated, hasCompletedOnboarding: true },
    };
  }

  if (isRecord(parsed.state) && typeof parsed.version === 'number') {
    const migrated = migratePersistedState(parsed.state, parsed.version);
    return {
      ok: true,
      state: { ...migrated, hasCompletedOnboarding: true },
    };
  }

  return { ok: false, error: 'This file is not an Anchor backup.' };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...INITIAL_PERSISTED_STATE,

      setParentName: (name) => set({ parentName: sanitizeName(name) }),

      setBabyName: (name) => set({ babyName: sanitizeName(name) }),

      setBabyDob: (dob) =>
        set((state) => ({
          babyDob: dob && parseIsoDate(dob) ? dob : null,
          manualStageOverride: dob ? null : state.manualStageOverride,
          hasCompletedOnboarding: true,
        })),

      setManualStage: (stageId) => set({ manualStageOverride: stageId }),

      setThemePreference: (themePreference) => set({ themePreference }),

      toggleSavedCard: (cardId) =>
        set((state) => ({
          savedCardIds: state.savedCardIds.includes(cardId)
            ? state.savedCardIds.filter((id) => id !== cardId)
            : [...state.savedCardIds, cardId],
        })),

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

      restoreFromBackup: (rawJson) => {
        const result = parseBackupJson(rawJson);
        if (!result.ok) return result;
        set(result.state);
        return { ok: true };
      },

      resetProfile: () => set({ ...INITIAL_PERSISTED_STATE }),
    }),
    {
      name: 'anchor-parenting-store',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorageAdapter),
      migrate: (persistedState, version) => migratePersistedState(persistedState, version),
      partialize: (state): PersistedAppState => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        parentName: state.parentName,
        babyName: state.babyName,
        babyDob: state.babyDob,
        manualStageOverride: state.manualStageOverride,
        themePreference: state.themePreference,
        savedCardIds: state.savedCardIds,
        practicedByDate: state.practicedByDate,
        anotherCountByDate: state.anotherCountByDate,
        moodByDate: state.moodByDate,
      }),
    },
  ),
);
