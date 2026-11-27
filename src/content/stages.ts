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
    focusSummary: 'Warmth, outdoor daylight, and protecting each other’s recovery.',
  },
  {
    id: '6-12w',
    label: '6–12 Weeks',
    subtitle: 'Peak Fussiness & Rhythm',
    minWeeks: 6,
    maxWeeks: 12,
    laPauseSeconds: 120,
    laPauseNote:
      'When they stir, pause up to 2 minutes and listen—many babies link sleep cycles on their own. Go to them sooner if the cry builds.',
    focusSummary: 'Bringing baby into your real day, La Pause, and riding out evening fussiness as a team.',
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
    focusSummary: 'Uninterrupted floor play, predictable sleep anchors, and reclaiming adult evenings.',
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
    focusSummary: 'Shared family meals without pressure, safe "yes" spaces, and calm curiosity.',
  },
  {
    id: '9-12m',
    label: '9–12 Months',
    subtitle: 'Mobility & Separation',
    minWeeks: 39,
    maxWeeks: 52,
    laPauseSeconds: 180,
    laPauseNote:
      'A calm pause of a few minutes lets you hear whether they are resettling. Go to them whenever the cry sounds distressed—La Pause is a pause, not a rule.',
    focusSummary: 'Steady Safe Haven + Launchpad, one-sentence boundaries, and tiny helping tasks.',
  },
  {
    id: '12-18m',
    label: '12–18 Months',
    subtitle: 'Early Toddler',
    minWeeks: 52,
    maxWeeks: 78,
    laPauseSeconds: 180,
    laPauseNote:
      'Wait up to 3 minutes if they stir or stand briefly at night so they have room to lie back down on their own.',
    focusSummary: 'Real household jobs, un-angry physical limits, and calm faces when they tumble.',
  },
  {
    id: '18-24m',
    label: '18–24 Months',
    subtitle: 'Big Feelings & Limits',
    minWeeks: 78,
    maxWeeks: 104,
    laPauseSeconds: 180,
    laPauseNote:
      'Pause 2–3 minutes on brief night call-outs; keep any check-in calm, brief, and boring.',
    focusSummary: '5-second validation + firm boundaries, two real choices, and united adult teamwork.',
  },
  {
    id: '2-3y',
    label: '2–3 Years',
    subtitle: 'Grit & Character',
    minWeeks: 104,
    maxWeeks: 156,
    laPauseSeconds: 180,
    laPauseNote:
      'For bedtime stalling or brief night call-outs, keep check-ins calm and predictable without opening negotiations.',
    focusSummary: 'Earned confidence through struggle, emotional agility, gratitude, and strong family rhythm.',
  },
];
