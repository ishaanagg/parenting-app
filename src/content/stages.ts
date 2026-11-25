import type { StageDefinition } from '../domain/types';

export const STAGES: StageDefinition[] = [
  {
    id: '0-6w',
    label: '0–6 Weeks',
    subtitle: 'Fourth Trimester',
    minWeeks: 0,
    maxWeeks: 6,
    laPauseSeconds: 60,
    laPauseNote:
      'Use this only for grunts and stirring during sleep—newborns are noisy sleepers. Full crying in a newborn usually means hunger or a real need: pick them up and feed or comfort.',
    focusSummary: 'Warmth, recovery, and noticing your own nervous system.',
  },
  {
    id: '6-12w',
    label: '6–12 Weeks',
    subtitle: 'Emerging Rhythm',
    minWeeks: 6,
    maxWeeks: 12,
    laPauseSeconds: 120,
    laPauseNote:
      'When they stir, pause up to 2 minutes and listen—many babies link sleep cycles on their own. Go to them sooner if the cry builds.',
    focusSummary: 'A gentle daily frame, La Pause, and bringing baby into your day.',
  },
  {
    id: '3-6m',
    label: '3–6 Months',
    subtitle: 'Curious Explorer',
    minWeeks: 12,
    maxWeeks: 26,
    laPauseSeconds: 150,
    laPauseNote:
      'Listen to the cry for a couple of minutes. Fussing that rises and falls often means settling; a steady, building cry means go to them.',
    focusSummary: 'Minimal interference on the floor, calm co-regulation, and togetherness.',
  },
  {
    id: '6-9m',
    label: '6–9 Months',
    subtitle: 'Sitting & Real Food',
    minWeeks: 26,
    maxWeeks: 39,
    laPauseSeconds: 180,
    laPauseNote:
      'Pause up to 3 minutes for night stirrings to hear whether they are resettling. Go in sooner if it sounds distressed.',
    focusSummary: 'Real-food exposure at the family table, early autonomy, and behavior as communication.',
  },
  {
    id: '9-12m',
    label: '9–12 Months',
    subtitle: 'Early Autonomy',
    minWeeks: 39,
    maxWeeks: 53,
    laPauseSeconds: 180,
    laPauseNote:
      'A calm pause of a few minutes lets you hear whether they are resettling. Go to them whenever the cry sounds distressed—La Pause is a pause, not a rule.',
    focusSummary: 'Le Cadre (clear, warm boundaries), tiny helping tasks, and repair.',
  },
];
