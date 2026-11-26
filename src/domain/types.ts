export const STAGE_IDS = ['0-6w', '6-12w', '3-6m', '6-9m', '9-12m'] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type BookFramework = 'hgp' | 'le-cadre' | 'perry';

export type MomentTag =
  | '3am'
  | 'fussy'
  | 'sleep'
  | 'feeding'
  | 'boundaries'
  | 'triggers'
  | 'repair';

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

export interface FrameworkGuide {
  id: BookFramework;
  shortLabel: string;
  bookTitle: string;
  author: string;
  coreIdea: string;
  pillars: string[];
}

export interface PracticeRep {
  id: string;
  stages: StageId[];
  framework: BookFramework;
  title: string;
  prompt: string;
  whyItWorks: string;
  safetyNote?: string;
}

export interface WisdomCard {
  id: string;
  stages: StageId[];
  framework: BookFramework;
  moments: MomentTag[];
  title: string;
  insight: string;
  tryNow: string;
  action?: 'la-pause' | 'breathe';
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
