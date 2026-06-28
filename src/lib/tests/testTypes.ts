export type TestLevel =
  | "basic"
  | "practice"
  | "moderate"
  | "expert"
  | "model"
  | "final_challenge"
  | "pyq";

export type TestAccess =
  | "free"
  | "practice_pass"
  | "exam_pass"
  | "selection_pass";

export type QuestionLanguage = "hi" | "en" | "bilingual";

export type TestQuestion = {
  id: string;
  subject: string;
  chapter: string;
  level: string;
  language: QuestionLanguage;
  question: string;
  options: string[];
  answerIndex: number;
  answer: string;
  explanation: string;
  sourceCheck: string;
  tags: string[];
  reviewed: boolean;
  createdBy: string;
};

export type TestPaper = {
  file: string;
  paperId: string;
  title: string;
  subject: string;
  level: string;
  access: TestAccess;
  durationMinutes: number;
  questionCount: number;
  intro: string;
  questions: TestQuestion[];
};

export type TestPaperPack = {
  prepared: string;
  papers: TestPaper[];
};

export type ShuffledQuestion = TestQuestion & {
  shuffledOptions: string[];
  correctIndex: number;
  originalIndex: number;
};

export type TestAttemptAnswers = Record<string, number>;

export type TestAttemptResult = {
  paperId: string;
  subject: string;
  subjectSlug: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
  attemptedAt: string;
  answers: TestAttemptAnswers;
};

export type MockUserPlan = "free" | "practice_pass" | "exam_pass" | "selection_pass";
