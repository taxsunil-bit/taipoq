import type { GATestData, GATestQuestion } from "@/types/generalAwarenessTest";
import type { MockTestPaper, ValidationIssue } from "@/types/mockTest";
import { hasValidationErrors, validateMockTestPaper } from "@/lib/mockTestValidation";

export const GA_GS_SUBJECT_LABELS: Record<string, string> = {
  "general-awareness": "General Awareness",
  "general-science": "General Science",
};

function optionId(questionId: string, index: number): string {
  return `${questionId}-o${index}`;
}

function mapDifficulty(
  difficulty: GATestQuestion["difficulty"],
): "easy" | "medium" | "hard" {
  switch (difficulty) {
    case "Easy":
      return "easy";
    case "Hard":
      return "hard";
    default:
      return "medium";
  }
}

function adaptGaGsQuestion(
  question: GATestQuestion,
  marksPerQuestion: number,
  negativeMarks: number,
  subjectLabel: string,
): MockTestPaper["questions"][number] {
  const options = question.options.map((text, index) => ({
    id: optionId(question.id, index),
    text,
  }));
  const correctOptionId = optionId(question.id, question.correctOptionIndex);
  if (!options.some((option) => option.id === correctOptionId)) {
    throw new Error(`adaptGaGsQuestion: missing correct option for ${question.id}`);
  }

  return {
    id: question.id,
    question: question.question,
    options,
    correctOptionId,
    explanation: question.explanation,
    subject: subjectLabel,
    topic: question.topic,
    difficulty: mapDifficulty(question.difficulty),
    marks: marksPerQuestion,
    negativeMarks,
  };
}

/** Legacy GA/GS scorer ignores negativeMarking flag; adapter uses 0 to preserve parity. */
export function getGaGsAdapterNegativeMarks(data: GATestData): number {
  return 0;
}

export function adaptGaGsJsonPaper(data: GATestData, subjectSlug: string): MockTestPaper {
  const subjectLabel = GA_GS_SUBJECT_LABELS[subjectSlug] ?? subjectSlug;
  const negativeMarks = getGaGsAdapterNegativeMarks(data);

  return {
    id: data.id,
    subject: subjectLabel,
    title: data.titleHi,
    description: data.descriptionHi,
    durationMinutes: data.durationMinutes,
    defaultMarksPerQuestion: data.marksPerQuestion,
    defaultNegativeMarks: negativeMarks,
    questions: data.questions.map((question) =>
      adaptGaGsQuestion(question, data.marksPerQuestion, negativeMarks, subjectLabel),
    ),
  };
}

export function validateGaGsJsonPaper(data: GATestData, subjectSlug: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!data.id?.trim()) {
    issues.push({ severity: "error", path: "id", message: "Paper id is required" });
  }
  if (!data.titleHi?.trim()) {
    issues.push({ severity: "error", path: "titleHi", message: "titleHi is required" });
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    issues.push({ severity: "error", path: "questions", message: "questions must be a non-empty array" });
    return issues;
  }
  if (data.totalQuestions !== data.questions.length) {
    issues.push({
      severity: "error",
      path: "totalQuestions",
      message: `totalQuestions (${data.totalQuestions}) must match questions.length (${data.questions.length})`,
    });
  }
  if (!Number.isFinite(data.durationMinutes) || data.durationMinutes <= 0) {
    issues.push({ severity: "error", path: "durationMinutes", message: "durationMinutes must be positive" });
  }
  if (!Number.isFinite(data.marksPerQuestion) || data.marksPerQuestion <= 0) {
    issues.push({ severity: "error", path: "marksPerQuestion", message: "marksPerQuestion must be positive" });
  }
  if (typeof data.negativeMarking !== "boolean") {
    issues.push({ severity: "error", path: "negativeMarking", message: "negativeMarking must be boolean" });
  }
  if (data.totalMarks !== data.questions.length * data.marksPerQuestion) {
    issues.push({
      severity: "error",
      path: "totalMarks",
      message: `totalMarks (${data.totalMarks}) must equal questions × marksPerQuestion (${data.questions.length * data.marksPerQuestion})`,
    });
  }

  const ids = new Set<string>();
  for (const question of data.questions) {
    if (!question.id?.trim()) {
      issues.push({ severity: "error", path: "questions[].id", message: "question id is required" });
      continue;
    }
    if (ids.has(question.id)) {
      issues.push({ severity: "error", path: question.id, message: `duplicate question id ${question.id}` });
    }
    ids.add(question.id);

    if (!question.question?.trim()) {
      issues.push({ severity: "error", path: `${question.id}.question`, message: "question text is required" });
    }
    if (!Array.isArray(question.options) || question.options.length < 2) {
      issues.push({ severity: "error", path: `${question.id}.options`, message: "at least two options required" });
    } else if (question.options.some((option) => !String(option).trim())) {
      issues.push({ severity: "error", path: `${question.id}.options`, message: "option text must be non-empty" });
    }
    if (
      !Number.isInteger(question.correctOptionIndex) ||
      question.correctOptionIndex < 0 ||
      question.correctOptionIndex >= question.options.length
    ) {
      issues.push({
        severity: "error",
        path: `${question.id}.correctOptionIndex`,
        message: "correctOptionIndex out of range",
      });
    }
    if (!question.topic?.trim()) {
      issues.push({ severity: "error", path: `${question.id}.topic`, message: "topic is required" });
    }
    if (typeof question.explanation !== "string") {
      issues.push({ severity: "error", path: `${question.id}.explanation`, message: "explanation must be a string" });
    }
  }

  issues.push(...validateMockTestPaper(adaptGaGsJsonPaper(data, subjectSlug)));
  return issues;
}

export function isGaGsJsonPaperValid(data: GATestData, subjectSlug: string): boolean {
  return !hasValidationErrors(validateGaGsJsonPaper(data, subjectSlug));
}

export function gaGsAnswersToSelections(
  data: GATestData,
  answers: Record<string, number>,
): Record<string, string | undefined> {
  const selections: Record<string, string | undefined> = {};
  for (const question of data.questions) {
    const selectedIndex = answers[question.id];
    selections[question.id] =
      selectedIndex === undefined ? undefined : `${question.id}-o${selectedIndex}`;
  }
  return selections;
}
