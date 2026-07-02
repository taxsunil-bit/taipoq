import type { MockQuestion, MockTestPaper, ValidationIssue } from "@/types/mockTest";

function pushError(issues: ValidationIssue[], path: string, message: string) {
  issues.push({ severity: "error", path, message });
}

function pushWarning(issues: ValidationIssue[], path: string, message: string) {
  issues.push({ severity: "warning", path, message });
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateMockTestPaper(paper: MockTestPaper): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!paper.id?.trim()) pushError(issues, "id", "Paper ID is required.");
  if (!paper.title?.trim()) pushError(issues, "title", "Title is required.");
  if (!paper.subject?.trim()) pushError(issues, "subject", "Subject is required.");
  if (!isFiniteNumber(paper.durationMinutes) || paper.durationMinutes <= 0) {
    pushError(issues, "durationMinutes", "Duration must be a positive number.");
  }

  if (isFiniteNumber(paper.passMarks) && isFiniteNumber(paper.passPercentage)) {
    pushWarning(issues, "passingRule", "Both passMarks and passPercentage are set; passMarks takes precedence.");
  }

  if (!Array.isArray(paper.questions) || paper.questions.length === 0) {
    pushError(issues, "questions", "Paper must contain at least one question.");
    return issues;
  }

  const questionIds = new Set<string>();
  paper.questions.forEach((question, index) => {
    validateQuestion(question, `questions[${index}]`, issues, questionIds);
  });

  return issues;
}

function validateQuestion(
  question: MockQuestion,
  basePath: string,
  issues: ValidationIssue[],
  questionIds: Set<string>,
) {
  if (!question.id?.trim()) {
    pushError(issues, `${basePath}.id`, "Question ID is required.");
  } else if (questionIds.has(question.id)) {
    pushError(issues, `${basePath}.id`, `Duplicate question ID: ${question.id}`);
  } else {
    questionIds.add(question.id);
  }

  if (!question.question?.trim()) {
    pushError(issues, `${basePath}.question`, "Question text is required.");
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    pushError(issues, `${basePath}.options`, "At least two options are required.");
    return;
  }

  const optionIds = new Set<string>();
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    const optionPath = `${basePath}.options[${i}]`;
    if (!option.id?.trim()) pushError(issues, `${optionPath}.id`, "Option ID is required.");
    else if (optionIds.has(option.id)) pushError(issues, `${optionPath}.id`, `Duplicate option ID: ${option.id}`);
    else optionIds.add(option.id);
    if (!option.text?.trim()) pushError(issues, `${optionPath}.text`, "Option text is required.");
  }

  if (!question.correctOptionId?.trim()) {
    pushError(issues, `${basePath}.correctOptionId`, "Correct option ID is required.");
  } else if (!optionIds.has(question.correctOptionId)) {
    pushError(issues, `${basePath}.correctOptionId`, "Correct option ID must match an option.");
  }

  if (question.marks !== undefined && (!isFiniteNumber(question.marks) || question.marks < 0)) {
    pushError(issues, `${basePath}.marks`, "Marks must be a non-negative number.");
  }

  if (
    question.negativeMarks !== undefined &&
    (!isFiniteNumber(question.negativeMarks) || question.negativeMarks < 0)
  ) {
    pushError(issues, `${basePath}.negativeMarks`, "Negative marks must be a non-negative number.");
  }
}

export function hasValidationErrors(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === "error");
}
