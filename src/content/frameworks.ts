import type { BookFramework, FrameworkGuide } from '../domain/types';

export const FRAMEWORK_LABELS: Record<BookFramework, string> = {
  hgp: 'Everyday Teamwork',
  'le-cadre': 'Calm Structure',
  'montessori-rie': 'Capable Independence',
  perry: 'Sturdy Boundaries',
  grit: 'Grit & Grounding',
  'whole-self': 'Marriage & Self',
  'possums-data': 'Calm Baby Biology',
};

export const FRAMEWORK_GUIDES: Record<BookFramework, FrameworkGuide> = {
  hgp: {
    id: 'hgp',
    shortLabel: 'Everyday Teamwork',
    themeTitle: 'Everyday Teamwork & Real Life',
    sourceBooks: [{ title: 'Hunt, Gather, Parent', author: 'Michaeleen Doucleff' }],
    coreIdea:
      'Skip exhausting "child-centered" entertainment and constant praise—fold your child into real adult chores, errands, and calm family life.',
    pillars: [
      'Togetherness: include kids in cooking, laundry, and walks instead of performing for them.',
      'Encouragement over praise: let real contribution build pride instead of constant "Good job!" or bribes.',
      'Minimal interference: step back so focus and frustration tolerance can grow.',
      'Never match anger with anger: drop your voice and slow your movements when distress rises.',
    ],
  },
  'le-cadre': {
    id: 'le-cadre',
    shortLabel: 'Calm Structure',
    themeTitle: 'Calm Structure & Adult Evenings',
    sourceBooks: [{ title: 'Bringing Up Bébé', author: 'Pamela Druckerman' }],
    coreIdea:
      'Hold a firm, predictable outer frame (Le Cadre) around sleep, meals, and courtesy—with wide freedom inside it and evenings protected for adults.',
    pillars: [
      'La Pause: briefly observe noisy sleep-cycle stirrings before rushing in.',
      'Predictable anchors: steady meal and bedtime rhythms beat rigid clock-watching.',
      'The art of waiting: small everyday waits teach patience and self-control.',
      'Evenings belong to adults: your child is deeply loved, not the household dictator.',
    ],
  },
  'montessori-rie': {
    id: 'montessori-rie',
    shortLabel: 'Capable Independence',
    themeTitle: 'Capable Independence & Respect',
    sourceBooks: [
      { title: 'The Montessori Baby & The Montessori Toddler', author: 'Simone Davies & Junnifa Uzodike' },
      { title: 'Elevating Child Care (RIE)', author: 'Janet Lansbury & Magda Gerber' },
    ],
    coreIdea:
      'Be a gardener preparing a safe "yes" environment rather than a carpenter micromanaging every move—treating babies and toddlers as capable people from day one.',
    pillars: [
      'Prepared "Yes" space: low hooks, accessible cups, and safe floor play cut out 80% of daily "No!" battles.',
      'Respectful caregiving: narrate briefly before lifting, wiping, or dressing.',
      'Protect concentration: never interrupt a focused baby or toddler—even to praise them.',
      'Scaffold the last step: help just enough that they finish the zipper or spill-wipe themselves.',
    ],
  },
  perry: {
    id: 'perry',
    shortLabel: 'Sturdy Boundaries',
    themeTitle: 'Sturdy Boundaries, Cycle-Breaking & Repair',
    sourceBooks: [
      { title: 'Good Inside', author: 'Dr. Becky Kennedy' },
      { title: 'The Book You Wish Your Parents Had Read', author: 'Philippa Perry' },
      { title: 'The Whole-Brain Child & Parenting from the Inside Out', author: 'Dr. Dan Siegel, Dr. Tina Bryson & Mary Hartzell' },
      { title: 'How to Talk So Little Kids Will Listen', author: 'Joanna Faber & Julie King' },
    ],
    coreIdea:
      'Break generational cycles without sliding into permissiveness: separate your child’s good identity from rough behavior, validate briefly, hold the limit like a sturdy pilot, and repair when you snap.',
    pillars: [
      'The 5-Second Validation Rule: name the feeling in one short sentence, hold the boundary, and move on—no 15-minute co-rumination.',
      'Sturdy pilot: block hitting or throwing calmly ("You’re mad, and I won’t let you hit") without anger or lectures.',
      'Two real choices: defuse power struggles by offering small agency inside a firm limit.',
      'Rupture & repair: owning your own temper cleanly models true adult accountability.',
    ],
  },
  grit: {
    id: 'grit',
    shortLabel: 'Grit & Grounding',
    themeTitle: 'Antifragility, Emotional Agility & Character',
    sourceBooks: [
      { title: 'The Blessings of a Skinned Knee', author: 'Wendy Mogel' },
      { title: 'The Gift of Failure', author: 'Jessica Lahey' },
      { title: 'Emotional Agility & Chatter', author: 'Dr. Susan David & Ethan Kross' },
      { title: 'Raising a Secure Child (Circle of Security)', author: 'Kent Hoffman, Glen Cooper & Bert Powell' },
      { title: 'The Anxious Generation', author: 'Jonathan Haidt' },
    ],
    coreIdea:
      'True confidence is earned by surviving small struggles. Pair a warm Safe Haven with a fearless Launchpad, real outdoor play, and outward gratitude.',
    pillars: [
      'Don’t steal the struggle: check your face on minor scrapes (no gasping) and let small natural consequences land early.',
      'Feelings are data, not directives: kids can feel nervous or frustrated AND still act kindly and finish hard things.',
      'Safe Haven + Launchpad: welcome them warmly when hurt, and delight in stepping back when they venture out.',
      'Outward character & real-world play: manners, gratitude, eye contact, outdoor adventure, and firm screen boundaries.',
    ],
  },
  'whole-self': {
    id: 'whole-self',
    shortLabel: 'Marriage & Self',
    themeTitle: 'Strong Marriage, Career & Personal Identity',
    sourceBooks: [
      { title: 'And Baby Makes Three', author: 'Dr. John Gottman & Dr. Julie Schwartz Gottman' },
      { title: 'Fair Play & Find Your Unicorn Space', author: 'Eve Rodsky' },
      { title: 'Work, Parent, Thrive', author: 'Dr. Yael Schonbrun' },
      { title: 'Real Self-Care', author: 'Dr. Pooja Lakshmin' },
    ],
    coreIdea:
      'A loving, united marriage and two fulfilled, curious adults are the strongest grounding force your child will ever have.',
    pillars: [
      'United adult front: prioritize your bond, turn toward small bids, keep a daily 6-second kiss, and drop partner gatekeeping.',
      'End-to-end ownership (CPE): own tasks from noticing to planning to doing so the off-duty parent truly rests.',
      'Unicorn Space & career synergy: meaningful work and personal passions enrich your parenting rather than stealing from it.',
      'Good-enough & guilt-tolerant: small everyday waits build your child’s resilience, and temporary guilt when setting boundaries is normal.',
    ],
  },
  'possums-data': {
    id: 'possums-data',
    shortLabel: 'Calm Baby Biology',
    themeTitle: 'Calm Infant Biology & Data Over Dogma',
    sourceBooks: [
      { title: 'The Discontented Little Baby Book (Possums)', author: 'Dr. Pamela Douglas' },
      { title: 'Cribsheet', author: 'Emily Oster' },
    ],
    coreIdea:
      'Ditch fear-driven wake-window obsession and panic headlines: work with infant sleep biology in months 0–4, pivot to steady anchors after 4 months, and weigh family sanity as real data.',
    pillars: [
      'Months 0–4 (Possums): anchor morning wake time + daylight, bring baby into your outdoor adult day, and let naps happen on the go.',
      '15-minute bedtime abort: if sleep isn’t happening after 15–20 minutes, sleep pressure is too low—reset calmly instead of battling in the dark.',
      'Months 4+ handoff: transition smoothly into predictable nap and 8 PM bedtime anchors.',
      'Data over dogma: evaluate real risk sizes and count parent sleep, mental health, and marriage wellbeing.',
    ],
  },
};
