import type { WisdomCard } from '../domain/types';

export const WISDOM_CARDS: WisdomCard[] = [
  // ── 3 AM & Sleep ──────────────────────────────────────────────────────────
  {
    id: 'w-lapause-0-12w',
    stages: ['0-6w', '6-12w'],
    framework: 'le-cadre',
    moments: ['3am', 'sleep'],
    title: 'Active sleep sounds like waking',
    insight:
      'Young babies grunt, squirm, and even let out brief cries between sleep cycles while still asleep. Druckerman describes French parents pausing to observe rather than rushing in.',
    tryNow:
      'For grunts and stirring (not full crying), use the SOS La Pause timer and just listen. A hungry newborn should be fed.',
    action: 'la-pause',
  },
  {
    id: 'w-lapause-3-12m',
    stages: ['3-6m', '6-9m', '9-12m'],
    framework: 'le-cadre',
    moments: ['3am', 'sleep'],
    title: 'Give sleep transitions a moment',
    insight:
      'Between sleep cycles, older babies often fuss briefly while rolling or repositioning. Waiting a couple of minutes lets you hear whether they are resettling or truly calling for you.',
    tryNow: 'Listen to the pitch of the sound for 2 minutes before opening the door.',
    action: 'la-pause',
  },
  {
    id: 'w-separation-night-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'perry',
    moments: ['3am', 'sleep'],
    title: 'Standing in the crib is a check-in, not a setback',
    insight:
      'Around 7–10 months, separation awareness peaks alongside new motor skills. Waking and calling out often just means "Are you still there?"—not that sleep is broken.',
    tryNow:
      'Offer a calm, quiet voice and a steady hand on their back for a moment before deciding whether to lift.',
  },
  {
    id: 'w-day-night-0-12w',
    stages: ['0-6w', '6-12w'],
    framework: 'le-cadre',
    moments: ['sleep', '3am'],
    title: 'Keep night boring, day bright',
    insight:
      'Newborns don’t yet have a mature day–night clock. Calm, dim, quiet night feeds and natural daylight during the day gently orient their rhythm over time.',
    tryNow: 'Skip bright lights and playful chatter at 3 AM; save eye-contact games for morning.',
  },
  {
    id: 'w-cadre-frame-6w-12m',
    stages: ['6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'le-cadre',
    moments: ['sleep', 'feeding'],
    title: 'A calm frame, not a rigid schedule',
    insight:
      'Le Cadre isn’t a military timetable. Druckerman describes a firm, calm frame—a few consistent anchors like meals, a wind-down, and bedtime—with lots of freedom inside it.',
    tryNow: 'Pick one anchor to keep consistent today, like the same 2-minute wind-down before naps.',
  },

  // ── Triggers & 3 AM ───────────────────────────────────────────────────────
  {
    id: 'w-triggers-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    moments: ['3am', 'triggers', 'fussy'],
    title: 'Your baby isn’t giving you a hard time',
    insight:
      'When we’re exhausted at 3 AM, crying can feel personal. Babies aren’t manipulating us—they’re having a hard time and need to borrow our calm.',
    tryNow: 'Exhale longer than you inhale (4s in, 6s out) before you speak or lift.',
  },
  {
    id: 'w-ghosts-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    moments: ['triggers', 'repair'],
    title: 'Notice when an old script fires',
    insight:
      'Philippa Perry notes that when a baby’s cry triggers sudden anger or panic, it often echoes how our own distress was handled when we were small.',
    tryNow: 'Ask silently: "Is this intensity about right now, or am I running on empty?"',
  },

  // ── Fussy & Togetherness ──────────────────────────────────────────────────
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
    id: 'w-autonomy-3-12m',
    stages: ['3-6m', '6-9m', '9-12m'],
    framework: 'hgp',
    moments: ['fussy', 'boundaries'],
    title: 'Let them wrestle with small frustrations',
    insight:
      'When baby grunts trying to reach a toy or roll over, jumping in too fast takes away their discovery. Calm presence beats constant rescuing.',
    tryNow: 'Sit nearby quietly for 30 seconds while they try before offering help.',
  },
  {
    id: 'w-calm-contagious-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'hgp',
    moments: ['fussy', 'triggers'],
    title: 'Drop your volume to lower theirs',
    insight:
      'In Hunter, Gather, Parent, Michaeleen Doucleff highlights how staying quiet and unhurried during distress helps children settle far faster than frantic soothing.',
    tryNow: 'Unclench your jaw, slow your steps, and speak one notch quieter.',
  },

  // ── Feeding ───────────────────────────────────────────────────────────────
  {
    id: 'w-feeding-feelings-0-12w',
    stages: ['0-6w', '6-12w'],
    framework: 'perry',
    moments: ['feeding', 'triggers', '3am'],
    title: 'Feeding stirs up big feelings—notice yours',
    insight:
      'Breast, bottle, or both, feeds can bring up pressure about doing it “right.” Perry’s idea applies: notice your own feelings so they don’t spill into the moment. A fed, held baby is the goal.',
    tryNow:
      'Before the next feed, drop your shoulders and take one slow exhale. For feeding worries, talk to your pediatrician or a lactation consultant.',
  },
  {
    id: 'w-feeding-presence-3-6m',
    stages: ['3-6m'],
    framework: 'hgp',
    moments: ['feeding'],
    title: 'Treat feeds as quiet togetherness',
    insight:
      'At 3–6 months babies get easily distracted by lights and movement. A calm, low-stimulation spot turns feeding back into simple connection.',
    tryNow: 'Silence notifications or step into a quieter corner for one feed today.',
  },
  {
    id: 'w-food-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'le-cadre',
    moments: ['feeding'],
    title: 'Taste is learned through calm repetition',
    insight:
      'Druckerman describes French parents offering vegetables again and again, calmly and without pressure. A refusal today is just information, not failure.',
    tryNow:
      'Put a tiny, soft, finger-sized portion on their tray and eat yours calmly alongside them.',
  },
  {
    id: 'w-family-table-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'hgp',
    moments: ['feeding', 'fussy'],
    title: 'Eat together rather than performing',
    insight:
      'Babies learn how meals work by watching you eat real food—not by watching an airplane-spoon show. Shared meals build calm participation.',
    tryNow: 'Pull the highchair right up to the table and eat your own plate while they explore theirs.',
  },

  // ── Repair & Boundaries ───────────────────────────────────────────────────
  {
    id: 'w-repair-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'perry',
    moments: ['repair', 'triggers'],
    title: 'Rupture and repair beats perfection',
    insight:
      'Every parent loses patience sometimes. Perry’s point: what matters most isn’t never getting it wrong—it’s noticing and reconnecting afterward.',
    tryNow: 'Say out loud: "I got overwhelmed earlier. You’re safe, and I’m here."',
  },
  {
    id: 'w-boundaries-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'perry',
    moments: ['fussy', 'boundaries', 'triggers', 'repair'],
    title: 'Validate the feeling, hold the boundary',
    insight:
      'When they cry because you took away your glasses or phone, you don’t have to give in or scold. The boundary and their frustration can both exist.',
    tryNow: 'Say: "You’re mad I took that away. It’s okay to be mad; I’m keeping it safe."',
  },
  {
    id: 'w-throwing-food-6-12m',
    stages: ['6-9m', '9-12m'],
    framework: 'le-cadre',
    moments: ['boundaries', 'feeding'],
    title: 'Food on the floor means the meal is pausing',
    insight:
      'Dropping food is part gravity experiment, part "I’m done." Big reactions ("No! Don’t throw!") accidentally turn it into a thrilling game.',
    tryNow:
      'Keep your face neutral, say once "Food stays on the tray," and if it repeats, calmly end the meal without a lecture.',
  },
];
