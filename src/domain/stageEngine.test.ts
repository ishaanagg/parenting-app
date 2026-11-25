import { describe, expect, it } from 'vitest';
import {
  calculateAgeInWeeks,
  filterWisdomCards,
  getDateKey,
  getParentDayKey,
  getStageForWeek,
  isNightHours,
  parseIsoDate,
  pickDailyPractice,
  pruneDateRecord,
} from './stageEngine';
import type { PracticeRep, StageDefinition, WisdomCard } from './types';

const TEST_STAGES: StageDefinition[] = [
  {
    id: '0-6w',
    label: '0–6 Weeks',
    subtitle: 'Fourth Trimester',
    minWeeks: 0,
    maxWeeks: 6,
    laPauseSeconds: 60,
    laPauseNote: 'Active sleep is noisy.',
    focusSummary: 'Warmth and recovery.',
  },
  {
    id: '6-12w',
    label: '6–12 Weeks',
    subtitle: 'Emerging Rhythm',
    minWeeks: 6,
    maxWeeks: 12,
    laPauseSeconds: 120,
    laPauseNote: 'Pause to observe.',
    focusSummary: 'Gentle rhythm.',
  },
];

const makePractice = (id: string): PracticeRep => ({
  id,
  stages: ['0-6w'],
  framework: 'hgp',
  title: id,
  prompt: id,
  whyItWorks: id,
});

describe('parseIsoDate', () => {
  it('rejects malformed and rollover dates', () => {
    expect(parseIsoDate('2026-02-31')).toBeNull();
    expect(parseIsoDate('nope')).toBeNull();
    expect(parseIsoDate('2026-02-28')).toEqual({ year: 2026, month: 1, day: 28 });
  });
});

describe('calculateAgeInWeeks', () => {
  it('calculates completed weeks accurately', () => {
    const now = new Date(2026, 10, 25);
    expect(calculateAgeInWeeks('2026-11-11', now)).toBe(2);
    expect(calculateAgeInWeeks('2026-10-01', now)).toBe(7);
  });

  it('is not off-by-one across a DST transition', () => {
    // US spring-forward is 2026-03-08
    expect(calculateAgeInWeeks('2026-03-01', new Date(2026, 2, 15, 0, 30))).toBe(2);
  });

  it('clamps future or invalid dates to 0', () => {
    const now = new Date(2026, 10, 25);
    expect(calculateAgeInWeeks('2026-12-01', now)).toBe(0);
    expect(calculateAgeInWeeks('2026-02-31', now)).toBe(0);
    expect(calculateAgeInWeeks('not-a-date', now)).toBe(0);
  });
});

describe('getStageForWeek', () => {
  it('selects matching stage and falls back to last stage for older ages', () => {
    expect(getStageForWeek(0, TEST_STAGES).id).toBe('0-6w');
    expect(getStageForWeek(5, TEST_STAGES).id).toBe('0-6w');
    expect(getStageForWeek(6, TEST_STAGES).id).toBe('6-12w');
    expect(getStageForWeek(60, TEST_STAGES).id).toBe('6-12w');
  });
});

describe('pickDailyPractice', () => {
  const practices = [makePractice('p1'), makePractice('p2'), makePractice('p3')];

  it('is deterministic for a given day and offset', () => {
    const a = pickDailyPractice({ stageId: '0-6w', practices, dateKey: '2026-11-25' });
    const b = pickDailyPractice({ stageId: '0-6w', practices, dateKey: '2026-11-25' });
    expect(a?.id).toBe(b?.id);
  });

  it('cycles through every practice and wraps forever (never dead-ends)', () => {
    const seen = new Set<string>();
    for (let offset = 0; offset < 7; offset++) {
      const pick = pickDailyPractice({
        stageId: '0-6w',
        practices,
        dateKey: '2026-11-25',
        offset,
      });
      seen.add(pick!.id);
      const next = pickDailyPractice({
        stageId: '0-6w',
        practices,
        dateKey: '2026-11-25',
        offset: offset + 1,
      });
      expect(next!.id).not.toBe(pick!.id);
    }
    expect(seen.size).toBe(3);
  });

  it('handles a single-practice stage and empty stages', () => {
    const single = [makePractice('only')];
    expect(
      pickDailyPractice({ stageId: '0-6w', practices: single, dateKey: 'x', offset: 5 })?.id,
    ).toBe('only');
    expect(
      pickDailyPractice({ stageId: '9-12m', practices: single, dateKey: 'x' }),
    ).toBeUndefined();
  });
});

describe('filterWisdomCards', () => {
  const cards: WisdomCard[] = [
    {
      id: 'c1',
      stages: ['0-6w'],
      framework: 'le-cadre',
      moments: ['3am', 'sleep'],
      title: 'La Pause',
      insight: 'Wait briefly.',
      tryNow: 'Count to 60.',
    },
    {
      id: 'c2',
      stages: ['6-12w'],
      framework: 'hgp',
      moments: ['fussy'],
      title: 'Togetherness',
      insight: 'Step outside.',
      tryNow: 'Walk for 5 min.',
    },
  ];

  it('filters by stage and moment', () => {
    expect(
      filterWisdomCards({ stageId: '0-6w', moment: '3am', cards }).map((c) => c.id),
    ).toEqual(['c1']);
    expect(filterWisdomCards({ stageId: '0-6w', moment: 'fussy', cards })).toEqual([]);
  });
});

describe('date helpers', () => {
  it('formats date keys and night hours', () => {
    expect(getDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(isNightHours(new Date(2026, 0, 5, 3, 15))).toBe(true);
    expect(isNightHours(new Date(2026, 0, 5, 14, 0))).toBe(false);
  });

  it('keeps 3 AM in the previous parent day, rolls over at 4 AM', () => {
    expect(getParentDayKey(new Date(2026, 0, 6, 3, 0))).toBe('2026-01-05');
    expect(getParentDayKey(new Date(2026, 0, 6, 4, 0))).toBe('2026-01-06');
  });

  it('prunes date records older than the retention window', () => {
    const pruned = pruneDateRecord(
      { '2026-01-01': 1, '2026-01-20': 2, '2026-01-31': 3 },
      '2026-01-31',
      14,
    );
    expect(Object.keys(pruned)).toEqual(['2026-01-20', '2026-01-31']);
  });
});
