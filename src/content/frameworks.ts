import type { BookFramework, FrameworkGuide } from '../domain/types';

export const FRAMEWORK_LABELS: Record<BookFramework, string> = {
  hgp: 'Hunter, Gather, Parent',
  'le-cadre': 'Bringing Up Bébé',
  perry: 'Philippa Perry',
};

export const FRAMEWORK_GUIDES: Record<BookFramework, FrameworkGuide> = {
  hgp: {
    id: 'hgp',
    shortLabel: 'Hunter, Gather, Parent',
    bookTitle: 'Hunter, Gather, Parent',
    author: 'Michaeleen Doucleff',
    coreIdea:
      'Replace constant "child-centered" entertainment and praise with calm togetherness—bringing your baby into your real life.',
    pillars: [
      'Togetherness: include baby in ordinary chores and walks instead of performing for them.',
      'Minimal interference: let baby wrestle with small challenges without jumping in to rescue or over-praise.',
      'Calm co-regulation: lower your voice and slow your movements when distress rises.',
      'Alloparenting: lean on your partner and village without guilt.',
    ],
  },
  'le-cadre': {
    id: 'le-cadre',
    shortLabel: 'Bringing Up Bébé',
    bookTitle: 'Bringing Up Bébé',
    author: 'Pamela Druckerman',
    coreIdea:
      'Hold a calm, predictable frame (Le Cadre) around a few steady anchors—with warmth and freedom inside it.',
    pillars: [
      'La Pause: briefly pause and observe noisy sleep stirrings before rushing in.',
      'Predictable anchors: a gentle daily rhythm beats rigid clock-watching.',
      'Real-food exposure: offer varied family foods calmly and repeatedly without pressure.',
      'Calm boundaries: firm, un-angry limits help babies feel secure.',
    ],
  },
  perry: {
    id: 'perry',
    shortLabel: 'Philippa Perry',
    bookTitle: 'The Book You Wish Your Parents Had Read',
    author: 'Philippa Perry',
    coreIdea:
      'Your relationship isn’t built on perfection—it’s built on noticing your own feelings, treating behavior as communication, and repairing after rough moments.',
    pillars: [
      'Notice your triggers: crying often stirs up our own stress or childhood scripts.',
      'Behavior is communication: ask what baby is telling you before trying to stop the sound.',
      'Validate feelings while holding limits: their frustration and your boundary can coexist.',
      'Rupture & repair: reconnecting warmly after losing patience builds lasting trust.',
    ],
  },
};
