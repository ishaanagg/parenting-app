import type { AgeGuide, StageId } from '../domain/types';

export const AGE_GUIDES: Record<StageId, AgeGuide> = {
  '0-6w': {
    stageId: '0-6w',
    headline: 'Survive warmly together, get morning light, and skip clock anxiety.',
    keyShift:
      'Sleep runs on hunger and sensory comfort right now—not schedules. Use Possums (daylight + flexible naps) and protect each other’s recovery.',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'possums-data',
        bullets: [
          'Womb-to-world transition: startle reflexes are strong, vision is 8–12 inches, and your voice/chest are home base.',
          'Active sleep is loud: grunts, squeaks, and brief cries happen between sleep cycles while still fast asleep.',
          'Day–night clock is blank: melatonin and circadian rhythm build gradually over the first 8–12 weeks.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm (Possums Mode)',
        framework: 'possums-data',
        bullets: [
          'Anchor mornings with natural daylight and normal household life; keep night feeds dim, quiet, and zero-chatter.',
          'Skip wake-window timers—let daytime catnaps happen flexibly in arms, carriers, strollers, or bassinets.',
          'Use a 60-second La Pause only on sleep grunts; answer full newborn crying promptly with food or warmth.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your Space',
        framework: 'montessori-rie',
        bullets: [
          'Keep a clear, flat, bare bassinet/crib for back-sleeping; save swaddles strictly for pre-rolling weeks.',
          'Set up one simple floor mat for brief awake stretches—skip flashing electronic swings or loud crib mobiles.',
          'Narrate once before lifting or changing diapers ("I’m going to pick you up") to build calm predictability.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Security & Resilience',
        framework: 'whole-self',
        bullets: [
          'Drop partner gatekeeping from Week 1: let Mom and Dad soothe, burp, and dress in their own style.',
          'Winnicott’s rule starts here: finishing a sip of water for 30 seconds while baby is safe won’t harm attachment.',
          'Share one 6-second kiss and one honest "Code Yellow" tap-out rule so neither of you burns out.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Feeding to sleep, contact naps, or pacifiers—"bad habits" do not exist in the fourth trimester.',
          'Short 20–30 minute daytime catnaps—completely normal infant sleep biology before 4–5 months.',
          'Breast vs. combo vs. formula guilt—Emily Oster’s data shows rested, sane parents matter far more.',
        ],
      },
    ],
  },

  '6-12w': {
    stageId: '6-12w',
    headline: 'First social smiles arrive alongside peak evening fussiness.',
    keyShift:
      'Evening crying (PURPLE crying) peaks around weeks 6–8 and fades by month 3–4. Bring baby out into your real day rather than hiding indoors.',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'possums-data',
        bullets: [
          'Evening fussiness peaks: healthy babies often cluster-feed or cry harder between 5 PM and 10 PM.',
          'Real social smiles and cooing begin—baby starts tracking faces, trees, and light contrast eagerly.',
          'Early circadian cues emerge: longer first night stretches often start appearing without formal training.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm (Possums Mode)',
        framework: 'le-cadre',
        bullets: [
          'Extend La Pause up to 2 minutes on night stirrings so baby practices linking 45-minute sleep cycles.',
          '15-minute rule: if bedtime settling turns into 20 minutes of arching/crying, abort to a dim room for 15 minutes first.',
          'Stop swaddling the very first week you spot any sign of rolling onto a side.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your Space',
        framework: 'hgp',
        bullets: [
          'Wear baby in a snug carrier during errands, walks, or café stops—outdoor sensory variety calms fussy brains.',
          'Give 5–10 minutes of daily floor/tummy time on a firm mat without propping them into seated containers.',
          'Keep evenings low-lamp and low-volume 30 minutes before bed to prevent overtired cortisol spikes.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Security & Resilience',
        framework: 'perry',
        bullets: [
          'Co-regulate through witching hour: if a fed, burped baby cries in your arms, your calm chest still buffers stress.',
          'Trade 20-minute shifts with your spouse during evening crying—no hovering, no critique.',
          'Let trusted grandparents or caregivers hold baby early so secondary bonds feel natural.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Rigid nap schedules—naps remain variable until circadian sleep architecture matures around 4 months.',
          'Entertaining baby while awake—watching ceiling shadows, trees, or you folding laundry is rich learning.',
          'Comparing night stretches with other parents—normal 8–12 week sleep spans a huge healthy range.',
        ],
      },
    ],
  },

  '3-6m': {
    stageId: '3-6m',
    headline: 'Hands grab everything, sleep cycles mature, and adult evenings return.',
    keyShift:
      'The 4-Month Pivot: transition smoothly from newborn on-the-go flexibility (Possums) to predictable nap and 8 PM bedtime anchors (Le Cadre).',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'possums-data',
        bullets: [
          'Sleep architecture shifts around month 4 from newborn sleep into lighter/deeper adult-like cycles.',
          'Distracted daytime feeds: sudden curiosity makes every dog bark or lamp pull baby off mid-feed.',
          'Rolling, grasping, and mouthing: frustration tolerance begins as they reach for objects just out of grasp.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm (The 4m Pivot)',
        framework: 'le-cadre',
        bullets: [
          'Anchor morning wake-up + a consistent ~7:30–8:00 PM bedtime routine (Feed → Sack → Song → Crib).',
          'Pause 2–3 minutes on night stirrings so they practice resettling between lighter sleep cycles.',
          'Reclaim your 8 PM adult evening: cap chores at 15 minutes so you and your spouse stop living on duty 24/7.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your "Yes" Space',
        framework: 'montessori-rie',
        bullets: [
          'Clear one safe floor zone with 2–3 graspable objects (wooden ring, crinkle cloth)—skip jumpers and walkers.',
          'Never interrupt a focused baby staring at their hands or working to roll—even to clap or praise.',
          'Feed in a quiet, dim corner during the day when curiosity makes feeds choppy.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Grit & Security',
        framework: 'grit',
        bullets: [
          'Don’t steal the 2-inch reach: wait 20–30 seconds when they grunt reaching for a toy before assisting.',
          'Start practicing safe short waits ("One moment, I’m pouring water") so patience wires naturally.',
          'Bring baby outdoors daily in sun, breeze, or light drizzle—real weather builds sensory adaptability.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          '"4-month sleep regression" doom—it’s permanent brain maturation, not lost progress.',
          'Exact rolling week—babies master rolling on wildly different timelines when given free floor movement.',
          'Starting solids at 4m vs. 6m—wait for steady head/trunk control and genuine interest at your doctor’s cue.',
        ],
      },
    ],
  },

  '6-9m': {
    stageId: '6-9m',
    headline: 'Sitting up at the family table and discovering cause-and-effect.',
    keyShift:
      'Skip separate "kid food" habits from bite one—bring baby straight to the family table with real flavors and zero pressure.',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'le-cadre',
        bullets: [
          'Sitting, pivoting, and early crawling turn your baby from observer into active room explorer.',
          'Object permanence clicks: realizing you still exist out of sight sparks the first waves of separation protest.',
          'Early allergen and texture window: repeated, low-pressure exposure builds lifelong adventurous eating.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm',
        framework: 'le-cadre',
        bullets: [
          'Most babies settle into 2–3 predictable daytime naps plus a steady ~7:30–8:00 PM bedtime frame.',
          'Use a 3-minute La Pause for night stirrings; keep any night check-in brief, warm, and unexciting.',
          'Anchor family dinner together—even 10 minutes in the highchair watching you eat real food teaches table culture.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your "Yes" Space',
        framework: 'montessori-rie',
        bullets: [
          'Babyproof one main living zone (cords, outlets, heavy furniture anchored) so exploration needs minimal "No!"',
          'Introduce an open sip of water in a tiny cup at meals alongside soft, squishable finger foods.',
          'Keep screens completely off during meals and floor play—real faces and physics are the curriculum.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Grit & Security',
        framework: 'grit',
        bullets: [
          'Pair Safe Haven + Launchpad: warm hug when startled, calm nod from across the room when they crawl out.',
          'Start the 5-Second Validation Rule on limits: "You wanted my glasses. Keeping them safe"—then move on.',
          'Keep a relaxed face on gagging (normal learning reflex as solids start) vs. true silent choking.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Funny faces at broccoli—French research shows it often takes 8–15 calm exposures before a flavor clicks.',
          'Purées vs. baby-led weaning—combining mashed spoon-foods and soft finger foods works great.',
          'Exact tooth or crawl week—some babies army-crawl at 6m, others skip straight to cruising at 10m.',
        ],
      },
    ],
  },

  '9-12m': {
    stageId: '9-12m',
    headline: 'Fast cruisers, big opinions, and the dawn of sturdy boundaries.',
    keyShift:
      'Your baby now understands tone and cause-and-effect: replace dramatic "No!" reactions with calm, matter-of-fact physical limits.',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'perry',
        bullets: [
          'Cruising furniture, pulling to stand in the crib, and pointing to share discoveries with you.',
          'Gravity & reaction experiments: dropping food off the tray tests both physics and your facial expression.',
          'Separation awareness peaks: clinging at handoffs is healthy attachment, not fragility.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm',
        framework: 'le-cadre',
        bullets: [
          'Two steady naps + 8 PM bedtime anchor the day; don’t rush to 1 nap if they suddenly play in the crib.',
          'If they stand crying at bedtime, sit quietly crib-side and pat the mattress once instead of laying them down 20 times.',
          'Shift toward 3 family meal anchors + 1–2 sit-down snacks rather than all-day snack-pouch grazing.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your "Yes" Space',
        framework: 'montessori-rie',
        bullets: [
          'Give them one "yes" kitchen drawer (wooden spoons, metal bowls) right beside you while you cook.',
          'Rotate 4–5 simple toys on a low shelf instead of a giant toy bin—less clutter creates deeper play.',
          'Hold zero-screen waits at restaurants/errands: hand them a spoon, napkin, or include them in watching people.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Grit & Security',
        framework: 'grit',
        bullets: [
          'Confident drop-offs: give a warm hug, a clear goodbye ("I’ll be back after nap"), and never sneak out.',
          'Neutral food-drop boundary: say once "Food stays on the tray"; if thrown again, calmly end the meal.',
          'Invite tiny real chores—dropping laundry in the basket or wiping their tray with a damp cloth.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Walking before 12 months—normal independent walking spans roughly 9 to 16+ months.',
          'Smaller appetite waves—growth slows slightly near age 1; watch weekly energy, not single meals.',
          'Clinginess around strangers—being selective with unfamiliar adults is normal 9–12m wiring.',
        ],
      },
    ],
  },

  '12-18m': {
    stageId: '12-18m',
    headline: 'Walking into toddlerhood: real household jobs and calm physical limits.',
    keyShift:
      'Toddlers desperately want to imitate adult work—pull them into real chores instead of shooing them toward toys.',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'hgp',
        bullets: [
          'Receptive language explodes—they understand dozens of everyday phrases months before speaking them.',
          'Drive for bodily agency surges: wanting to hold the spoon, push the stroller, and climb every step.',
          'Impulse control is zero: touching forbidden objects is curiosity + checking that your guardrail holds.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm',
        framework: 'le-cadre',
        bullets: [
          'Most transition from 2 naps to 1 midday nap between 13 and 17 months—protect an early bedtime during the shift.',
          'Transition off bottles toward open/straw cups and family table meals + structured sit-down snacks.',
          'Keep your 8 PM adult evening sacred so marriage friendship and personal hobbies stay energized.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your "Yes" Space',
        framework: 'montessori-rie',
        bullets: [
          'Add a low coat hook by the door, a small basket for shoes, and a wipe cloth within toddler reach.',
          'Prioritize daily outdoor walking, dirt, grass, and climbing over stroller-only outings or screens.',
          'Start tasks and let them finish the last inch: pull socks over toes so they tug the heel on.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Grit & Security',
        framework: 'grit',
        bullets: [
          'Check your face on tumbles: skip gasping! Say calmly, "Big bump—you’re safe," so they wire physical courage.',
          'Block hitting/grabbing quietly without scolding: "You’re mad. I won’t let you hit"—zero drama.',
          'Stand united with your spouse on limits so your toddler feels a steady, un-anxious frame.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Toddler "picky" meal swings—appetite naturally dips in year two; keep serving family food calmly.',
          'Pronunciation quirks—animal sounds, signs, and partial words all count toward early word milestones.',
          'Parallel play—toddlers play beside peers rather than sharing smoothly until closer to age 3.',
        ],
      },
    ],
  },

  '18-24m': {
    stageId: '18-24m',
    headline: 'Big autonomy collisions met with 5-second validation and two real choices.',
    keyShift:
      'When the downstairs emotion brain floods, skip lectures and 15-minute feelings talks—validate in 5 seconds, hold the limit, and move on.',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'perry',
        bullets: [
          'Language + identity leap: "NO!" and "Mine!" mean "I am discovering I am a separate person."',
          'Big gap between desires and motor skill triggers fast frustration meltdowns—especially around 5 PM.',
          'Keen social radar: they watch how Mom and Dad speak to each other, neighbors, and strangers.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm',
        framework: 'le-cadre',
        bullets: [
          'One solid midday nap + predictable 7:30–8:00 PM bedtime routine with two built-in micro-choices.',
          'Cure bedtime stalling with a proactive check-in ("Stay cozy—I’ll check back on you in 2 minutes").',
          'Keep them in a sleep sack / crib until closer to 2.5–3y unless climbing out—impulses aren’t ready for open beds yet.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your "Yes" Space',
        framework: 'montessori-rie',
        bullets: [
          'Bring a sturdy kitchen helper tower or low table into meal prep: tearing lettuce or washing potatoes beats whining.',
          'Put 2 outfit options out instead of the whole closet so morning dressing feels autonomous, not overwhelming.',
          'Zero algorithm videos or tablet pacifiers at restaurants—bring 2 crayons or include them in adult conversation.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Grit & Character',
        framework: 'grit',
        bullets: [
          'Enforce the 5-Second Validation Rule: crouch below eye level, name it (<8 words), hold the boundary, stop talking.',
          'Reset afternoon meltdowns physically—add warm sink water or step barefoot outside instead of reasoning.',
          'Start outward manners: model clear eye contact + "Hello" and "Thank you" with neighbors and store staff.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Public tantrums—a meltdown after you hold a calm boundary means you succeeded as the sturdy pilot.',
          'Flashcards, ABC apps, or academic drills—unstructured physical play wires executive function far better.',
          'Saying "No!" to favorite things—give 5 quiet seconds; toddlers often say "No" automatically while meaning "Give me a beat."',
        ],
      },
    ],
  },

  '2-3y': {
    stageId: '2-3y',
    headline: 'Forging real capability, emotional agility, and outward character.',
    keyShift:
      'Graduate past just naming feelings into Emotional Agility: "Feelings are data, not directives—we can feel mad or nervous and still act well."',
    sections: [
      {
        id: 'developing',
        title: 'What’s Developing Now',
        framework: 'grit',
        bullets: [
          'Sentences, imagination, and "Why?" questions bloom alongside fierce "I do it myself!" pride.',
          'Testing fairness and consistency: any gap between Mom’s rules and Dad’s rules gets spotted immediately.',
          'Early self-talk begins—how you coach them through hard moments becomes their own inner voice.',
        ],
      },
      {
        id: 'rhythm',
        title: 'Sleep & Daily Rhythm',
        framework: 'le-cadre',
        bullets: [
          'Midday nap (or 45-minute quiet room rest on skipped-nap days) preserves peaceful dinners and bedtimes.',
          'Use visual/predictable routines (Toilet → PJs → Brush → 2 Books → Lights out) so the routine is the boss, not nagging.',
          'Guard your 8 PM united adult evening—your visible affection as a couple anchors their whole world.',
        ],
      },
      {
        id: 'yes-space',
        title: 'Set Up Your "Yes" Space',
        framework: 'montessori-rie',
        bullets: [
          'Keep a low water pitcher/cup, small broom/cloth for spills, and step stool at the bathroom sink.',
          'Prioritize rough-and-tumble play, climbing, balance bikes, and mud—real physical risk builds calm brains.',
          'Save playful voices/fantasy wishes strictly for 5% overtired emergencies; expect plain-spoken cooperation 95% of the time.',
        ],
      },
      {
        id: 'grit',
        title: 'Build Grit & Character',
        framework: 'grit',
        bullets: [
          'Let small natural consequences teach: spilled water = wipe together; refused coat = carry it until the wind teaches.',
          'Coach Emotional Agility + zoomed-out self-talk: "Take your nervous feeling by the hand—one breath, try sideways."',
          'Expect outward contribution: carrying their plate to the counter, thanking the cook, and tidying shared spaces.',
        ],
      },
      {
        id: 'dont-stress',
        title: 'Don’t Stress Over This',
        framework: 'possums-data',
        bullets: [
          'Exact potty-learning week—readiness signs and zero-pressure consistency beat arbitrary calendar races.',
          'Dropped afternoon naps near age 3—quiet independent rest time keeps everyone’s nervous system steady.',
          'Occasional boundary pushback—pushing limits doesn’t mean your child is defiant; it means they’re verifying the frame holds.',
        ],
      },
    ],
  },
};
