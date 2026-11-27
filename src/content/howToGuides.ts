import type { HowToCategoryId, HowToGuide } from '../domain/types';

export const HOW_TO_CATEGORY_LABELS: Record<HowToCategoryId, string> = {
  'crying-gas': 'Crying & Gas',
  sleep: 'Bedtime & Sleep',
  tantrums: 'Tantrums & "No!"',
  'hitting-throwing': 'Hitting & Throwing',
  food: 'Food & Solids',
  'scrapes-fear': 'Scrapes & Fear',
  repair: 'I Lost My Cool',
};

export const HOW_TO_GUIDES: HowToGuide[] = [
  // ── 1. Crying & Gas (0–12m+) ──────────────────────────────────────────────
  {
    id: 'ht-safety-scan',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['crying-gas'],
    framework: 'possums-data',
    badge: 'Check First',
    title: '15-Second Medical & Comfort Scan',
    whenToUse: 'Inconsolable or sudden sharp crying before assuming colic or protest.',
    quickSteps: [
      'Check temperature: under 3 months, a rectal temp ≥ 100.4°F (38.0°C) means call your pediatrician right away.',
      'Scan toes, fingers, and diaper area for a tight wrapped hair ("hair tourniquet"), pinched zipper, or scratchy tag.',
      'Rule out red flags: labored breathing, unusual lethargy, green/projectile vomit, or refusing multiple feeds.',
    ],
    whyItWorks:
      'Ruling out hidden physical pain in 15 seconds lets both parents relax into calm soothing with confidence.',
    safetyNote:
      'Trust your gut—always call your pediatrician if a cry sounds abnormally high-pitched, weak, or "not like your child."',
  },
  {
    id: 'ht-tiger-in-tree',
    stages: ['0-6w', '6-12w', '3-6m'],
    categories: ['crying-gas'],
    framework: 'possums-data',
    title: '"Tiger in the Tree" Forearm Hold',
    whenToUse: 'Evening colic, arched back, trapped gas, or babies fighting cradle holds.',
    quickSteps: [
      'Drape baby tummy-down lengthwise along your inner forearm, supporting their jaw/head near your elbow or palm.',
      'Let arms and legs dangle relaxed over either side of your arm like a tiger lounging on a branch.',
      'Walk slowly or sway gently while rubbing their back with your free hand.',
    ],
    whyItWorks:
      'Gentle, steady warmth and pressure along the abdomen relieves trapped gas while vestibular swaying calms the vagus nerve.',
    safetyNote:
      'For awake, in-arms soothing only (keep nose and mouth clear). Always place baby flat on their back in a bare crib to sleep.',
  },
  {
    id: 'ht-hamilton-hold',
    stages: ['0-6w', '6-12w'],
    categories: ['crying-gas'],
    framework: 'possums-data',
    title: 'Dr. Hamilton’s 45° Calming Hold',
    whenToUse: 'Rapidly interrupting escalating newborn crying (0–12 weeks).',
    quickSteps: [
      'Gently fold both of baby’s arms across their chest and secure them + baby’s chin shelf with one broad palm (never hold the neck).',
      'Cup baby’s diaper area firmly with your other hand and tilt them forward at a 45° angle.',
      'Gently rock their bottom up-and-down or in slow figure-eights until their body softens.',
    ],
    whyItWorks:
      'Developed by pediatrician Dr. Robert Hamilton, the tucked arms + 45° forward tilt shuts off the Moro startle reflex within seconds.',
    safetyNote: 'Best for 0–12 weeks before babies grow too heavy or wriggly for a one-palm chest shelf.',
  },
  {
    id: 'ht-five-ss',
    stages: ['0-6w', '6-12w'],
    categories: ['crying-gas', 'sleep'],
    framework: 'possums-data',
    title: 'The 5 S’s Calming Reflex',
    whenToUse: 'Overstimulated fourth-trimester crying when a newborn can’t wind down.',
    quickSteps: [
      'Swaddle snugly with arms down (if not yet showing rolling signs) and hold on their Side or Stomach in your arms.',
      'Shush steadily near their ear (or run rumbly white noise matching cry volume, softening as they settle).',
      'Add tiny, head-supported rhythmic swaying + Sucking (pacifier, clean finger pad-up, or feed).',
    ],
    whyItWorks:
      'Dr. Harvey Karp’s 5 S’s recreate the snug, loud, rhythmic sensory world of the womb to flip on an infant’s innate calming reflex.',
    safetyNote:
      'Stop swaddling at the very first sign of rolling (~8–12w). Side/stomach is for in-arms holding only—always sleep flat on back.',
  },
  {
    id: 'ht-ilu-massage',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m'],
    categories: ['crying-gas'],
    framework: 'possums-data',
    title: '"I Love You" (ILU) Belly Massage + Bicycles',
    whenToUse: 'Grunting, tight gassy belly, or straining to pass gas/stool (wait 20–30m after feeds).',
    quickSteps: [
      'Lay baby on a warm surface and gently bicycle knees to chest 5 times, holding gently for 3 seconds at the top.',
      'With warm fingers, stroke "I" straight down baby’s LEFT side, then "L" across upper belly right-to-left and down baby’s left.',
      'Trace an upside-down "U" up baby’s right hip, across the ribs, and down baby’s left side to guide gas out.',
    ],
    whyItWorks:
      'The large intestine exits down the baby’s left side—tracing I-L-U in anatomical order moves trapped bubbles toward the exit.',
  },
  {
    id: 'ht-outdoor-water-interrupt',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    categories: ['crying-gas'],
    framework: 'hgp',
    title: '90-Second Outdoor Air or Warm Water Reset',
    whenToUse: '5–9 PM witching hour when indoor bouncing and shushing stop working.',
    quickSteps: [
      'Stop bouncing harder—carry baby out onto the porch, balcony, or beside an open window for 90 seconds.',
      'Let cool air, sky/trees, and open acoustics interrupt the sensory loop without talking or jiggling.',
      'Still tense? Step into a warm skin-to-skin bath together with a warm wet washcloth over baby’s back.',
    ],
    whyItWorks:
      'Hunt, Gather, Parent & Possums: changing temperature and sensory scenery resets an overloaded infant brain faster than extra stimulation.',
  },

  // ── 2. Bedtime & Sleep (0m–3y) ────────────────────────────────────────────
  {
    id: 'ht-la-pause',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['sleep'],
    framework: 'le-cadre',
    title: 'La Pause (Active-Sleep Observation)',
    whenToUse: 'Grunts, brief cries, or tossing on the monitor at 3 AM before you stand up.',
    quickSteps: [
      'Stay in bed and start the La Pause timer (1 min for newborns, 2–3 mins for older babies/toddlers).',
      'Listen to the direction of the sound: rising-and-falling intermittent fuss = linking sleep cycles while asleep.',
      'If the cry builds into steady, true distress—or a young baby is due for a feed—go in calmly.',
    ],
    whyItWorks:
      'Bringing Up Bébé: rushing in on between-cycle sleep noises accidentally wakes babies who were ten seconds from resettling.',
    action: 'la-pause',
  },
  {
    id: 'ht-possums-bedtime-abort',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m'],
    categories: ['sleep'],
    framework: 'possums-data',
    title: '15-Minute "Low Sleep Pressure" Abort',
    whenToUse: 'Bedtime or nap settling turns into 20+ minutes of crying, arching, or popping wide awake.',
    quickSteps: [
      'Call off the dark-room battle at the 15–20 minute mark—sleep drive simply isn’t high enough yet.',
      'Bring baby out into a dim, calm living room for 15–20 minutes (quiet holding, folding laundry, zero pressure).',
      'Watch for heavy eyelids/quiet body, then try a fresh 5-minute settle.',
    ],
    whyItWorks:
      'Dr. Pamela Douglas (Possums): fighting a low sleep homeostat spikes cortisol for both parent and baby; a 15-minute reset saves everyone’s evening.',
  },
  {
    id: 'ht-shush-pat',
    stages: ['6-12w', '3-6m', '6-9m', '9-12m'],
    categories: ['sleep'],
    framework: 'le-cadre',
    title: 'In-Crib Warm Chest Hand / Shush-Pat',
    whenToUse: 'Settling a drowsy or mildly fussing baby right on the mattress without lifting.',
    quickSteps: [
      'Place baby flat on their back and rest one warm, steady palm gently on the center of their chest.',
      'Add a slow rhythmic pat (~60 bpm—resting heartbeat pace) + low steady "shhhh" or white noise.',
      'Gradually slow your patting and lighten palm pressure over 30 seconds as their breathing deepens.',
    ],
    whyItWorks:
      'Provides reassuring physical anchor while letting your baby experience falling asleep on the crib surface they’ll wake up on.',
  },
  {
    id: 'ht-crib-stand-anchor',
    stages: ['6-9m', '9-12m', '12-18m'],
    categories: ['sleep'],
    framework: 'perry',
    title: 'Crib-Side Quiet Sit (For Crib Standers)',
    whenToUse: 'Newly mobile baby pulls to stand at the crib rail crying out at bedtime.',
    quickSteps: [
      'Skip laying them down 15 times in a row—repeatedly tipping them down turns into an exciting motor game.',
      'Sit quietly next to the crib with relaxed shoulders, pat the mattress once, and keep your voice low and boring.',
      'Once their knees soften or eyelids droop, gently guide them flat once with a warm chest hand.',
    ],
    whyItWorks:
      'Separation awareness peaks right as pulling-to-stand wires in. Boring, steady presence answers "Are you still here?" without starting play.',
    sayOutLoud: '"It’s sleep time. I’m right here—lie down when you’re ready."',
  },
  {
    id: 'ht-toddler-proactive-checkin',
    stages: ['18-24m', '2-3y'],
    categories: ['sleep', 'tantrums'],
    framework: 'perry',
    title: '2-Choice Routine + Proactive 2-Min Check-In',
    whenToUse: 'Toddler bedtime stalling ("More water! Don’t leave! One more book!").',
    quickSteps: [
      'Build two small choices into prep ("Striped PJs or stars? Bear book or truck book?") so their tank for control is full.',
      'At lights-out, promise a proactive check-in BEFORE they call you back.',
      'Actually return in 2 minutes for a 5-second quiet whisper ("Told you I’d check—goodnight"), repeating once if needed.',
    ],
    whyItWorks:
      'Reverses separation chase: when a toddler trusts you are coming back voluntarily, their nervous system stops fighting the closed door.',
    sayOutLoud: '"Stay cozy under covers—I’m putting three plates in the dishwasher and checking back on you in 2 minutes."',
  },

  // ── 3. Tantrums & "No!" (12m–3y, plus 6–12m protest) ──────────────────────
  {
    id: 'ht-5sec-validation',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['tantrums'],
    framework: 'perry',
    title: 'Below Eye Level + 5-Second Validation',
    whenToUse: 'Screaming protest over a boundary (leaving the park, screen off, wrong cup color).',
    quickSteps: [
      'Crouch or sit BELOW their eye line and soften your jaw (towering above triggers fight-or-flight).',
      'Name their feeling in ONE short sentence (<8 words) while holding the limit firm.',
      'Stop talking! Let the emotion wave crest and pass without a 15-minute debate or lecture.',
    ],
    whyItWorks:
      'Whole-Brain Child + 5-Second Guardrail: brief validation calms the amygdala, while stopping there prevents fragile co-rumination.',
    sayOutLoud: '"You really wanted to stay at the park. So mad—and it’s time for home."',
  },
  {
    id: 'ht-water-outside-toddler',
    stages: ['12-18m', '18-24m', '2-3y'],
    categories: ['tantrums', 'crying-gas'],
    framework: 'hgp',
    title: '"Add Water or Step Outside" Reset',
    whenToUse: '5 PM crankiness, cabin fever, escalating whining, or mid-tantrum loop.',
    quickSteps: [
      'Skip verbal reasoning—their downstairs survival brain cannot process logic mid-storm.',
      'Add water: wash hands/cups in warm soapy sink water, offer ice water through a straw, or run a 10-minute afternoon tub.',
      'Or step outside barefoot onto the porch/grass to spot dogs, clouds, or trucks.',
    ],
    whyItWorks:
      'Water and outdoor air trigger immediate vagal/sensory state shifts, breaking cortisol loops without bribes.',
  },
  {
    id: 'ht-two-choices-one-word',
    stages: ['12-18m', '18-24m', '2-3y'],
    categories: ['tantrums'],
    framework: 'perry',
    title: 'Two Real Choices (or One Plain Word)',
    whenToUse: 'Everyday refusal on shoes, car seat, diaper changes, or getting dressed.',
    quickSteps: [
      'Drop threats ("Put shoes on or no park")—threats trigger automatic toddler counter-will ("NO!").',
      'Hold the non-negotiable firm while offering two real micro-options they control.',
      'For routine reminders, point warmly and say ONE plain word ("Shoes"), then wait 5 quiet seconds.',
    ],
    whyItWorks:
      'How to Talk So Little Kids Will Listen: toddlers need 3–5 seconds of auditory processing time and crave agency inside your firm frame.',
    sayOutLoud: '"Time for the car seat: climb in yourself, or Papa rocket lift?"',
  },
  {
    id: 'ht-real-adult-job',
    stages: ['9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['tantrums'],
    framework: 'hgp',
    title: 'Pull Into a Real Adult Job',
    whenToUse: 'Clingy leg-hanging or whining while you’re trying to cook dinner or tidy.',
    quickSteps: [
      'Stop shooing them away toward plastic toys—they are asking to belong to what you’re doing.',
      'Hand them one real, slightly weighty task right beside you (tearing lettuce, scrubbing a potato, pushing the laundry basket).',
      'Acknowledge their real impact matter-of-factly rather than clapping.',
    ],
    whyItWorks:
      'Hunt, Gather, Parent & Montessori: meaningful work satisfies a toddler’s drive for competence and connection simultaneously.',
    sayOutLoud: '"I need a helper—can you wipe the bottom cabinet with this damp cloth while I chop?"',
  },
  {
    id: 'ht-silent-floor-sit',
    stages: ['12-18m', '18-24m', '2-3y'],
    categories: ['tantrums'],
    framework: 'perry',
    title: 'Silent Floor Co-Regulation',
    whenToUse: 'Full-blown overtired meltdown where touching or talking makes them scream "GO AWAY!"',
    quickSteps: [
      'Make sure the immediate floor area is safe, then sit down 3–4 feet away and drop your shoulders.',
      'Breathe slowly and audibly—say one calm reassurance once, then stay completely quiet.',
      'When the wave passes and they crawl into your lap, hug warmly first; keep any cleanup brief and non-shaming.',
    ],
    whyItWorks:
      'Good Inside & Perry: words feel like sensory shrapnel during peak rage. Your quiet, un-scared body anchors the room until their upstairs brain returns.',
    sayOutLoud: '"You’re safe. I’m staying right here until you’re ready for a hug."',
  },
  {
    id: 'ht-emergency-playful-pivot',
    stages: ['18-24m', '2-3y'],
    categories: ['tantrums'],
    framework: 'perry',
    badge: '5% Emergency Only',
    title: 'Fantasy Wish / Playful Tension-Breaker',
    whenToUse: 'Overtired pinch (broken cracker meltdown, 6:30 PM toothbrush wall) when everyone is fried.',
    quickSteps: [
      'For impossible demands ("Un-break my banana!"), skip logic and grant the wish warmly in fantasy.',
      'For a stuck transition, briefly make an object whisper ("Whoa, is a dinosaur hiding behind that tooth?").',
      'Guardrail: keep this for 5% overtired emergencies—rely on calm, plain-spoken expectations 95% of the time.',
    ],
    whyItWorks:
      'Playfulness flips a flooded brain from cortisol to connection in a pinch, while keeping it rare preserves your plain-spoken authority.',
    sayOutLoud: '"Oh man, I wish we had magic banana-welding glue right now!"',
  },

  // ── 4. Hitting & Throwing (6m–3y) ─────────────────────────────────────────
  {
    id: 'ht-sturdy-block',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['hitting-throwing'],
    framework: 'perry',
    title: 'Quiet Physical Block ("I Won’t Let You Hit")',
    whenToUse: 'Hitting, biting, hair-pulling, kicking, or throwing hard toys.',
    quickSteps: [
      'Move swiftly and quietly—gently block their wrist or step between children BEFORE the hit lands.',
      'Keep your face completely neutral (no gasps, scowls, or dramatic lectures that reward testing).',
      'State the boundary in one calm sentence; if throwing continues, calmly put the toy away.',
    ],
    whyItWorks:
      'Good Inside & RIE: toddlers lack upstairs impulse brakes and test whether you are a sturdy pilot. Calm physical certainty extinguishes hitting fastest.',
    sayOutLoud: '"You’re frustrated, AND I won’t let you hit. My job is keeping everyone safe."',
  },
  {
    id: 'ht-food-throwing',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['hitting-throwing', 'food'],
    framework: 'le-cadre',
    title: 'Neutral Food-Drop Meal Pause',
    whenToUse: 'Dropping or hurling food off the highchair tray.',
    quickSteps: [
      'Keep your face boring—never dive dramatically or shout "No!", which turns gravity into theater.',
      'Point to the tray (or provide a small "no thank you" bowl) and state the rule once.',
      'If another piece is thrown, calmly lift them down: throwing means "my belly is done for now."',
    ],
    whyItWorks:
      'Bringing Up Bébé & Montessori: clear, un-angry cause-and-effect teaches table respect without mealtime battles.',
    sayOutLoud: '"Food stays on the table. Looks like your body is telling me you’re all done eating."',
  },

  // ── 5. Food & Solids (0–3y) ───────────────────────────────────────────────
  {
    id: 'ht-division-responsibility',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['food'],
    framework: 'le-cadre',
    title: 'Family Table Rule (Zero Short-Order Cooking)',
    whenToUse: 'Refusing vegetables, picky phases, or demanding separate snacks right after refusing dinner.',
    quickSteps: [
      'Hold your half of the job: decide WHAT family food is served (include 1 safe familiar side like bread/fruit/rice) and WHEN.',
      'Hand over their half completely: let them decide WHETHER and HOW MUCH to eat—zero "two more bites" or dessert bribes.',
      'Keep structured sit-down meal/snack anchors so they arrive at the table genuinely hungry, not full of pouches.',
    ],
    whyItWorks:
      'Bringing Up Bébé & Ellyn Satter: pressure triggers food refusal; calm repeated exposure at shared meals raises capable eaters.',
    sayOutLoud: '"You don’t have to eat the zucchini today. Dinner is on the table, and our kitchen rests until morning."',
  },
  {
    id: 'ht-gagging-vs-choking',
    stages: ['6-9m', '9-12m', '12-18m'],
    categories: ['food'],
    framework: 'possums-data',
    title: 'Gagging vs. Choking Calm Check',
    whenToUse: 'Coughing or sputtering while learning finger foods.',
    quickSteps: [
      'Loud coughing, red face, watering eyes, and gagging noises = protective GAG reflex working properly.',
      'Keep your face calm, sit hands-still, and let them work the piece forward—never blind-sweep a finger in their mouth.',
      'True choking is SILENT, unable to cry/cough, or turning blue: start infant back blows/chest thrusts and call 911 immediately.',
    ],
    whyItWorks:
      'A baby’s gag reflex sits far forward on the tongue at 6 months specifically to protect their airway while learning to chew.',
    safetyNote:
      'Always serve soft, squishable, pea/finger-shaped foods; quarter grapes/cherry tomatoes lengthwise and avoid whole nuts, popcorn, or honey <12m.',
  },

  // ── 6. Scrapes & Fear (6m–3y) ─────────────────────────────────────────────
  {
    id: 'ht-no-gasp-scrape',
    stages: ['6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['scrapes-fear'],
    framework: 'grit',
    title: 'The No-Gasp Tumble Response',
    whenToUse: 'Playground falls, knee scrapes, or bonks that aren’t serious injuries.',
    quickSteps: [
      'Freeze your own gasp—toddlers look straight at your face first to decide if they are in danger.',
      'Keep your expression warm and matter-of-fact; pause 3 seconds so they feel their own body.',
      'Offer a calm hug if they come in (Safe Haven), then let them brush off dirt and head right back out (Launchpad).',
    ],
    whyItWorks:
      'The Blessings of a Skinned Knee & Circle of Security: calm adult reactions wire physical nerve instead of fragility.',
    sayOutLoud: '"Whoa, big tumble! Catch your breath—let’s see you brush those strong knees off."',
  },
  {
    id: 'ht-emotional-agility-brave',
    stages: ['18-24m', '2-3y'],
    categories: ['scrapes-fear'],
    framework: 'grit',
    title: 'Feelings Are Data, Not Directives',
    whenToUse: 'Clinging at swim/music class, hesitating on a slide, or wanting to quit a tricky puzzle.',
    quickSteps: [
      'Validate the hesitation in 5 seconds without rescuing them out of the situation ("New rooms feel big").',
      'Coach zoomed-out self-talk: help them take one breath and pick the smallest first step.',
      'Highlight earned effort afterward ("You felt nervous AND you stepped onto the mat anyway").',
    ],
    whyItWorks:
      'Emotional Agility (Dr. Susan David) & Chatter: resilience is learning we can carry an uncomfortable feeling and still act on our values.',
    sayOutLoud: '"It makes sense you feel shy right now—let’s take that shy feeling by the hand and say hello together."',
  },

  // ── 7. I Lost My Cool (0m–3y) ─────────────────────────────────────────────
  {
    id: 'ht-tap-out-safe-pause',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['repair', 'crying-gas'],
    framework: 'whole-self',
    title: '"Code Yellow" Tap-Out & 2-Min Safe Pause',
    whenToUse: 'Jaw clenched, chest hot, touched-out, and 30 seconds from snapping.',
    quickSteps: [
      'If your spouse is home: call "Code Yellow—need 10 minutes" for an instant, zero-question, zero-critique handoff.',
      'If solo: place baby flat on back in a bare crib (or toddler in a safe room), close the door, and step away for 2 minutes.',
      'Run cold water on your wrists or take 2 physiological sighs (double nasal inhale + slow mouth exhale) before returning.',
    ],
    whyItWorks:
      'Stepping away before losing control isn’t failing—it is protective, sturdy leadership.',
    action: 'breathe',
  },
  {
    id: 'ht-clean-repair',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    categories: ['repair'],
    framework: 'perry',
    title: '30-Second Clean Repair (Zero Blame)',
    whenToUse: 'After raising your voice, rushing roughly, or snapping at your child (or spouse).',
    quickSteps: [
      'Wait until YOUR own heart rate is actually back down—don’t repair while still bristling.',
      'Own 100% of your reaction cleanly without adding "...because you wouldn’t listen!"',
      'Reconnect warmly, state what you’ll do next time, and forgive yourself—repair builds deeper trust than perfection.',
    ],
    whyItWorks:
      'Philippa Perry & Good Inside: generational cycles break not by never rupturing, but by showing children how grounded adults take accountability.',
    sayOutLoud: '"I shouted earlier because I let myself get overwhelmed. That wasn’t fair to you—I’m sorry, and we’re okay."',
  },
];
