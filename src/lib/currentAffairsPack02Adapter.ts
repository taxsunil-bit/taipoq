import type { CurrentAffairsToughPack02, ToughPack02Question } from "@/content/tests/currentAffairsToughPack02";
import type { MockTestPaper } from "@/types/mockTest";
import { validateMockTestPaper, hasValidationErrors } from "@/lib/mockTestValidation";
import type { ValidationIssue } from "@/types/mockTest";

export const PACK02_CANONICAL_PAPER_ID = "current-affairs-tough-pack-02";

function optionId(questionId: string, index: number): string {
  return `${questionId}-o${index}`;
}

function adaptPack02Question(
  question: ToughPack02Question,
  marksPerQuestion: number,
  negativeMarks: number,
): MockTestPaper["questions"][number] {
  const options = question.options.map((text, index) => ({
    id: optionId(question.id, index),
    text,
  }));
  const correctOptionId = optionId(question.id, question.answerIndex);
  if (!options.some((option) => option.id === correctOptionId)) {
    throw new Error(`adaptPack02Question: missing correct option for ${question.id}`);
  }

  return {
    id: question.id,
    question: question.question,
    options,
    correctOptionId,
    explanation: question.explanation,
    subject: "Current Affairs",
    topic: question.topic,
    difficulty: "hard",
    marks: marksPerQuestion,
    negativeMarks,
  };
}

export function adaptPack02ToMockPaper(pack: CurrentAffairsToughPack02): MockTestPaper {
  if (pack.questions.length !== pack.totalQuestions) {
    throw new Error(`adaptPack02ToMockPaper: question count mismatch for ${pack.paperId}`);
  }

  return {
    id: pack.paperId,
    subject: pack.subject,
    title: pack.title,
    description: pack.disclaimer,
    durationMinutes: pack.durationMinutes,
    defaultMarksPerQuestion: pack.marksPerQuestion,
    defaultNegativeMarks: pack.negativeMarks,
    questions: pack.questions.map((question) =>
      adaptPack02Question(question, pack.marksPerQuestion, pack.negativeMarks),
    ),
  };
}

export function validateAdaptedPack02(pack: CurrentAffairsToughPack02): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (pack.paperId !== PACK02_CANONICAL_PAPER_ID) {
    issues.push({
      severity: "error",
      path: "paperId",
      message: `Expected ${PACK02_CANONICAL_PAPER_ID}, got ${pack.paperId}`,
    });
  }

  if (pack.totalQuestions !== 30) {
    issues.push({
      severity: "error",
      path: "totalQuestions",
      message: `Expected 30 questions, got ${pack.totalQuestions}`,
    });
  }

  issues.push(...validateMockTestPaper(adaptPack02ToMockPaper(pack)));
  return issues;
}

export function isAdaptedPack02Valid(pack: CurrentAffairsToughPack02): boolean {
  return !hasValidationErrors(validateAdaptedPack02(pack));
}

export function pack02AnswersToSelections(
  pack: CurrentAffairsToughPack02,
  answers: Record<string, number>,
): Record<string, string | undefined> {
  const selections: Record<string, string | undefined> = {};
  for (const question of pack.questions) {
    const selectedIndex = answers[question.id];
    selections[question.id] =
      selectedIndex === undefined ? undefined : optionId(question.id, selectedIndex);
  }
  return selections;
}
