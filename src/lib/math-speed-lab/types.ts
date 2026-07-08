/** Math Speed Lab canary types (T01). Extensible for T02/T03 later. */

export const MSL_MODULE_ID = "math-speed-lab" as const;
export const MSL_STORAGE_KEY = "taipoq.mathSpeedLab.v1" as const;
export const MSL_CONTENT_VERSION = "1.0.0-canary-t01" as const;

export type MslTechniqueId = "MSL-T01-SQUARE-ENDING-5";

export type MslProgressState =
  | "not_started"
  | "learning"
  | "practising"
  | "proficient"
  | "mastered"
  | "review_required";

export type MslModuleMeta = {
  moduleId: typeof MSL_MODULE_ID;
  titleEn: string;
  titleHi: string;
  description: string;
  disclaimer: string;
  version: string;
  status: "canary";
};

export type MslGuidedExample = {
  exampleId: string;
  techniqueId: MslTechniqueId;
  prompt: string;
  orderedSteps: string[];
  ordinaryVerification: string;
  edgeCaseFlag: boolean;
};

export type MslInvalidExample = {
  exampleId: string;
  techniqueId: MslTechniqueId;
  prompt: string;
  reason: string;
};

export type MslCommonError = {
  code: string;
  description: string;
};

export type MslTechniqueMeta = {
  techniqueId: MslTechniqueId;
  slug: "square-ending-5";
  order: 1;
  titleEn: string;
  titleHi: string;
  attribution: string;
  recognitionSignal: string;
  whenToUse: string[];
  whenNotToUse: string[];
  ordinaryMethod: string;
  rapidMethodSteps: string[];
  whyItWorks: string;
  mathematicalIdentity: string;
  verificationMethod: string;
  commonErrors: MslCommonError[];
  guidedExamples: MslGuidedExample[];
  invalidExamples: MslInvalidExample[];
  allowedOperands: readonly number[];
  masteryDirectPercent: number;
  reviewRequiredBelowPercent: number;
};

export type MslDirectQuestion = {
  questionId: string;
  techniqueId: MslTechniqueId;
  questionKind: "DIR";
  operand: number;
  prompt: string;
  correctAnswer: number;
  explanation: string;
  rapidMethodSteps: string[];
  ordinaryVerification: string;
};

export type MslAttemptRecord = {
  questionId: string;
  techniqueId: MslTechniqueId;
  typedAnswer: string;
  correct: boolean;
  attemptCount: number;
  firstValidCorrect: boolean;
  timestamp: string;
};

export type MslTechniqueProgress = {
  techniqueId: MslTechniqueId;
  state: MslProgressState;
  directScorePercent: number | null;
  directFirstPassCorrect: number | null;
  directTotal: number | null;
  completedQuestionIds: string[];
  lastAttemptedAt: string | null;
  masteredAt: string | null;
  lessonOpened: boolean;
  practiceStarted: boolean;
  reviewRequired: boolean;
};

export type MslActiveDirectSession = {
  techniqueId: MslTechniqueId;
  questionIndex: number;
  firstPassResults: Record<string, boolean>;
  updatedAt: string;
};

export type MslProgressStoreV1 = {
  version: 1;
  moduleId: typeof MSL_MODULE_ID;
  moduleContentVersion: string;
  techniques: {
    "MSL-T01-SQUARE-ENDING-5"?: MslTechniqueProgress;
  };
  recentAttempts: MslAttemptRecord[];
  /** In-progress direct set (survives reload; cleared on finish/restart). */
  activeDirectSession?: MslActiveDirectSession | null;
};
