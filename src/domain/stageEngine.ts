import type {
  HowToCategoryId,
  HowToGuide,
  PracticeRep,
  PracticeTrack,
  StageDefinition,
  StageId,
} from './types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;

/**
 * The "parent day" rolls over at 4 AM, so a 3 AM wake-up still belongs to the
 * same night as the evening before (practice + check-in don't reset mid-night).
 */
export const PARENT_DAY_ROLLOVER_HOUR = 4;

const pad2 = (n: number) => String(n).padStart(2, '0');

export interface IsoDateParts {
  year: number;
  /** 0-based month */
  month: number;
  day: number;
}

/**
 * Strictly parses YYYY-MM-DD. Rejects rollover dates like 2026-02-31.
 */
export function parseIsoDate(iso: string): IsoDateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/**
 * Baby's completed age in whole weeks. Uses UTC calendar-day math so DST
 * transitions never cause off-by-one errors on stage-boundary days.
 * Clamps to 0 for future or invalid dates.
 */
export function calculateAgeInWeeks(dobIso: string, now: Date = new Date()): number {
  const dob = parseIsoDate(dobIso);
  if (!dob) return 0;
  const dobDay = Date.UTC(dob.year, dob.month, dob.day) / MS_PER_DAY;
  const today =
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / MS_PER_DAY;
  const diffDays = Math.round(today - dobDay);
  if (diffDays <= 0) return 0;
  return Math.floor(diffDays / 7);
}

/**
 * Maps an age in weeks to the matching stage definition.
 * Falls back to the final stage for ages beyond the upper bound.
 */
export function getStageForWeek(
  weeks: number,
  stages: readonly StageDefinition[],
): StageDefinition {
  const safeWeeks = Math.max(0, weeks);
  const matched = stages.find(
    (stage) => safeWeeks >= stage.minWeeks && safeWeeks < stage.maxWeeks,
  );
  if (matched) return matched;

  const fallback = stages[stages.length - 1];
  if (!fallback) {
    throw new Error('Stage definitions list cannot be empty');
  }
  return fallback;
}

/** Local calendar YYYY-MM-DD. */
export function getDateKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

/** Day key that rolls over at PARENT_DAY_ROLLOVER_HOUR instead of midnight. */
export function getParentDayKey(now: Date = new Date()): string {
  return getDateKey(new Date(now.getTime() - PARENT_DAY_ROLLOVER_HOUR * MS_PER_HOUR));
}

/** Night-first tone window (21:00 to 05:59 local time). */
export function isNightHours(now: Date = new Date()): boolean {
  const hour = now.getHours();
  return hour >= 21 || hour < 6;
}

/** Late-afternoon work-to-home transition window (16:00 to 19:00 local time). */
export function isAfterWorkHours(now: Date = new Date()): boolean {
  const hour = now.getHours();
  return hour >= 16 && hour < 19;
}

/**
 * Monday-anchored ISO week key (YYYY-Www) using the 4 AM parent-day rollover,
 * so weekly Couple Check-In and Personal Time chips reset cleanly each Monday morning.
 */
export function getParentWeekKey(now: Date = new Date()): string {
  const dayKey = getParentDayKey(now);
  const parts = parseIsoDate(dayKey);
  const utc = parts
    ? new Date(Date.UTC(parts.year, parts.month, parts.day))
    : new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  // ISO week: shift to Thursday of the same Monday-Sunday week
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utc.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
  return `${utc.getUTCFullYear()}-W${pad2(weekNo)}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Deterministically picks one PracticeRep for the stage and day.
 * `offset` increments each time the parent taps "Another" and wraps forever,
 * so the rotation never dead-ends.
 */
export function pickDailyPractice(params: {
  stageId: StageId;
  practices: readonly PracticeRep[];
  dateKey: string;
  offset?: number;
  track?: PracticeTrack;
}): PracticeRep | undefined {
  const targetTrack = params.track ?? 'kid';
  const pool = params.practices.filter(
    (p) => (p.track ?? 'kid') === targetTrack && p.stages.includes(params.stageId),
  );
  if (pool.length === 0) return undefined;
  const offset = Math.max(0, Math.floor(params.offset ?? 0));
  return pool[(hashString(`${params.dateKey}:${targetTrack}`) + offset) % pool.length];
}

/** Filters unified How-To guides by current stage and optional situation category. */
export function filterHowToGuides(params: {
  stageId: StageId;
  category: HowToCategoryId | 'all';
  guides: readonly HowToGuide[];
}): HowToGuide[] {
  return params.guides.filter((guide) => {
    const matchesStage = guide.stages.includes(params.stageId);
    const matchesCategory =
      params.category === 'all' || guide.categories.includes(params.category);
    return matchesStage && matchesCategory;
  });
}

/**
 * Drops date-keyed entries older than `keepDays` before `todayKey`
 * so local storage never grows without bound.
 */
export function pruneDateRecord<T>(
  record: Readonly<Record<string, T>>,
  todayKey: string,
  keepDays: number,
): Record<string, T> {
  const today = parseIsoDate(todayKey);
  if (!today) return { ...record };
  const cutoff = new Date(Date.UTC(today.year, today.month, today.day - keepDays));
  const cutoffKey = `${cutoff.getUTCFullYear()}-${pad2(cutoff.getUTCMonth() + 1)}-${pad2(
    cutoff.getUTCDate(),
  )}`;
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => key >= cutoffKey),
  );
}
