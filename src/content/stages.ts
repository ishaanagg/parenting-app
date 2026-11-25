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
      'Newborns have noisy active sleep. Pause 60 seconds to see if they settle before picking up.',
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
      'Give a calm 2-minute pause when they stir—many babies link sleep cycles on their own.',
    focusSummary: 'Gentle daily rhythm, La Pause, and bringing baby into your day.',
  },
  {
    id: '3-6m',
    label: '3–6 Months',
    subtitle: 'Curious Explorer',
    minWeeks: 12,
    maxWeeks: 26,
    laPauseSeconds: 150,
    laPauseNote:
      'Listen to the pitch of the cry for 2–3 minutes. Fussing often means settling, not distress.',
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
      'Pause 3 minutes for night stirrings unless it escalates into a true distress cry.',
    focusSummary: 'Family-table real food exposure, early autonomy, and behavior as communication.',
  },
  {
    id: '9-12m',
    label: '9–12 Months',
    subtitle: 'Early Autonomy',
    minWeeks: 39,
    maxWeeks: 53,
    laPauseSeconds: 180,
    laPauseNote:
      'Hold a steady 3-minute pause at night—familiarizing them with self-settling inside Le Cadre.',
    focusSummary: 'Le Cadre (clear boundaries with warmth), tiny helping tasks, and repair.',
  },
];
