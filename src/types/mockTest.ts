export type MockQuestionOption = {
  id: string;
  text: string;
};

export type MockQuestionDifficulty = "easy" | "medium" | "hard";

export type MockQuestion = {
  id: string;
  question: string;
  options: MockQuestionOption[];
  correctOptionId: string;
  explanation?: string;
  subject?: string;
  topic?: string;
  difficulty?: MockQuestionDifficulty;
  marks?: number;
  negativeMarks?: number;
};

export type MockTestPaper = {
  id: string;
  subject: string;
  title: string;
  description?: string;
  durationMinutes: number;
  passMarks?: number;
  passPercentage?: number;
  defaultMarksPerQuestion?: number;
  defaultNegativeMarks?: number;
  questions: MockQuestion[];
};

export type SelectedAnswerMap = Record<string, string | undefined>;

export type MockQuestionResultStatus = "correct" | "incorrect" | "unanswered";

export type MockQuestionResult = {
  questionId: string;
  status: MockQuestionResultStatus;
  selectedOptionId?: string;
  correctOptionId: string;
  marksAwarded: number;
  positiveMarks: number;
  negativeMarks: number;
};

export type MockTestScoreResult = {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  positiveMarks: number;
  negativeMarks: number;
  score: number;
  maximumMarks: number;
  percentage: number;
  passed?: boolean;
  questionResults: MockQuestionResult[];
};

export type ValidationIssue = {
  severity: "error" | "warning";
  path: string;
  message: string;
};

export type MockTestAnalysis = {
  accuracy: number;
  attemptRate: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  positiveMarks: number;
  negativeMarks: number;
  score: number;
  maximumMarks: number;
  percentage: number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
  topicBreakdown: Record<string, { correct: number; total: number }>;
  difficultyBreakdown: Record<string, { correct: number; total: number }>;
  weakAreas: string[];
  recommendation: string;
};

/** Phase 3 pilot paper — included in shared foundation registry. */
export const MOCK_TEST_PILOT_PAPER_ID = "model-paper-01";
export const MOCK_TEST_PILOT_SUBJECT_SLUG = "model-papers";

export { isSharedMockFoundationPaper } from "@/lib/mockTestFoundationRegistry";

/** @deprecated Use isSharedMockFoundationPaper — pilot is part of the full hub registry. */
export function isMockTestPilotPaper(subjectSlug: string, paperId: string): boolean {
  return subjectSlug === MOCK_TEST_PILOT_SUBJECT_SLUG && paperId === MOCK_TEST_PILOT_PAPER_ID;
}
