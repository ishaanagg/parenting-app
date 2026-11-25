export type StageId = '0-6w' | '6-12w' | '3-6m' | '6-9m' | '9-12m';

export type BookFramework = 'hgp' | 'le-cadre' | 'perry';

export type MomentTag =
  | '3am'
  | 'fussy'
  | 'sleep'
  | 'feeding'
  | 'triggers'
  | 'repair';

export type ParentMood = 'steady' | 'tired' | 'touched-out' | 'triggered';

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

export interface PracticeRep {
  id: string;
  stages: StageId[];
  framework: BookFramework;
  title: string;
  prompt: string;
  whyItWorks: string;
}

export interface WisdomCard {
  id: string;
  stages: StageId[];
  framework: BookFramework;
  moments: MomentTag[];
  title: string;
  insight: string;
  tryNow: string;
}

export interface SosCryCue {
  id: string;
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

export const FRAMEWORK_LABELS: Record<BookFramework, string> = {
  hgp: 'Hunter, Gather, Parent',
  'le-cadre': 'Bringing Up Bébé',
  perry: 'The Book You Wish...',
};
