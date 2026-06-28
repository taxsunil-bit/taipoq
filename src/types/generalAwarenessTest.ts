export type GATestQuestion = {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
};

export type GATestData = {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  totalQuestions: number;
  totalMarks: number;
  marksPerQuestion: number;
  durationMinutes: number;
  negativeMarking: boolean;
  level: string;
  sourceType: string;
  questions: GATestQuestion[];
};

export type GAProgressState = {
  startedAt: string;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  remainingSeconds: number;
  submitted: boolean;
};

export type GAScoreResult = {
  correct: number;
  wrong: number;
  notAttempted: number;
  score: number;
  percentage: number;
  byTopic: Record<string, { correct: number; total: number }>;
};

export function getTestProgressStorageKey(subjectSlug: string, paperSlug: string): string {
  return `taipoq_${subjectSlug}_${paperSlug}_progress`;
}

/** @deprecated legacy key — use getTestProgressStorageKey */
export const GA_MODEL_TEST_LEGACY_STORAGE_KEY = "taipoq_ga_model_test_01_progress";

export const GA_MODEL_TEST_STORAGE_KEY = getTestProgressStorageKey(
  "general-awareness",
  "model-test-01",
);

export const GS_MODEL_TEST_STORAGE_KEY = getTestProgressStorageKey(
  "general-science",
  "model-test-01",
);

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function getResultLabel(percentage: number): string {
  if (percentage >= 90) return "उत्कृष्ट";
  if (percentage >= 75) return "अच्छा";
  if (percentage >= 50) return "सुधार आवश्यक";
  return "फिर से अभ्यास करें";
}

export function calculateGAScore(data: GATestData, answers: Record<string, number>): GAScoreResult {
  let correct = 0;
  let wrong = 0;
  let notAttempted = 0;
  const byTopic: Record<string, { correct: number; total: number }> = {};

  for (const q of data.questions) {
    if (!byTopic[q.topic]) byTopic[q.topic] = { correct: 0, total: 0 };
    byTopic[q.topic].total += 1;

    const selected = answers[q.id];
    if (selected === undefined) {
      notAttempted += 1;
    } else if (selected === q.correctOptionIndex) {
      correct += 1;
      byTopic[q.topic].correct += 1;
    } else {
      wrong += 1;
    }
  }

  const score = correct * data.marksPerQuestion;
  const percentage = data.totalMarks > 0 ? Math.round((score / data.totalMarks) * 100) : 0;

  return { correct, wrong, notAttempted, score, percentage, byTopic };
}

export function countAttemptedAnswers(answers: Record<string, number> | undefined): number {
  if (!answers || typeof answers !== "object") return 0;
  return Object.keys(answers).length;
}

function isProgressShape(raw: unknown): raw is GAProgressState {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as GAProgressState;
  return (
    typeof s.startedAt === "string" &&
    typeof s.currentQuestionIndex === "number" &&
    typeof s.remainingSeconds === "number" &&
    typeof s.submitted === "boolean" &&
    s.answers !== null &&
    typeof s.answers === "object"
  );
}

/** Reject stale or invalid saved progress; clears corrupt keys when storageKey is provided. */
export function sanitizeGAProgressState(
  raw: unknown,
  storageKey?: string,
): GAProgressState | null {
  if (!isProgressShape(raw)) {
    if (storageKey) clearGAProgress(storageKey);
    return null;
  }

  const attempted = countAttemptedAnswers(raw.answers);

  if (raw.submitted && attempted === 0) {
    if (storageKey) clearGAProgress(storageKey);
    return null;
  }

  if (raw.submitted || raw.startedAt) {
    return raw;
  }

  if (storageKey) clearGAProgress(storageKey);
  return null;
}

function readProgress(storageKey: string): GAProgressState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as GAProgressState;
  } catch {
    return null;
  }
}

/** Migrate progress saved under the old GA-only key into the subject-scoped key. */
function migrateLegacyGAProgress(storageKey: string): GAProgressState | null {
  if (storageKey !== GA_MODEL_TEST_STORAGE_KEY) return null;
  const legacyRaw = readProgress(GA_MODEL_TEST_LEGACY_STORAGE_KEY);
  if (!legacyRaw) return null;

  if (typeof window !== "undefined") {
    localStorage.removeItem(GA_MODEL_TEST_LEGACY_STORAGE_KEY);
  }

  const sanitized = sanitizeGAProgressState(legacyRaw);
  if (!sanitized) return null;

  saveGAProgress(storageKey, sanitized);
  return sanitized;
}

export function loadGAProgress(storageKey: string): GAProgressState | null {
  const saved = sanitizeGAProgressState(readProgress(storageKey), storageKey);
  if (saved) return saved;
  return migrateLegacyGAProgress(storageKey);
}

export function saveGAProgress(storageKey: string, state: GAProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export function clearGAProgress(storageKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey);
}
