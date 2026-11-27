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
      'Young babies grunt, squirm, and even let out brief cries between sleep cycles while still asleep. Pausing briefly lets you observe before accidentally waking them.',
    tryNow:
      'For grunts and stirring (not full crying), use the La Pause timer and just listen. A hungry newborn should be fed.',
    action: 'la-pause',
  },
  {
    id: 'w-lapause-3m-3y',
    stages: ['3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'le-cadre',
    moments: ['3am', 'sleep'],
    title: 'Give sleep transitions a moment',
    insight:
      'Between sleep cycles, babies and toddlers often fuss or call out briefly while repositioning. Waiting 2–3 minutes lets you hear whether they are resettling on their own.',
    tryNow: 'Listen to the trajectory of the sound for 2 minutes before opening the door.',
    action: 'la-pause',
  },
  {
    id: 'w-possums-abort-0-12m',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'possums-data',
    moments: ['sleep', 'fussy'],
    title: 'Stop fighting low sleep pressure in the dark',
    insight:
      'Dr. Pamela Douglas (Possums) notes that if settling turns into a 20+ minute battle of arching or popping awake, sleep drive simply isn’t high enough yet.',
    tryNow:
      'Abort calmly: step out into dim ambient light for 15–20 minutes of quiet reset, then try a fresh 5-minute settle.',
  },
  {
    id: 'w-separation-night-6-18m',
    stages: ['6-9m', '9-12m', '12-18m'],
    framework: 'perry',
    moments: ['3am', 'sleep'],
    title: 'Standing in the crib is a check-in, not broken sleep',
    insight:
      'Around 7–15 months, separation awareness peaks alongside pulling to stand. Wrestling them flat 20 times accidentally turns bedtime into a motor game.',
    tryNow:
      'Sit quietly beside the crib, pat the mattress once ("Sleep time, I’m right here"), keep your voice boring, and guide down once drowsy.',
  },
  {
    id: 'w-toddler-proactive-checkin-18m-3y',
    stages: ['18-24m', '2-3y'],
    framework: 'perry',
    moments: ['sleep', 'boundaries'],
    title: 'Flip bedtime stalling with a proactive check-in',
    insight:
      'Toddlers stall ("One more water! Don’t leave!") when separation feels uncertain. Promising to return—and keeping your word—removes their need to chase you.',
    tryNow:
      'Say warmly: "Stay cozy under covers—I’m putting three dishes in the sink and checking back on you in 2 minutes."',
  },
  {
    id: 'w-day-night-0-12w',
    stages: ['0-6w', '6-12w'],
    framework: 'possums-data',
    moments: ['sleep', '3am'],
    title: 'Keep night boring, morning bright',
    insight:
      'Newborns build circadian rhythm from two signals: abundant morning daylight/activity and dim, quiet, zero-chatter night feeds.',
    tryNow: 'Skip bright lights and playful eye contact at 3 AM; get outside into natural light tomorrow morning.',
  },
  {
    id: 'w-cadre-frame-3m-3y',
    stages: ['3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'le-cadre',
    moments: ['sleep', 'feeding'],
    title: 'Steady anchors protect your adult evening',
    insight:
      'Once past the newborn stage, predictable meal and bedtime anchors (Le Cadre) help your child rest deeply and return 8 PM onward to your marriage and yourself.',
    tryNow: 'Run the exact same short 3-step bedtime wind-down tonight, then clock off-duty together.',
  },

  // ── Triggers & 3 AM ───────────────────────────────────────────────────────
  {
    id: 'w-triggers-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'perry',
    moments: ['3am', 'triggers', 'fussy'],
    title: 'A good kid having a hard time—not giving you one',
    insight:
      'Dr. Becky Kennedy & Philippa Perry remind us: when we’re depleted, crying or defiance feels personal, yet their downstairs survival brain simply needs a sturdy pilot.',
    tryNow: 'Take two quick nasal inhales + one long slow mouth exhale (physiological sigh) before you speak.',
  },
  {
    id: 'w-ghosts-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'perry',
    moments: ['triggers', 'repair'],
    title: 'Notice when an old childhood script fires',
    insight:
      'Siegel & Perry show that outsized anger at a child’s whining or mess often echoes what we weren’t allowed to feel safely growing up. Spotting the echo breaks the cycle.',
    tryNow: 'Ask silently: "Is this heat proportional to right now, or am I depleted / triggered?"',
  },

  // ── Fussy, Tantrums & Togetherness ────────────────────────────────────────
  {
    id: 'w-togetherness-0-12m',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'hgp',
    moments: ['fussy'],
    title: 'Change the sensory world, not the toy',
    insight:
      'You don’t need to bounce and sing for hours. Stepping outside into fresh air or warm sink/bath water interrupts crying loops faster than extra stimulation.',
    tryNow: 'Step onto the porch, balcony, or an open window together for 90 seconds of quiet air.',
  },
  {
    id: 'w-water-air-toddler-12m-3y',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'hgp',
    moments: ['fussy', 'triggers'],
    title: 'Add water or step outside—skip the lecture',
    insight:
      'When a toddler’s downstairs brain floods at 5 PM, reasoning adds fuel. Sensory shifts reset their nervous system immediately.',
    tryNow: 'Offer cold water through a straw, let them wash vegetables at the sink, or step outside barefoot.',
  },
  {
    id: 'w-autonomy-3m-3y',
    stages: ['3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'grit',
    moments: ['fussy', 'boundaries'],
    title: 'Frustration is the gym where grit grows',
    insight:
      'Wendy Mogel & Jessica Lahey point out that rescuing children from every stuck block, zipper, or minor scrape steals earned confidence.',
    tryNow: 'Stay nearby with a calm face for 30 seconds while they wrestle with it before scaffolding.',
  },
  {
    id: 'w-calm-contagious-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'hgp',
    moments: ['fussy', 'triggers'],
    title: 'Drop your volume to lower theirs',
    insight:
      'In Hunt, Gather, Parent, Inuit parents never match a child’s volume—lowering your voice and slowing your body signals safety faster than stern lectures.',
    tryNow: 'Unclench your jaw, crouch below eye level, and speak one notch quieter.',
  },

  // ── Feeding ───────────────────────────────────────────────────────────────
  {
    id: 'w-feeding-feelings-0-12w',
    stages: ['0-6w', '6-12w'],
    framework: 'possums-data',
    moments: ['feeding', 'triggers', '3am'],
    title: 'Fed + calm parents beats feeding dogma',
    insight:
      'Emily Oster’s data review is clear: whether breast, formula, or combo-feeding, a fed baby and rested, sane parents are what drive thriving outcomes.',
    tryNow:
      'Drop your shoulders before the next feed. For latch or reflux pain, lean on your pediatrician or lactation pro.',
  },
  {
    id: 'w-feeding-presence-3-6m',
    stages: ['3-6m'],
    framework: 'hgp',
    moments: ['feeding'],
    title: 'Quiet corner for distracted 4-month feeds',
    insight:
      'At 3–6 months babies suddenly wake up to every sound and movement in the room, pulling off repeatedly mid-feed.',
    tryNow: 'Step into a calm, low-distraction spot for daytime feeds rather than pressuring them to finish.',
  },
  {
    id: 'w-food-6m-3y',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'le-cadre',
    moments: ['feeding', 'boundaries'],
    title: 'You decide what’s served; they decide how much',
    insight:
      'French food culture avoids short-order "kid meals" and pressure. Serving varied family food alongside one familiar staple builds lifelong palate curiosity.',
    tryNow:
      'Put a tiny, no-pressure taste of the family meal on their plate and enjoy your own dinner with your spouse.',
  },

  // ── Repair & Boundaries ───────────────────────────────────────────────────
  {
    id: 'w-repair-all',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'perry',
    moments: ['repair', 'triggers'],
    title: 'Clean repair models real accountability',
    insight:
      'Every parent snaps sometimes. Owning your part cleanly—without blaming your child for making you yell—teaches humility and emotional safety.',
    tryNow: 'Say simply: "I raised my voice earlier because I was overwhelmed. That wasn’t fair to you, and I’m sorry."',
  },
  {
    id: 'w-5sec-boundaries-6m-3y',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'perry',
    moments: ['fussy', 'boundaries', 'triggers', 'repair'],
    title: 'The 5-Second Validation Rule',
    insight:
      'Validating feelings doesn’t mean holding a 15-minute debate. Name the emotion in under 8 words, hold the boundary like a sturdy pilot, and move forward.',
    tryNow: 'Say once: "You’re mad park time is over, AND it’s time to go"—then carry or walk calmly to the car.',
  },
  {
    id: 'w-throwing-hitting-6m-3y',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'montessori-rie',
    moments: ['boundaries', 'feeding'],
    title: 'Calm physical limits beat loud warnings',
    insight:
      'Janet Lansbury notes that big gasps or angry countdowns feel like drama to a toddler. Quietly blocking a hit or ending a food-throwing meal works fastest.',
    tryNow:
      'Keep your face neutral, block the hand or remove the plate once: "I won’t let you throw that."',
  },
];
