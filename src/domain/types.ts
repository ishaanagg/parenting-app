export const STAGE_IDS = [
  '0-6w',
  '6-12w',
  '3-6m',
  '6-9m',
  '9-12m',
  '12-18m',
  '18-24m',
  '2-3y',
] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type BookFramework =
  | 'hgp'
  | 'le-cadre'
  | 'montessori-rie'
  | 'perry'
  | 'grit'
  | 'whole-self'
  | 'possums-data';

export type PracticeTrack = 'kid' | 'couple';

export const PARENT_MOODS = ['steady', 'tired', 'touched-out', 'triggered'] as const;
export type ParentMood = (typeof PARENT_MOODS)[number];

export const THEME_PREFERENCES = ['auto', 'day', 'night'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export interface StageDefinition {
  id: StageId;
  label: string;
  subtitle: string;
  minWeeks: number;
  maxWeeks: number;
  laPauseSeconds: number;
  laPauseNote: string;
  focusSummary: string;
}

export interface FrameworkSourceBook {
  title: string;
  author: string;
}

export interface FrameworkGuide {
  id: BookFramework;
  shortLabel: string;
  themeTitle: string;
  sourceBooks: FrameworkSourceBook[];
  coreIdea: string;
  pillars: string[];
}

export interface PracticeRep {
  id: string;
  track?: PracticeTrack;
  stages: StageId[];
  framework: BookFramework;
  title: string;
  prompt: string;
  whyItWorks: string;
  safetyNote?: string;
}

export interface SosCryCue {
  id: string;
  stages?: StageId[];
  label: string;
  meaning: string;
  nextStep: string;
}

export interface RepairScript {
  id: string;
  situation: string;
  innerReset: string;
  outLoud: string;
}

export interface SupportLine {
  id: string;
  label: string;
  detail: string;
  href: string;
}

export type AgeGuideSectionId =
  | 'developing'
  | 'rhythm'
  | 'yes-space'
  | 'grit'
  | 'dont-stress';

export interface AgeGuideSection {
  id: AgeGuideSectionId;
  title: string;
  framework: BookFramework;
  bullets: [string, string, string];
}

export interface AgeGuide {
  stageId: StageId;
  headline: string;
  keyShift: string;
  sections: [
    AgeGuideSection,
    AgeGuideSection,
    AgeGuideSection,
    AgeGuideSection,
    AgeGuideSection,
  ];
}

export const HOW_TO_CATEGORIES = [
  'crying-gas',
  'sleep',
  'tantrums',
  'hitting-throwing',
  'food',
  'scrapes-fear',
  'repair',
] as const;
export type HowToCategoryId = (typeof HOW_TO_CATEGORIES)[number];

export interface HowToGuide {
  id: string;
  stages: StageId[];
  categories: HowToCategoryId[];
  framework: BookFramework;
  title: string;
  /** 1-line cue for when to reach for this play */
  whenToUse: string;
  /** 3 fast, numbered steps scannable in 10 seconds by a spouse */
  quickSteps: [string, string, string];
  /** Deeper 9 PM couch explanation */
  whyItWorks: string;
  /** Optional calm out-loud script */
  sayOutLoud?: string;
  /** Optional safety guardrail */
  safetyNote?: string;
  /** Optional badge such as "5% Emergency Only" or "Check First" */
  badge?: string;
  /** Optional 1-tap link to timer or breathing pacer */
  action?: 'la-pause' | 'breathe';
}

export interface HouseRulePreset {
  id: string;
  stages: StageId[];
  framework: BookFramework;
  rule: string;
  why: string;
}

export interface CoupleCheckInPrompt {
  id: string;
  framework: BookFramework;
  connectionQuestion: string;
  ownershipCheck: string;
}

export const PERSONAL_TIME_CHIPS = [
  { id: 'workout', label: 'Workout / Run' },
  { id: 'hobby', label: 'Hobby / Build' },
  { id: 'friends', label: 'Friends' },
  { id: 'solo-quiet', label: 'Solo Quiet' },
] as const;
export type PersonalTimeChipId = (typeof PERSONAL_TIME_CHIPS)[number]['id'];

export interface WeeklyPersonalTime {
  self: PersonalTimeChipId[];
  partner: PersonalTimeChipId[];
}
