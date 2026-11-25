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
      'Hunter, Gather, Parent: Babies learn calm and belonging by observing your real life—no constant entertainment required.',
  },
  {
    id: 'perry-shoulder-check-0-6w',
    stages: ['0-6w', '6-12w', '3-6m'],
    framework: 'perry',
    title: 'Notice your own alarm bell',
    prompt:
      'The next time crying spikes your heart rate, silently name it: "My alarm is firing, and I am safe." Drop your shoulders before picking baby up.',
    whyItWorks:
      'Philippa Perry: Crying triggers our own nervous system. Calming your body first is how you co-regulate theirs.',
  },
  {
    id: 'cadre-observe-first-6-12w',
    stages: ['6-12w', '3-6m'],
    framework: 'le-cadre',
    title: 'Pause & observe before rescuing',
    prompt:
      'When baby fusses on a mat or stirs from a nap, wait 60 seconds with your hands relaxed. Watch what they are trying to figure out.',
    whyItWorks:
      'Bringing Up Bébé: La Pause gives your baby space to practice settling and builds your trust in their capability.',
  },
  {
    id: 'hgp-quiet-floor-3-6m',
    stages: ['3-6m', '6-9m'],
    framework: 'hgp',
    title: 'Minimal interference on the floor',
    prompt:
      'Put baby on a blanket with 1–2 simple household objects (a wooden spoon, a cloth). Step back and avoid narrating or clapping for 5 minutes.',
    whyItWorks:
      'Hunter, Gather, Parent: Stepping back protects deep focus and intrinsic motivation instead of training them to look for praise.',
  },
  {
    id: 'perry-behavior-comm-3-6m',
    stages: ['3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    title: 'Translate the fuss',
    prompt:
      'Pick one fussy moment today and ask "What is this communicating?" (tired, overstimulated, bored, hungry) before trying to stop the sound.',
    whyItWorks:
      'Philippa Perry: Treating behavior as communication replaces frustration with curiosity.',
  },
  {
    id: 'cadre-real-food-6-9m',
    stages: ['6-9m', '9-12m'],
    framework: 'le-cadre',
    title: 'One shared flavor, zero pressure',
    prompt:
      'Offer a baby-safe piece of whatever real food or vegetable you are eating today. Let them touch or taste it with zero coaxing or "one more bite."',
    whyItWorks:
      'Bringing Up Bébé: Repeated, calm exposure to varied real foods at the family table builds adventurous eaters without mealtime battles.',
  },
  {
    id: 'cadre-warm-boundary-9-12m',
    stages: ['9-12m'],
    framework: 'le-cadre',
    title: 'Hold a calm, one-sentence frame',
    prompt:
      'When baby reaches for something off-limits, say gently once: "I won’t let you pull that," and move them or the object—without lecturing or apologizing.',
    whyItWorks:
      'Le Cadre + Philippa Perry: Clear, un-angry boundaries make babies feel safe while validating their disappointment.',
  },
  {
    id: 'hgp-tiny-helper-9-12m',
    stages: ['9-12m'],
    framework: 'hgp',
    title: 'Invite tiny participation',
    prompt:
      'Let baby "help" with one real chore today—handing you a sock, wiping a spill with a cloth, or dropping laundry into a basket.',
    whyItWorks:
      'Hunter, Gather, Parent: Inviting toddlers-in-the-making into real work channels their autonomy into cooperation.',
  },
];
