import type { CoupleCheckInPrompt, HouseRulePreset } from '../domain/types';

export const HOUSE_RULE_PRESETS: HouseRulePreset[] = [
  {
    id: 'rule-code-yellow',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    rule: '"Code Yellow" = instant 10-minute tap-out with zero sighing or critique.',
    why: 'Protects both of us before overwhelm turns into snapping.',
  },
  {
    id: 'rule-no-gatekeeping',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    rule: 'Zero partner gatekeeping: unless it’s safety, each parent’s soothing/play style stands.',
    why: 'Builds two confident anchors for our kid and prevents default-parent burnout.',
  },
  {
    id: 'rule-la-pause',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m'],
    framework: 'le-cadre',
    rule: 'Wait out La Pause on night stirrings before opening the nursery door.',
    why: 'Gives active-sleep noises room to resettle without waking a sleeping baby.',
  },
  {
    id: 'rule-8pm-adults',
    stages: ['3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'le-cadre',
    rule: 'After 8 PM bedtime + 15 mins cleanup, the evening belongs to our marriage and ourselves.',
    why: 'Bringing Up Bébé: rejects parental martyrdom and protects adult partnership.',
  },
  {
    id: 'rule-zero-meal-screens',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'grit',
    rule: 'Phones parked and zero screens at meals or restaurant waits.',
    why: 'The Anxious Generation: builds real conversation, patience, and boredom tolerance.',
  },
  {
    id: 'rule-family-food',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'le-cadre',
    rule: 'One shared family dinner—we decide what’s served; our kid decides how much.',
    why: 'Skips short-order "kid meals" and pressure while building palate curiosity.',
  },
  {
    id: 'rule-food-thrown-done',
    stages: ['9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'montessori-rie',
    rule: 'Food thrown twice = meal calmly ends with a neutral face (no lectures).',
    why: 'Clear, un-angry cause-and-effect extinguishes throwing fast.',
  },
  {
    id: 'rule-5sec-united-front',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'perry',
    rule: 'Validate in 5 seconds, hold the limit, and always back each other up in real time.',
    why: 'Good Inside + Gottman: prevents co-rumination and shows an un-wedgeable united front.',
  },
  {
    id: 'rule-no-gasp-tumble',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'grit',
    rule: 'Calm faces on minor scrapes—let them catch their breath and brush off.',
    why: 'The Blessings of a Skinned Knee: wires physical courage instead of fear.',
  },
];

export const COUPLE_CHECKIN_PROMPTS: CoupleCheckInPrompt[] = [
  {
    id: 'cc-headspace',
    framework: 'whole-self',
    connectionQuestion:
      'Baby talk off-limits for 5 minutes: what has been taking up the most headspace in YOUR own world or work this week?',
    ownershipCheck:
      'Mental load check: is one recurring household task feeling lopsided right now that one of us can own 100% end-to-end (noticing → planning → doing)?',
  },
  {
    id: 'cc-energized',
    framework: 'whole-self',
    connectionQuestion:
      'Outside of being a parent, what is one project, idea, or plan you feel genuinely excited about right now?',
    ownershipCheck:
      'Unicorn Space check: look at the week ahead—which day/hour is protected for each of us to step out completely guilt-free?',
  },
  {
    id: 'cc-appreciation',
    framework: 'whole-self',
    connectionQuestion:
      'What was one small moment this past week where you felt proud of how the two of us handled something as a team?',
    ownershipCheck:
      'Evening boundary check: did we actually get adult off-duty evenings together this week, or did chores/work creep past 8:30 PM?',
  },
  {
    id: 'cc-triggers',
    framework: 'perry',
    connectionQuestion:
      'Cycle-breaker check: did anything our child did this week stir up an old childhood reflex or wear your patience thin?',
    ownershipCheck:
      'United front check: is there one boundary we want to hold identically this week so neither of us has to play "bad cop"?',
  },
  {
    id: 'cc-us-dream',
    framework: 'whole-self',
    connectionQuestion:
      'What’s one small, low-effort date, walk, or meal just for the two of us we’d enjoy in the next two weeks?',
    ownershipCheck:
      'Village check: can we book a babysitter, grandparent, or swap block right now so that time actually happens?',
  },
];
