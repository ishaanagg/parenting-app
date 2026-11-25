import type {
  MomentTag,
  PracticeRep,
  StageDefinition,
  StageId,
  WisdomCard,
} from './types';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Calculates baby's completed age in whole weeks from an ISO date string (YYYY-MM-DD).
 * Clamps to 0 for future or invalid dates.
 */
export function calculateAgeInWeeks(dobIso: string, now: Date = new Date()): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobIso.trim());
  if (!match) return 0;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const dob = new Date(year, month, day);

  if (Number.isNaN(dob.getTime())) return 0;

  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = todayMidnight.getTime() - dob.getTime();
  if (diffMs <= 0) return 0;

  return Math.floor(diffMs / MS_PER_WEEK);
}

/**
 * Maps an age in weeks to the matching stage definition.
 * Falls back to the final stage for ages beyond the upper bound so future stages scale cleanly.
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

/**
 * Returns a local YYYY-MM-DD key for deterministic daily practice selection.
 */
export function getDateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Night-first tone window (21:00 to 05:59 local time).
 */
export function isNightHours(now: Date = new Date()): boolean {
  const hour = now.getHours();
  return hour >= 21 || hour < 6;
}

/**
 * Deterministically picks one PracticeRep for the given stage and date,
 * cycling past any skipped IDs when the user taps "Show another".
 */
export function pickDailyPractice(params: {
  stageId: StageId;
  practices: readonly PracticeRep[];
  dateKey: string;
  skippedIds?: readonly string[];
}): PracticeRep | undefined {
  const stagePractices = params.practices.filter((p) =>
    p.stages.includes(params.stageId),
  );
  if (stagePractices.length === 0) return undefined;

  const skippedSet = new Set(params.skippedIds ?? []);
  const available = stagePractices.filter((p) => !skippedSet.has(p.id));
  const pool = available.length > 0 ? available : stagePractices;

  let hash = 0;
  for (let i = 0; i < params.dateKey.length; i++) {
    hash = (hash * 31 + params.dateKey.charCodeAt(i)) >>> 0;
  }

  return pool[hash % pool.length];
}

/**
 * Filters wisdom cards by current stage and optional moment tag.
 */
export function filterWisdomCards(params: {
  stageId: StageId;
  moment: MomentTag | 'all';
  cards: readonly WisdomCard[];
}): WisdomCard[] {
  return params.cards.filter((card) => {
    const matchesStage = card.stages.includes(params.stageId);
    const matchesMoment =
      params.moment === 'all' || card.moments.includes(params.moment);
    return matchesStage && matchesMoment;
  });
}
