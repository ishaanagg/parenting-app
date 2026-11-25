import type { WisdomCard } from '../domain/types';

export const WISDOM_CARDS: WisdomCard[] = [
  {
    id: 'w-lapause-0-12w',
    stages: ['0-6w', '6-12w'],
    framework: 'le-cadre',
    moments: ['3am', 'sleep'],
    title: 'Active sleep sounds like waking',
    insight:
      'Young babies grunt, squirm, and even let out brief cries between sleep cycles while still asleep. Rushing in immediately can accidentally wake them.',
    tryNow: 'Use the SOS La Pause timer for 60–120 seconds and just listen.',
  },
  {
    id: 'w-triggers-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    moments: ['3am', 'triggers', 'fussy'],
    title: 'Your baby isn’t giving you a hard time',
    insight:
      'When we’re exhausted at 3 AM, crying can feel personal. Babies aren’t manipulating us—they’re having a hard time and borrowing our nervous system.',
    tryNow: 'Exhale longer than you inhale (4s in, 6s out) before you speak or lift.',
  },
  {
    id: 'w-togetherness-0-6m',
    stages: ['0-6w', '6-12w', '3-6m'],
    framework: 'hgp',
    moments: ['fussy'],
    title: 'Change the scenery, not the toy',
    insight:
      'You don’t need to bounce, sing, and perform for hours. Stepping onto the porch, looking at leaves, or letting baby watch you cook often calms fussiness faster.',
    tryNow: 'Carry baby to a window or outside for 3 minutes of quiet observation.',
  },
  {
    id: 'w-rhythm-6-12w',
    stages: ['6-12w', '3-6m'],
    framework: 'le-cadre',
    moments: ['sleep', 'feeding'],
    title: 'Predictable rhythm over rigid schedules',
    insight:
      'Le Cadre isn’t a military timetable. It’s a gentle, repeatable sequence—wake, feed, calm togetherness, rest—so baby knows what comes next.',
    tryNow: 'Keep a simple 2-minute wind-down cue before naps (dim room, same phrase).',
  },
  {
    id: 'w-repair-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    moments: ['repair', 'triggers'],
    title: 'Rupture and repair beats perfection',
    insight:
      'Every parent loses patience or snaps sometimes. What shapes your child’s attachment isn’t perfection—it’s how you reconnect afterward.',
    tryNow: 'Say out loud: "I got overwhelmed earlier. You’re safe, and I’m here."',
  },
  {
    id: 'w-autonomy-3-9m',
    stages: ['3-6m', '6-9m', '9-12m'],
    framework: 'hgp',
    moments: ['fussy', 'sleep'],
    title: 'Let them wrestle with small frustrations',
    insight:
      'When baby grunts trying to reach a toy or roll over, jumping in too fast steals their discovery. Calm presence beats constant rescuing.',
    tryNow: 'Sit nearby silently for 30 seconds while they try before offering help.',
  },
  {
    id: 'w-food-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'le-cadre',
    moments: ['feeding'],
    title: 'You decide what; they decide how much',
    insight:
      'French parents expose babies to real vegetables and bitter flavors 8–10 times without pressure. Refusal today is just information, not failure.',
    tryNow: 'Put a tiny portion on their tray and eat yours calmly alongside them.',
  },
  {
    id: 'w-boundaries-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'perry',
    moments: ['fussy', 'triggers', 'repair'],
    title: 'Validate the feeling, hold the boundary',
    insight:
      'When they cry because you took away your glasses or phone, you don’t have to give in OR scold. Both the boundary and their frustration can coexist.',
    tryNow: 'Say: "You’re mad I took that away. It’s okay to be mad; I’m keeping it safe."',
  },
];
