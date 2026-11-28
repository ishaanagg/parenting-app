import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  PARENT_MOODS,
  PERSONAL_TIME_CHIPS,
  STAGE_IDS,
  THEME_PREFERENCES,
  type ParentMood,
  type PersonalTimeChipId,
  type PracticeTrack,
  type StageId,
  type ThemePreference,
  type WeeklyPersonalTime,
} from '../domain/types';
import {
  getParentDayKey,
  getParentWeekKey,
  parseIsoDate,
  pruneDateRecord,
} from '../domain/stageEngine';
import { localStorageAdapter } from './storage';

/** Bump when the persisted shape changes; add a branch in migratePersistedState. */
export const STORE_VERSION = 7;
export const RETENTION_DAYS = 30;
const MAX_WEEK_ENTRIES = 12;
const MAX_NAME_LENGTH = 40;
const MAX_RULE_LENGTH = 120;
const MAX_CUSTOM_RULES = 10;

const VALID_CHIP_IDS = new Set<string>(PERSONAL_TIME_CHIPS.map((c) => c.id));

export interface PersistedAppState {
  hasCompletedOnboarding: boolean;
  parentName: string;
  partnerName: string;
  babyName: string;
  babyDob: string | null;
  manualStageOverride: StageId | null;
  themePreference: ThemePreference;
  savedCardIds: string[];
  /** parentDayKey -> practice ids marked practiced/done (across both kid & couple tracks) */
  practicedByDate: Record<string, string[]>;
  /** parentDayKey -> how many times "Another" was tapped on the kid card */
  anotherCountByDate: Record<string, number>;
  /** parentDayKey -> how many times "Another" was tapped on the couple/self card */
  coupleAnotherCountByDate: Record<string, number>;
  /** parentDayKey -> latest check-in (scoped per day so yesterday's mood never lingers) */
  moodByDate: Record<string, ParentMood>;
  /** Pinned preset house rule IDs (United Adult Front) */
  pinnedHouseRuleIds: string[];
  /** User-authored 1-line custom house rules */
  customHouseRules: string[];
  /** Current offset into COUPLE_CHECKIN_PROMPTS */
  couplePromptOffset: number;
  /** parentWeekKey (YYYY-Www) -> whether couple completed weekly 5-min check-in */
  coupleCheckInByWeek: Record<string, boolean>;
  /** parentWeekKey (YYYY-Www) -> selected personal time chips for self & partner */
  personalTimeByWeek: Record<string, WeeklyPersonalTime>;
}

export interface BackupEnvelope {
  app: 'anchor';
  version: number;
  exportedAt: string;
  data: PersistedAppState;
}

export interface AppActions {
  setParentName: (name: string) => void;
  setPartnerName: (name: string) => void;
  setBabyName: (name: string) => void;
  setBabyDob: (dob: string | null) => void;
  setManualStage: (stageId: StageId | null) => void;
  setThemePreference: (pref: ThemePreference) => void;
  toggleSavedCard: (cardId: string) => void;
  completeOnboardingWithStage: (stageId: StageId) => void;
  markPracticed: (practiceId: string, dateKey?: string) => void;
  togglePracticed: (practiceId: string, dateKey?: string) => void;
  showAnotherPractice: (dateKey?: string, track?: PracticeTrack) => void;
  setMood: (mood: ParentMood, dateKey?: string) => void;
  togglePinnedHouseRule: (ruleId: string) => void;
  addCustomHouseRule: (ruleText: string) => void;
  removeCustomHouseRule: (ruleText: string) => void;
  nextCouplePrompt: () => void;
  toggleCoupleCheckIn: (weekKey?: string) => void;
  togglePersonalTimeChip: (
    who: 'self' | 'partner',
    chipId: PersonalTimeChipId,
    weekKey?: string,
  ) => void;
  restoreFromBackup: (rawJson: string) => { ok: true } | { ok: false; error: string };
  resetProfile: () => void;
}

export type AppStore = PersistedAppState & AppActions;

export const INITIAL_PERSISTED_STATE: PersistedAppState = {
  hasCompletedOnboarding: false,
  parentName: '',
  partnerName: '',
  babyName: '',
  babyDob: null,
  manualStageOverride: null,
  themePreference: 'auto',
  savedCardIds: [],
  practicedByDate: {},
  anotherCountByDate: {},
  coupleAnotherCountByDate: {},
  moodByDate: {},
  pinnedHouseRuleIds: [],
  customHouseRules: [],
  couplePromptOffset: 0,
  coupleCheckInByWeek: {},
  personalTimeByWeek: {},
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const isDateKey = (k: string) => parseIsoDate(k) !== null;
const isWeekKey = (k: string) => /^\d{4}-W\d{2}$/.test(k);
const isStageId = (v: unknown): v is StageId =>
  typeof v === 'string' && (STAGE_IDS as readonly string[]).includes(v);
const isMood = (v: unknown): v is ParentMood =>
  typeof v === 'string' && (PARENT_MOODS as readonly string[]).includes(v);
const isThemePref = (v: unknown): v is ThemePreference =>
  typeof v === 'string' && (THEME_PREFERENCES as readonly string[]).includes(v);
const isChipId = (v: unknown): v is PersonalTimeChipId =>
  typeof v === 'string' && VALID_CHIP_IDS.has(v);

function sanitizeName(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, MAX_NAME_LENGTH);
}

function sanitizeUniqueStrings(v: unknown, maxLen = 120, maxItems = 200): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    if (typeof item === 'string') {
      const trimmed = item.trim().slice(0, maxLen);
      if (trimmed && !out.includes(trimmed)) {
        out.push(trimmed);
        if (out.length >= maxItems) break;
      }
    }
  }
  return out;
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

function pruneWeekRecord<T>(record: Record<string, T>): Record<string, T> {
  const keys = Object.keys(record).sort();
  if (keys.length <= MAX_WEEK_ENTRIES) return record;
  const keep = new Set(keys.slice(keys.length - MAX_WEEK_ENTRIES));
  return Object.fromEntries(Object.entries(record).filter(([k]) => keep.has(k)));
}

function sanitizeWeekBooleanRecord(v: unknown): Record<string, boolean> {
  if (!isRecord(v)) return {};
  const out: Record<string, boolean> = {};
  for (const [k, val] of Object.entries(v)) {
    if (isWeekKey(k) && typeof val === 'boolean') {
      out[k] = val;
    }
  }
  return pruneWeekRecord(out);
}

function sanitizePersonalTimeRecord(v: unknown): Record<string, WeeklyPersonalTime> {
  if (!isRecord(v)) return {};
  const out: Record<string, WeeklyPersonalTime> = {};
  for (const [k, val] of Object.entries(v)) {
    if (isWeekKey(k) && isRecord(val)) {
      const self = Array.isArray(val.self) ? Array.from(new Set(val.self.filter(isChipId))) : [];
      const partner = Array.isArray(val.partner)
        ? Array.from(new Set(val.partner.filter(isChipId)))
        : [];
      out[k] = { self, partner };
    }
  }
  return pruneWeekRecord(out);
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

  const promptOffset =
    typeof raw.couplePromptOffset === 'number' &&
    Number.isFinite(raw.couplePromptOffset) &&
    raw.couplePromptOffset >= 0
      ? Math.floor(raw.couplePromptOffset)
      : 0;

  return {
    hasCompletedOnboarding: raw.hasCompletedOnboarding === true,
    parentName: sanitizeName(raw.parentName),
    partnerName: sanitizeName(raw.partnerName),
    babyName: sanitizeName(raw.babyName),
    babyDob:
      typeof raw.babyDob === 'string' && parseIsoDate(raw.babyDob) ? raw.babyDob : null,
    manualStageOverride: isStageId(raw.manualStageOverride) ? raw.manualStageOverride : null,
    themePreference: isThemePref(raw.themePreference) ? raw.themePreference : 'auto',
    savedCardIds: sanitizeUniqueStrings(raw.savedCardIds),
    practicedByDate: sanitizeStringArrayRecord(raw.practicedByDate),
    anotherCountByDate,
    coupleAnotherCountByDate: sanitizeCountRecord(raw.coupleAnotherCountByDate),
    moodByDate: sanitizeMoodRecord(raw.moodByDate),
    pinnedHouseRuleIds: sanitizeUniqueStrings(raw.pinnedHouseRuleIds),
    customHouseRules: sanitizeUniqueStrings(raw.customHouseRules, MAX_RULE_LENGTH, MAX_CUSTOM_RULES),
    couplePromptOffset: promptOffset,
    coupleCheckInByWeek: sanitizeWeekBooleanRecord(raw.coupleCheckInByWeek),
    personalTimeByWeek: sanitizePersonalTimeRecord(raw.personalTimeByWeek),
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
      partnerName: state.partnerName,
      babyName: state.babyName,
      babyDob: state.babyDob,
      manualStageOverride: state.manualStageOverride,
      themePreference: state.themePreference,
      savedCardIds: state.savedCardIds,
      practicedByDate: state.practicedByDate,
      anotherCountByDate: state.anotherCountByDate,
      coupleAnotherCountByDate: state.coupleAnotherCountByDate,
      moodByDate: state.moodByDate,
      pinnedHouseRuleIds: state.pinnedHouseRuleIds,
      customHouseRules: state.customHouseRules,
      couplePromptOffset: state.couplePromptOffset,
      coupleCheckInByWeek: state.coupleCheckInByWeek,
      personalTimeByWeek: state.personalTimeByWeek,
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

      setPartnerName: (name) => set({ partnerName: sanitizeName(name) }),

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

      showAnotherPractice: (dateKey = getParentDayKey(), track = 'kid') =>
        set((state) => {
          if (track === 'couple') {
            return {
              coupleAnotherCountByDate: pruneDateRecord(
                {
                  ...state.coupleAnotherCountByDate,
                  [dateKey]: (state.coupleAnotherCountByDate[dateKey] ?? 0) + 1,
                },
                dateKey,
                RETENTION_DAYS,
              ),
            };
          }
          return {
            anotherCountByDate: pruneDateRecord(
              {
                ...state.anotherCountByDate,
                [dateKey]: (state.anotherCountByDate[dateKey] ?? 0) + 1,
              },
              dateKey,
              RETENTION_DAYS,
            ),
          };
        }),

      setMood: (mood, dateKey = getParentDayKey()) =>
        set((state) => ({
          moodByDate: pruneDateRecord(
            { ...state.moodByDate, [dateKey]: mood },
            dateKey,
            RETENTION_DAYS,
          ),
        })),

      togglePinnedHouseRule: (ruleId) =>
        set((state) => ({
          pinnedHouseRuleIds: state.pinnedHouseRuleIds.includes(ruleId)
            ? state.pinnedHouseRuleIds.filter((id) => id !== ruleId)
            : [...state.pinnedHouseRuleIds, ruleId],
        })),

      addCustomHouseRule: (ruleText) =>
        set((state) => {
          const trimmed = ruleText.trim().slice(0, MAX_RULE_LENGTH);
          if (!trimmed || state.customHouseRules.includes(trimmed)) return state;
          if (state.customHouseRules.length >= MAX_CUSTOM_RULES) return state;
          return { customHouseRules: [...state.customHouseRules, trimmed] };
        }),

      removeCustomHouseRule: (ruleText) =>
        set((state) => ({
          customHouseRules: state.customHouseRules.filter((r) => r !== ruleText),
        })),

      nextCouplePrompt: () =>
        set((state) => ({ couplePromptOffset: state.couplePromptOffset + 1 })),

      toggleCoupleCheckIn: (weekKey = getParentWeekKey()) =>
        set((state) => ({
          coupleCheckInByWeek: pruneWeekRecord({
            ...state.coupleCheckInByWeek,
            [weekKey]: !state.coupleCheckInByWeek[weekKey],
          }),
        })),

      togglePersonalTimeChip: (who, chipId, weekKey = getParentWeekKey()) =>
        set((state) => {
          const current = state.personalTimeByWeek[weekKey] ?? { self: [], partner: [] };
          const list = current[who];
          const nextList = list.includes(chipId)
            ? list.filter((c) => c !== chipId)
            : [...list, chipId];
          return {
            personalTimeByWeek: pruneWeekRecord({
              ...state.personalTimeByWeek,
              [weekKey]: { ...current, [who]: nextList },
            }),
          };
        }),

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
        partnerName: state.partnerName,
        babyName: state.babyName,
        babyDob: state.babyDob,
        manualStageOverride: state.manualStageOverride,
        themePreference: state.themePreference,
        savedCardIds: state.savedCardIds,
        practicedByDate: state.practicedByDate,
        anotherCountByDate: state.anotherCountByDate,
        coupleAnotherCountByDate: state.coupleAnotherCountByDate,
        moodByDate: state.moodByDate,
        pinnedHouseRuleIds: state.pinnedHouseRuleIds,
        customHouseRules: state.customHouseRules,
        couplePromptOffset: state.couplePromptOffset,
        coupleCheckInByWeek: state.coupleCheckInByWeek,
        personalTimeByWeek: state.personalTimeByWeek,
      }),
    },
  ),
);
