import { describe, expect, it } from 'vitest';
import { filterWisdomCards } from '../domain/stageEngine';
import { STAGE_IDS, type MomentTag } from '../domain/types';
import { PRACTICES } from './practices';
import { STAGES } from './stages';
import { WISDOM_CARDS } from './wisdom';

const ALL_MOMENTS: MomentTag[] = [
  '3am',
  'fussy',
  'sleep',
  'feeding',
  'triggers',
  'repair',
];

describe('content packs integrity', () => {
  it('defines every StageId in STAGES', () => {
    expect(STAGES.map((s) => s.id)).toEqual([...STAGE_IDS]);
  });

  it('provides at least 3 distinct practices for every stage', () => {
    for (const stageId of STAGE_IDS) {
      const stagePractices = PRACTICES.filter((p) => p.stages.includes(stageId));
      expect(stagePractices.length, `Stage ${stageId} practices`).toBeGreaterThanOrEqual(3);
    }
  });

  it('provides at least 1 wisdom card for every stage + moment combination', () => {
    for (const stageId of STAGE_IDS) {
      for (const moment of ALL_MOMENTS) {
        const cards = filterWisdomCards({ stageId, moment, cards: WISDOM_CARDS });
        expect(
          cards.length,
          `Missing wisdom card for stage=${stageId} moment=${moment}`,
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
