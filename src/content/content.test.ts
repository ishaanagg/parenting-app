import { describe, expect, it } from 'vitest';
import { filterWisdomCards } from '../domain/stageEngine';
import { STAGE_IDS, type BookFramework, type MomentTag } from '../domain/types';
import { AGE_GUIDES } from './ageGuides';
import { FRAMEWORK_GUIDES, FRAMEWORK_LABELS } from './frameworks';
import { HOW_TO_GUIDES } from './howToGuides';
import { PRACTICES } from './practices';
import { STAGES } from './stages';
import { WISDOM_CARDS } from './wisdom';

const BASE_MOMENTS: MomentTag[] = [
  '3am',
  'fussy',
  'sleep',
  'feeding',
  'triggers',
  'repair',
];

describe('content packs integrity (0–3y)', () => {
  it('defines every StageId in STAGES with contiguous week boundaries up to 3 years', () => {
    expect(STAGES.map((s) => s.id)).toEqual([...STAGE_IDS]);
    expect(STAGES[0]?.minWeeks).toBe(0);
    expect(STAGES[STAGES.length - 1]?.maxWeeks).toBe(156);
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i]?.minWeeks).toBe(STAGES[i - 1]?.maxWeeks);
    }
  });

  it('defines plain-English theme labels and book attributions for all 7 philosophy lenses', () => {
    const keys = Object.keys(FRAMEWORK_LABELS) as BookFramework[];
    expect(keys.length).toBe(7);
    for (const key of keys) {
      const guide = FRAMEWORK_GUIDES[key];
      expect(guide.shortLabel).toBe(FRAMEWORK_LABELS[key]);
      expect(guide.sourceBooks.length).toBeGreaterThanOrEqual(1);
      expect(guide.pillars.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('provides at least 3 kid practices and at least 3 couple/self habits for every stage', () => {
    for (const stageId of STAGE_IDS) {
      const kidPractices = PRACTICES.filter(
        (p) => (p.track ?? 'kid') === 'kid' && p.stages.includes(stageId),
      );
      const couplePractices = PRACTICES.filter(
        (p) => p.track === 'couple' && p.stages.includes(stageId),
      );
      expect(kidPractices.length, `Stage ${stageId} kid practices`).toBeGreaterThanOrEqual(3);
      expect(couplePractices.length, `Stage ${stageId} couple practices`).toBeGreaterThanOrEqual(3);
    }
  });

  it('provides at least 1 wisdom card for every stage + applicable moment combination', () => {
    for (const stage of STAGES) {
      const moments: MomentTag[] =
        stage.minWeeks >= 26 ? [...BASE_MOMENTS, 'boundaries'] : BASE_MOMENTS;
      for (const moment of moments) {
        const cards = filterWisdomCards({ stageId: stage.id, moment, cards: WISDOM_CARDS });
        expect(
          cards.length,
          `Missing wisdom card for stage=${stage.id} moment=${moment}`,
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('provides a complete 5-card, 3-bullet By Age cheat sheet for every stage', () => {
    for (const stageId of STAGE_IDS) {
      const guide = AGE_GUIDES[stageId];
      expect(guide.stageId).toBe(stageId);
      expect(guide.headline.length).toBeGreaterThan(10);
      expect(guide.keyShift.length).toBeGreaterThan(10);
      expect(guide.sections.length).toBe(5);
      for (const section of guide.sections) {
        expect(section.bullets.length).toBe(3);
      }
    }
  });

  it('provides unified How-To guides with 3 quick steps across every stage', () => {
    expect(HOW_TO_GUIDES.length).toBeGreaterThanOrEqual(18);
    for (const guide of HOW_TO_GUIDES) {
      expect(guide.quickSteps.length).toBe(3);
    }
    for (const stageId of STAGE_IDS) {
      const stageGuides = HOW_TO_GUIDES.filter((g) => g.stages.includes(stageId));
      expect(stageGuides.length, `Stage ${stageId} How-To guides`).toBeGreaterThanOrEqual(6);
    }
  });
});
