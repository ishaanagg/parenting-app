import type { RepairScript, SosCryCue } from '../domain/types';

export const SAFE_SLEEP_REMINDER =
  'If you feel at your limit, it is always okay—and good parenting—to place your baby on their back in a clear crib (no loose blankets or pillows) and step away for 2 minutes to breathe.';

export const PEDIATRICIAN_DISCLAIMER =
  'Anchor offers calm parenting support, not medical advice. For fever, breathing changes, poor feeding, or any medical concern, always contact your pediatrician.';

export const CRY_CUES: SosCryCue[] = [
  {
    id: 'sleep-transition',
    label: 'Short grunts / fussing in sleep',
    meaning: 'Often a sleep-cycle transition, not full waking.',
    nextStep: 'Wait out La Pause before picking up.',
  },
  {
    id: 'hungry',
    label: 'Rhythmic cry + rooting / sucking hands',
    meaning: 'Early or active hunger cue.',
    nextStep: 'Offer a calm feed in dim light, minimal talking.',
  },
  {
    id: 'overstimulated',
    label: 'Turning away + arching + escalating cry',
    meaning: 'Nervous system overload—too much light, sound, or handling.',
    nextStep: 'Dim lights, hold steady against your chest, and lower your voice.',
  },
  {
    id: 'discomfort',
    label: 'Sudden sharp cry',
    meaning: 'Gas bubble, wet diaper, hair tourniquet, or temperature.',
    nextStep: 'Do a quick head-to-toe comfort check.',
  },
];

export const REPAIR_SCRIPTS: RepairScript[] = [
  {
    id: 'snapped',
    situation: 'I raised my voice or handled baby tensely',
    innerReset: 'I am human and exhausted. Guilt doesn’t help my baby—my calm presence now does.',
    outLoud: '"I got really overwhelmed just now. That wasn’t about you. You are safe, and I’m right here."',
  },
  {
    id: 'resentful',
    situation: 'I feel trapped, touched-out, or resentful',
    innerReset: 'Having limits doesn’t make me a bad parent; it means I need a 2-minute reset.',
    outLoud: '"I’m going to put you somewhere safe for two minutes so I can take a breath and come back steady."',
  },
];
