import type { RepairScript, SosCryCue, SupportLine } from '../domain/types';

export const SAFE_SLEEP_REMINDER =
  'At your limit? Place baby on their back in a clear crib or bassinet (no loose blankets or pillows) and step away for 2 minutes to breathe. That is good parenting.';

export const SOS_PINNED_SUMMARY =
  'Safe crib pause anytime · 988 / 911 in crisis · Not medical advice';

export const NEVER_SHAKE =
  'Never shake a baby. If you feel you might lose control, put baby down safely on their back in the crib and walk away for a few minutes. Crying won’t hurt them; shaking can.';

export const PEDIATRICIAN_DISCLAIMER =
  'Anchor offers calm parenting support, not medical advice. For fever, breathing changes, poor feeding, or any medical concern, contact your pediatrician. If low mood, anxiety, or intrusive thoughts last more than two weeks—or feel scary at any point—talk to your doctor.';

export const LA_PAUSE_ESCALATION =
  'La Pause is a pause, not a rule. If the cry builds into real distress, go to your baby.';

export const LA_PAUSE_COMPLETE_GUIDE =
  'Pause complete. Listen for 10 seconds: settling on their own? Leave them be. Still crying or escalating? Go to your baby.';

export const CRY_ESCALATION =
  'Call your pediatrician if crying is high-pitched or inconsolable, or comes with fever, unusual sleepiness, breathing changes, or refusing feeds. Under 3 months, a temperature of 100.4°F (38°C) or higher needs a call right away.';

export const CRY_CUES: SosCryCue[] = [
  {
    id: 'sleep-transition',
    stages: ['0-6w', '6-12w', '3-6m'],
    label: 'Short grunts / fussing in sleep',
    meaning: 'Often a noisy sleep-cycle transition, not full waking.',
    nextStep: 'Wait out La Pause before picking up.',
  },
  {
    id: 'hungry',
    stages: ['0-6w', '6-12w', '3-6m'],
    label: 'Rhythmic cry + rooting / sucking hands',
    meaning: 'A common hunger cue.',
    nextStep: 'Offer a calm feed in dim light with minimal talking.',
  },
  {
    id: 'overstimulated',
    label: 'Turning away + arching + escalating cry',
    meaning: 'Often too much light, sound, or handling.',
    nextStep: 'Dim lights, hold steady against your chest, and lower your voice.',
  },
  {
    id: 'boundary-frustration',
    stages: ['6-9m', '9-12m'],
    label: 'Sudden protest when something is moved or stopped',
    meaning: 'Healthy frustration at a limit or interrupted exploration.',
    nextStep: 'Stay calm and name it: "You’re mad I took that. I’m keeping it safe."',
  },
  {
    id: 'separation-teething',
    stages: ['6-9m', '9-12m'],
    label: 'Clingy whining, ear-tugging, or night waking',
    meaning: 'Often separation awareness, teething discomfort, or overtiredness.',
    nextStep: 'Offer quiet, steady closeness—your calm voice is the anchor.',
  },
  {
    id: 'discomfort',
    label: 'Sudden sharp cry',
    meaning: 'Could be gas, a wet diaper, temperature, or a pinched toe/finger.',
    nextStep: 'Do a calm head-to-toe comfort check. If it doesn’t settle, see the note below.',
  },
];

export const TRIGGER_CHECK: string[] = [
  'What am I feeling in my body right now (tight jaw, heat, racing heart)?',
  'Is this about this moment—or exhaustion / an older feeling being stirred up?',
  'What is the smallest calm thing my baby needs in the next two minutes?',
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
  {
    id: 'failing',
    situation: 'I know what to do, yet I still lost my calm',
    innerReset: 'Knowing the theory doesn’t switch off a stressed nervous system. Repair is the skill.',
    outLoud: '"That was hard for both of us. I’m slowing down now. We’re okay."',
  },
];

export const SUPPORT_LINES: SupportLine[] = [
  {
    id: '988',
    label: '988 Suicide & Crisis Lifeline (US)',
    detail: 'Call or text 988 if you have thoughts of harming yourself or your baby.',
    href: 'tel:988',
  },
  {
    id: 'mmh',
    label: 'National Maternal Mental Health Hotline (US)',
    detail: 'Call or text 1-833-852-6262. Free, 24/7, for any parent feeling overwhelmed.',
    href: 'tel:18338526262',
  },
  {
    id: 'psi',
    label: 'Postpartum Support International',
    detail: 'Call or text 1-800-944-4773 for support and local resources.',
    href: 'tel:18009444773',
  },
];

export const SUPPORT_LINES_NOTE = 'Outside the US, call your local emergency number.';
