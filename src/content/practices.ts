import type { PracticeRep } from '../domain/types';

export const PRACTICES: PracticeRep[] = [
  {
    id: 'hgp-bring-along-0-6w',
    stages: ['0-6w', '6-12w'],
    framework: 'hgp',
    title: 'Live your day, bring baby along',
    prompt:
      'During one ordinary task today (making coffee, folding laundry, a short walk), wear or place baby nearby instead of setting up a "baby activity."',
    whyItWorks:
      'Hunter, Gather, Parent: babies learn calm and belonging by being included in your real life—no constant entertainment required.',
  },
  {
    id: 'perry-shoulder-check-0-6w',
    stages: ['0-6w', '6-12w', '3-6m'],
    framework: 'perry',
    title: 'Notice your own alarm bell',
    prompt:
      'The next time crying spikes your heart rate, silently name it: "My alarm is firing, and I am safe." Drop your shoulders before picking baby up.',
    whyItWorks:
      'Philippa Perry: our children’s distress can stir up our own old feelings. Noticing yours first helps you respond to your baby instead of reacting.',
  },
  {
    id: 'hgp-calm-voice-0-6w',
    stages: ['0-6w', '6-12w'],
    framework: 'hgp',
    title: 'Lower your volume, slow your pace',
    prompt:
      'During one fussy moment today, deliberately speak more quietly and move more slowly than feels natural—for a full minute.',
    whyItWorks:
      'Hunter, Gather, Parent: calm adults are contagious. Babies borrow our slower rhythm to settle their own.',
  },
  {
    id: 'cadre-observe-first-6-12w',
    stages: ['6-12w', '3-6m'],
    framework: 'le-cadre',
    title: 'Pause & observe before rescuing',
    prompt:
      'When baby fusses on a mat or stirs from a nap, wait a moment with your hands relaxed. Watch what they are trying to figure out before stepping in.',
    whyItWorks:
      'Bringing Up Bébé: La Pause gives your baby space to practice settling and builds your trust in their capability.',
  },
  {
    id: 'hgp-quiet-floor-3-6m',
    stages: ['3-6m', '6-9m'],
    framework: 'hgp',
    title: 'Minimal interference on the floor',
    prompt:
      'Put baby on a blanket with 1–2 simple, safe household objects (a wooden spoon, a cloth). Step back and avoid narrating or clapping for 5 minutes.',
    whyItWorks:
      'Hunter, Gather, Parent: stepping back protects focus and intrinsic motivation instead of training them to look for praise.',
  },
  {
    id: 'perry-behavior-comm-3-6m',
    stages: ['3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    title: 'Translate the fuss',
    prompt:
      'Pick one fussy moment today and ask "What is this communicating?" (tired, overstimulated, bored, hungry) before trying to stop the sound.',
    whyItWorks:
      'Philippa Perry: treating behavior as communication replaces frustration with curiosity.',
  },
  {
    id: 'cadre-real-food-6-9m',
    stages: ['6-9m', '9-12m'],
    framework: 'le-cadre',
    title: 'One shared flavor, zero pressure',
    prompt:
      'Offer a baby-safe piece of a vegetable or food you are eating today. Let them touch or taste it with zero coaxing or "one more bite."',
    whyItWorks:
      'Inspired by Bringing Up Bébé: Druckerman describes French families offering a wide variety of real food, calmly and repeatedly, at the family table.',
    safetyNote:
      'Soft, squishable, finger-sized pieces only; no whole grapes, nuts, or honey before 12 months. Start solids when your pediatrician says baby is ready.',
  },
  {
    id: 'cadre-warm-boundary-9-12m',
    stages: ['9-12m'],
    framework: 'le-cadre',
    title: 'Hold a calm, one-sentence frame',
    prompt:
      'When baby reaches for something off-limits, say gently once: "I won’t let you pull that," and move them or the object—without lecturing or apologizing.',
    whyItWorks:
      'Inspired by Le Cadre (a firm frame with freedom inside it) and Perry’s warm boundaries; the phrasing echoes respectful-caregiving (RIE) language.',
  },
  {
    id: 'hgp-tiny-helper-9-12m',
    stages: ['9-12m'],
    framework: 'hgp',
    title: 'Invite tiny participation',
    prompt:
      'Let baby "help" with one real chore today—handing you a sock, wiping a spill with a cloth, or dropping laundry into a basket.',
    whyItWorks:
      'Hunter, Gather, Parent: inviting little ones into real work channels their drive for autonomy into cooperation.',
  },
];
