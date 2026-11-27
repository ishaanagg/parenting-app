import type { PracticeRep } from '../domain/types';

export const PRACTICES: PracticeRep[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // TRACK 1: FOR YOUR KID (0–6w through 2–3y)
  // ══════════════════════════════════════════════════════════════════════════

  // ── 0–6 Weeks & 6–12 Weeks ────────────────────────────────────────────────
  {
    id: 'hgp-bring-along-0-6w',
    track: 'kid',
    stages: ['0-6w', '6-12w'],
    framework: 'hgp',
    title: 'Live your day, bring baby along',
    prompt:
      'During one ordinary task today (making coffee, folding laundry, a short walk), wear or place baby nearby instead of setting up a "baby activity."',
    whyItWorks:
      'Hunt, Gather, Parent: babies learn calm and belonging by joining real family life—no constant entertainment required.',
  },
  {
    id: 'possums-daylight-0-12w',
    track: 'kid',
    stages: ['0-6w', '6-12w'],
    framework: 'possums-data',
    title: 'Morning daylight, zero wake-window stress',
    prompt:
      'Step outside or sit by a bright window with baby within an hour of morning wake-up, and let one daytime nap happen naturally on the go.',
    whyItWorks:
      'Possums (Dr. Pamela Douglas): rich daytime light and real-world sensory input tune circadian rhythm and dial down fussiness better than dark-room clock-watching.',
  },
  {
    id: 'rie-narrate-touch-0-12w',
    track: 'kid',
    stages: ['0-6w', '6-12w', '3-6m'],
    framework: 'montessori-rie',
    title: 'Tell them once before you lift',
    prompt:
      'Before one diaper change or pick-up today, pause 2 seconds, make eye contact, and say calmly: "I’m going to pick you up now."',
    whyItWorks:
      'RIE (Janet Lansbury & Magda Gerber): treating infants as aware partners during caregiving builds early trust and bodily respect.',
  },
  {
    id: 'hgp-calm-voice-0-6w',
    track: 'kid',
    stages: ['0-6w', '6-12w'],
    framework: 'hgp',
    title: 'Lower your volume, slow your pace',
    prompt:
      'During one fussy moment today, deliberately speak one notch quieter and move more slowly than feels natural for 60 seconds.',
    whyItWorks:
      'Hunt, Gather, Parent: calm nervous systems are contagious. Babies borrow your slower rhythm to settle their own.',
  },
  {
    id: 'cadre-listen-sleep-0-6w',
    track: 'kid',
    stages: ['0-6w'],
    framework: 'le-cadre',
    title: 'Listen for 30 seconds of active sleep',
    prompt:
      'Next time baby grunts or squirms during a nap, keep your hands still and listen for 30 seconds to tell active sleep apart from true waking.',
    whyItWorks:
      'Bringing Up Bébé: newborns grunt and whimper between sleep cycles while still asleep; pausing avoids accidentally waking them.',
  },
  {
    id: 'perry-shoulder-check-0-6w',
    track: 'kid',
    stages: ['0-6w', '6-12w', '3-6m'],
    framework: 'perry',
    title: 'Notice your own alarm bell',
    prompt:
      'Next time crying spikes your heart rate, silently name it—"My alarm is firing, and we’re safe"—and drop your shoulders before lifting.',
    whyItWorks:
      'Philippa Perry: crying often stirs up our own stress reflexes. Steadying your body first lets your baby borrow real calm.',
  },

  // ── 6–12 Weeks & 3–6 Months ───────────────────────────────────────────────
  {
    id: 'cadre-observe-first-6-12w',
    track: 'kid',
    stages: ['6-12w', '3-6m'],
    framework: 'le-cadre',
    title: 'Pause & observe before rescuing',
    prompt:
      'When baby fusses mildly on a play mat or stirs from a nap, wait 30–60 seconds with relaxed hands and watch what they are working on first.',
    whyItWorks:
      'Bringing Up Bébé: small pauses give babies space to link sleep cycles and discover their own capability.',
  },
  {
    id: 'cadre-one-anchor-6-12w',
    track: 'kid',
    stages: ['6-12w', '3-6m'],
    framework: 'le-cadre',
    title: 'Repeat one boring wind-down cue',
    prompt:
      'Before sleep today, use the exact same 60-second sequence (dim light, sleep sack, one quiet phrase, lay down) so rest feels predictable.',
    whyItWorks:
      'Bringing Up Bébé: steady anchors form Le Cadre—helping babies anticipate sleep and helping you reclaim adult evenings after 4 months.',
  },
  {
    id: 'montessori-quiet-floor-3-6m',
    track: 'kid',
    stages: ['3-6m', '6-9m'],
    framework: 'montessori-rie',
    title: 'Five minutes of uninterrupted floor play',
    prompt:
      'Place baby on a firm blanket with 1–2 simple objects (a wooden spoon, a cloth) and step back—skip narrating or clapping while they focus.',
    whyItWorks:
      'Montessori & RIE: protecting deep concentration wires focus and intrinsic pride instead of dependence on adult entertainment.',
  },
  {
    id: 'hgp-outside-reset-3-9m',
    track: 'kid',
    stages: ['3-6m', '6-9m'],
    framework: 'hgp',
    title: 'Ten quiet minutes outdoors',
    prompt:
      'Carry or stroll baby outside to watch leaves, clouds, or neighborhood motion without feeling pressure to narrate every sight.',
    whyItWorks:
      'Hunt, Gather, Parent & Possums: natural outdoor sensory life settles infant nervous systems far faster than battery-powered toys.',
  },
  {
    id: 'grit-reach-struggle-3-9m',
    track: 'kid',
    stages: ['3-6m', '6-9m'],
    framework: 'grit',
    title: 'Don’t steal the 2-inch reach',
    prompt:
      'When baby grunts trying to roll or reach a toy just out of grasp, sit nearby warmly for 20 seconds without sliding the toy closer.',
    whyItWorks:
      'The Blessings of a Skinned Knee & Gift of Failure: earned confidence starts in infancy by surviving tiny, safe frustrations.',
  },

  // ── 6–9 Months & 9–12 Months ──────────────────────────────────────────────
  {
    id: 'cadre-real-food-6-9m',
    track: 'kid',
    stages: ['6-9m', '9-12m', '12-18m'],
    framework: 'le-cadre',
    title: 'One shared family food, zero coaxing',
    prompt:
      'Put a tiny, baby-safe piece of what you are eating onto their tray and eat yours alongside them—no airplane spoons or "one more bite."',
    whyItWorks:
      'Bringing Up Bébé: calm, repeated exposure at the family table raises adventurous eaters without power struggles.',
    safetyNote:
      'Serve soft, squishable, finger-sized pieces; avoid whole grapes, nuts, popcorn, or honey before 12 months.',
  },
  {
    id: 'grit-launchpad-6-12m',
    track: 'kid',
    stages: ['6-9m', '9-12m', '12-18m'],
    framework: 'grit',
    title: 'Be the quiet launchpad',
    prompt:
      'When your baby crawls or cruises away to explore a safe room, stay put with a warm nod when they glance back—let them come and go freely.',
    whyItWorks:
      'Circle of Security: secure attachment has two halves—welcoming them back when hurt, and delighting in their independence when they venture out.',
  },
  {
    id: 'perry-5sec-validate-6-12m',
    track: 'kid',
    stages: ['6-9m', '9-12m'],
    framework: 'perry',
    title: 'Validate in 5 seconds, hold the line',
    prompt:
      'When baby protests having cords or glasses taken away, say once: "You’re mad I took that. I’m keeping it safe"—then move on calmly.',
    whyItWorks:
      'Good Inside + 5-Second Guardrail: brief validation honors their feeling while clean forward motion prevents fragile co-rumination.',
  },
  {
    id: 'cadre-food-drop-9-12m',
    track: 'kid',
    stages: ['9-12m', '12-18m'],
    framework: 'le-cadre',
    title: 'Neutral face when food hits the floor',
    prompt:
      'If food gets dropped off the tray, skip gasps or "No!" Say calmly once, "Food stays on the tray," and if it repeats, calmly end the meal.',
    whyItWorks:
      'Bringing Up Bébé & RIE: dramatic reactions turn throwing into a thrilling game; matter-of-fact action teaches limits fast.',
  },
  {
    id: 'hgp-tiny-helper-9-12m',
    track: 'kid',
    stages: ['9-12m', '12-18m'],
    framework: 'hgp',
    title: 'Hand them one real household job',
    prompt:
      'Invite your child to drop one sock into the laundry basket, hold a damp cloth on a spill, or hand you a wooden spoon while you cook.',
    whyItWorks:
      'Hunt, Gather, Parent & Montessori: folding toddlers into real work channels their hunger for agency into family teamwork.',
  },

  // ── 12–18 Months, 18–24 Months & 2–3 Years ────────────────────────────────
  {
    id: 'grit-no-gasp-tumble-12m-3y',
    track: 'kid',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'grit',
    title: 'Keep a calm face on minor tumbles',
    prompt:
      'On today’s inevitable trip or bump, relax your face instead of gasping. Say steadily: "Big bump! Catch your breath—you’re okay," and let them brush off.',
    whyItWorks:
      'The Blessings of a Skinned Knee: toddlers scan your face to decide if pain is an emergency; your calm wires physical nerve.',
  },
  {
    id: 'montessori-last-inch-12m-3y',
    track: 'kid',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'montessori-rie',
    title: 'Start the task, let them finish the last inch',
    prompt:
      'Engage the bottom of their coat zipper, pull a sock over the toes, or loosen a lid—then pause so your toddler pulls it the rest of the way.',
    whyItWorks:
      'The Montessori Toddler: scaffolding only the hardest step lets kids earn genuine "I did it myself" competence.',
  },
  {
    id: 'perry-sturdy-block-12m-3y',
    track: 'kid',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'perry',
    title: 'Block the hand quietly, skip the lecture',
    prompt:
      'If your toddler swings, grabs, or throws, gently block their hand with a calm face: "You’re mad. I won’t let you hit"—then stop talking.',
    whyItWorks:
      'Good Inside & RIE: toddlers rattle boundaries like bridge guardrails to check they hold; calm physical certainty reassures them fastest.',
  },
  {
    id: 'perry-two-choices-18m-3y',
    track: 'kid',
    stages: ['18-24m', '2-3y'],
    framework: 'perry',
    title: 'Trade an ultimatum for two real choices',
    prompt:
      'During one sticky transition today (shoes, car seat, bath), keep the boundary firm and offer two micro-options: "Walk yourself, or hop to the door?"',
    whyItWorks:
      'How to Talk So Little Kids Will Listen: offering small agency inside a non-negotiable limit sidesteps power struggles without bribes.',
  },
  {
    id: 'perry-one-word-18m-3y',
    track: 'kid',
    stages: ['18-24m', '2-3y'],
    framework: 'perry',
    title: 'Say it in one plain word',
    prompt:
      'Instead of a 3-sentence reminder today, point warmly and use one calm word—"Shoes," "Cup on table," or "Gentle hands"—then wait 5 seconds.',
    whyItWorks:
      'How to Talk So Little Kids Will Listen: toddlers need extra seconds to process speech; one plain word lets their own brain supply the action.',
  },
  {
    id: 'grit-outward-manners-18m-3y',
    track: 'kid',
    stages: ['18-24m', '2-3y'],
    framework: 'grit',
    title: 'Practice one outward greeting or thank-you',
    prompt:
      'Model warm eye contact and a clear "Hello" or "Thank you" to a neighbor, cashier, or grandparent today, inviting your child in without forcing.',
    whyItWorks:
      'The Blessings of a Skinned Knee: grounded kids learn early that other people’s effort matters and the world doesn’t orbit their mood.',
  },
  {
    id: 'grit-screen-free-wait-12m-3y',
    track: 'kid',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'grit',
    title: 'Protect one boring, screen-free wait',
    prompt:
      'At the table, grocery line, or car wait today, keep phones tucked away—let your toddler observe people, hold a spoon, or sit with 2 minutes of boredom.',
    whyItWorks:
      'The Anxious Generation (Jonathan Haidt): tolerating everyday boredom without digital pacifiers builds lifelong attention and emotional steadiness.',
  },
  {
    id: 'grit-feelings-data-2-3y',
    track: 'kid',
    stages: ['2-3y'],
    framework: 'grit',
    title: 'Take the nervous feeling by the hand',
    prompt:
      'When your child hesitates or feels frustrated by something hard, say: "It’s okay to feel nervous—let’s bring that feeling along and try one step."',
    whyItWorks:
      'Emotional Agility (Dr. Susan David): emotional maturity means learning feelings are valid data—not orders we have to obey.',
  },
  {
    id: 'grit-natural-consequence-2-3y',
    track: 'kid',
    stages: ['2-3y'],
    framework: 'grit',
    title: 'Let one tiny natural consequence teach',
    prompt:
      'If water spills, hand them a small towel neutrally ("Let’s wipe it together"); if they refuse a jacket, carry it along until the breeze teaches why.',
    whyItWorks:
      'The Gift of Failure: safe, low-stakes cause-and-effect at age 2 builds real accountability without parental nagging.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRACK 2: FOR YOU & YOUR MARRIAGE (0–6w through 2–3y)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'couple-6sec-kiss-all',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Share one 6-second kiss today',
    prompt:
      'At one hello, goodbye, or kitchen pass-by today, pause for a full 6-second kiss with your spouse—long enough to shift out of co-manager mode.',
    whyItWorks:
      'And Baby Makes Three (Gottman): six seconds triggers oxytocin, lowers cortisol, and reminds both of you that your marriage anchors the house.',
  },
  {
    id: 'couple-no-gatekeeping-0-12m',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'],
    framework: 'whole-self',
    title: 'Hand off and step all the way back',
    prompt:
      'When your spouse takes baby for a burp, diaper, or soothing walk today, resist offering a single tip—let them do it 100% their own way.',
    whyItWorks:
      'And Baby Makes Three: dropping gatekeeping prevents default-parent burnout and gives your baby two confident, distinct anchors.',
  },
  {
    id: 'couple-hot-coffee-all',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Finish your hot coffee (or adult sentence) first',
    prompt:
      'Once today when your child is safe and only mildly fussing, take 60 calm seconds to finish your sip of coffee or finish speaking to your spouse.',
    whyItWorks:
      'Winnicott’s "Good Enough" Parent & Bringing Up Bébé: seamless 100% instant service blocks resilience—small, safe waits build a grounded child.',
  },
  {
    id: 'couple-soft-startup-all',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Ask for relief with a softened startup',
    prompt:
      'When your tank drops today, state your concrete need—"I’m touched-out; can I tap out for 15 minutes?"—skipping "You haven’t..." or sighs.',
    whyItWorks:
      'And Baby Makes Three: sleep deprivation magnifies defensiveness; plain, direct requests invite your spouse onto your team.',
  },
  {
    id: 'couple-no-baby-talk-5m-all',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Five minutes with baby talk banned',
    prompt:
      'Take 5 minutes tonight to ask your spouse one real question about their head, work, or interests—with schedules, diapers, and logistics off-limits.',
    whyItWorks:
      'And Baby Makes Three: protecting curiosity about each other’s adult inner world prevents the post-baby roommate drift.',
  },
  {
    id: 'couple-cpe-handoff-all',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Own one task end-to-end (zero reminders)',
    prompt:
      'Pick one recurring need today (bath, bottles, dinner, restocking diapers) and own noticing, planning, and doing it so your spouse’s brain fully rests.',
    whyItWorks:
      'Fair Play (Eve Rodsky): resentment comes from holding the invisible mental clipboard; full CPE ownership gives real mental rest.',
  },
  {
    id: 'couple-work-bridge-all',
    track: 'couple',
    stages: ['6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Take a 90-second bridge breath after work',
    prompt:
      'Before walking out of your workspace or car into family hours, do two slow double-inhales + long exhales, then greet your spouse warmly first.',
    whyItWorks:
      'Work, Parent, Thrive (Dr. Yael Schonbrun): clean role transitions drop work cortisol and model adult partnership right at the doorway.',
  },
  {
    id: 'couple-adult-evening-3m-3y',
    track: 'couple',
    stages: ['3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'le-cadre',
    title: 'Claim tonight’s evening for adults, not chores',
    prompt:
      'Once your child is down tonight, cap cleanup at 15 minutes and spend the rest of the evening resting together or doing something purely for yourselves.',
    whyItWorks:
      'Bringing Up Bébé & Unicorn Space: protecting off-duty evenings prevents parental martyrdom and keeps your own aliveness intact.',
  },
  {
    id: 'couple-united-front-12m-3y',
    track: 'couple',
    stages: ['12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Back your spouse’s boundary in real time',
    prompt:
      'When one of you sets a limit today, visibly back it up ("Mama/Papa said shoes stay on; we’re on the same team")—save any tweaks for private later.',
    whyItWorks:
      'Gottman & Good Inside: nothing grounds a boundary-testing toddler deeper than seeing Mom and Dad calm, affectionate, and un-wedgeable.',
  },
  {
    id: 'couple-tolerate-guilt-all',
    track: 'couple',
    stages: ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m', '12-18m', '18-24m', '2-3y'],
    framework: 'whole-self',
    title: 'Protect one personal hour—and let guilt pass',
    prompt:
      'Take or schedule 45–60 minutes for your own workout, hobby, or solo recharge this week. If a wave of guilt pops up, notice it without canceling.',
    whyItWorks:
      'Real Self-Care (Dr. Pooja Lakshmin) & Unicorn Space: feeling temporary guilt doesn’t mean you’re wrong—kids thrive watching whole, energized parents.',
  },
];
