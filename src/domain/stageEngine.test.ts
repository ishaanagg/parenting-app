import { describe, expect, it } from 'vitest';
import {
  calculateAgeInWeeks,
  filterWisdomCards,
  getDateKey,
  getStageForWeek,
  isNightHours,
  pickDailyPractice,
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

describe('calculateAgeInWeeks', () => {
  it('calculates completed weeks accurately', () => {
    const now = new Date(2026, 10, 25); // Nov 25, 2026
    expect(calculateAgeInWeeks('2026-11-11', now)).toBe(2);
    expect(calculateAgeInWeeks('2026-10-01', now)).toBe(7);
  });

  it('clamps future or invalid dates to 0', () => {
    const now = new Date(2026, 10, 25);
    expect(calculateAgeInWeeks('2026-12-01', now)).toBe(0);
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
  const practices: PracticeRep[] = [
    {
      id: 'p1',
      stages: ['0-6w'],
      framework: 'hgp',
      title: 'Practice 1',
      prompt: 'Prompt 1',
      whyItWorks: 'Why 1',
    },
    {
      id: 'p2',
      stages: ['0-6w'],
      framework: 'perry',
      title: 'Practice 2',
      prompt: 'Prompt 2',
      whyItWorks: 'Why 2',
    },
  ];

  it('returns deterministic practice and cycles when skipped', () => {
    const first = pickDailyPractice({
      stageId: '0-6w',
      practices,
      dateKey: '2026-11-25',
    });
    expect(first).toBeDefined();

    const second = pickDailyPractice({
      stageId: '0-6w',
      practices,
      dateKey: '2026-11-25',
      skippedIds: first ? [first.id] : [],
    });
    expect(second).toBeDefined();
    expect(second?.id).not.toBe(first?.id);
  });
});

describe('filterWisdomCards & helpers', () => {
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
    expect(
      filterWisdomCards({ stageId: '0-6w', moment: 'fussy', cards }),
    ).toEqual([]);
  });

  it('formats date keys and night hours', () => {
    expect(getDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(isNightHours(new Date(2026, 0, 5, 3, 15))).toBe(true);
    expect(isNightHours(new Date(2026, 0, 5, 14, 0))).toBe(false);
  });
});
