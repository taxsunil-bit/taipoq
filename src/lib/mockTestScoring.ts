import type {
  MockQuestion,
  MockQuestionResult,
  MockTestPaper,
  MockTestScoreResult,
  SelectedAnswerMap,
} from "@/types/mockTest";

export type ScoreMockTestOptions = {
  /** When true, final score cannot fall below zero (hub engine behaviour). */
  floorScoreAtZero?: boolean;
};

function getQuestionMarks(question: MockQuestion, paper: MockTestPaper): number {
  return question.marks ?? paper.defaultMarksPerQuestion ?? 1;
}

function getQuestionNegativeMarks(question: MockQuestion, paper: MockTestPaper): number {
  return question.negativeMarks ?? paper.defaultNegativeMarks ?? 0;
}

function evaluatePass(paper: MockTestPaper, score: number, percentage: number): boolean | undefined {
  if (typeof paper.passMarks === "number") {
    return score >= paper.passMarks;
  }
  if (typeof paper.passPercentage === "number") {
    return percentage >= paper.passPercentage;
  }
  return undefined;
}

export function scoreMockTest(
  paper: MockTestPaper,
  selections: SelectedAnswerMap,
  options: ScoreMockTestOptions = {},
): MockTestScoreResult {
  const floorScoreAtZero = options.floorScoreAtZero ?? true;
  const questionIds = new Set(paper.questions.map((question) => question.id));

  let attempted = 0;
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let positiveMarks = 0;
  let negativeMarks = 0;
  let rawScore = 0;
  let maximumMarks = 0;
  const questionResults: MockQuestionResult[] = [];

  for (const question of paper.questions) {
    const positive = getQuestionMarks(question, paper);
    const negative = getQuestionNegativeMarks(question, paper);
    maximumMarks += positive;

    const selectedOptionId = selections[question.id];
    if (selectedOptionId !== undefined && !questionIds.has(question.id)) {
      continue;
    }

    if (selectedOptionId !== undefined && !question.options.some((option) => option.id === selectedOptionId)) {
      // Ignore unknown option keys for this question.
      unanswered += 1;
      questionResults.push({
        questionId: question.id,
        status: "unanswered",
        correctOptionId: question.correctOptionId,
        marksAwarded: 0,
        positiveMarks: positive,
        negativeMarks: 0,
      });
      continue;
    }

    if (!selectedOptionId) {
      unanswered += 1;
      questionResults.push({
        questionId: question.id,
        status: "unanswered",
        correctOptionId: question.correctOptionId,
        marksAwarded: 0,
        positiveMarks: positive,
        negativeMarks: 0,
      });
      continue;
    }

    attempted += 1;

    if (selectedOptionId === question.correctOptionId) {
      correct += 1;
      positiveMarks += positive;
      rawScore += positive;
      questionResults.push({
        questionId: question.id,
        status: "correct",
        selectedOptionId,
        correctOptionId: question.correctOptionId,
        marksAwarded: positive,
        positiveMarks: positive,
        negativeMarks: 0,
      });
      continue;
    }

    incorrect += 1;
    negativeMarks += negative;
    rawScore -= negative;
    questionResults.push({
      questionId: question.id,
      status: "incorrect",
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      marksAwarded: -negative,
      positiveMarks: positive,
      negativeMarks: negative,
    });
  }

  const score = floorScoreAtZero ? Math.max(0, rawScore) : rawScore;
  const totalQuestions = paper.questions.length;
  const percentage =
    maximumMarks === 0 ? 0 : Math.round((score / maximumMarks) * 100);

  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unanswered,
    positiveMarks,
    negativeMarks,
    score,
    maximumMarks,
    percentage,
    passed: evaluatePass(paper, score, percentage),
    questionResults,
  };
}

export function toHubCorrectCount(result: MockTestScoreResult): number {
  return result.correct;
}

export function toHubLegacyScoreFields(result: MockTestScoreResult): {
  score: number;
  total: number;
  percentage: number;
} {
  return {
    score: result.correct,
    total: result.totalQuestions,
    percentage:
      result.totalQuestions === 0
        ? 0
        : Math.round((result.correct / result.totalQuestions) * 100),
  };
}

export function toHubLegacyIdLists(
  result: MockTestScoreResult,
): { correctIds: string[]; wrongIds: string[] } {
  const correctIds = result.questionResults
    .filter((row) => row.status === "correct")
    .map((row) => row.questionId);
  const wrongIds = result.questionResults
    .filter((row) => row.status !== "correct")
    .map((row) => row.questionId);
  return { correctIds, wrongIds };
}
