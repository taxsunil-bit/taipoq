import type { MockTestAnalysis, MockTestPaper, MockTestScoreResult } from "@/types/mockTest";

function addBreakdown(
  map: Record<string, { correct: number; total: number }>,
  key: string | undefined,
  isCorrect: boolean,
) {
  if (!key) return;
  if (!map[key]) map[key] = { correct: 0, total: 0 };
  map[key].total += 1;
  if (isCorrect) map[key].correct += 1;
}

export function analyzeMockTestResult(
  paper: MockTestPaper,
  result: MockTestScoreResult,
): MockTestAnalysis {
  const subjectBreakdown: Record<string, { correct: number; total: number }> = {};
  const topicBreakdown: Record<string, { correct: number; total: number }> = {};
  const difficultyBreakdown: Record<string, { correct: number; total: number }> = {};

  for (const question of paper.questions) {
    const row = result.questionResults.find((entry) => entry.questionId === question.id);
    const isCorrect = row?.status === "correct";
    addBreakdown(subjectBreakdown, question.subject, isCorrect);
    addBreakdown(topicBreakdown, question.topic, isCorrect);
    addBreakdown(difficultyBreakdown, question.difficulty, isCorrect);
  }

  const weakAreas = Object.entries(topicBreakdown)
    .filter(([, stats]) => stats.total >= 1 && stats.correct / stats.total < 0.5)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .map(([topic]) => topic)
    .slice(0, 5);

  const accuracy =
    result.attempted === 0 ? 0 : Math.round((result.correct / result.attempted) * 100);
  const attemptRate =
    result.totalQuestions === 0
      ? 0
      : Math.round((result.attempted / result.totalQuestions) * 100);

  return {
    accuracy,
    attemptRate,
    correct: result.correct,
    incorrect: result.incorrect,
    unanswered: result.unanswered,
    positiveMarks: result.positiveMarks,
    negativeMarks: result.negativeMarks,
    score: result.score,
    maximumMarks: result.maximumMarks,
    percentage: result.percentage,
    subjectBreakdown,
    topicBreakdown,
    difficultyBreakdown,
    weakAreas,
    recommendation: buildRecommendation(result),
  };
}

function buildRecommendation(result: MockTestScoreResult): string {
  if (result.unanswered >= Math.max(2, Math.ceil(result.totalQuestions * 0.25))) {
    return "You left several questions unanswered. Practise completing the paper within the available time.";
  }

  if (result.attempted >= Math.max(3, Math.ceil(result.totalQuestions * 0.5)) && result.correct / Math.max(result.attempted, 1) < 0.5) {
    return "Attempt selection needs improvement. Review incorrect answers before increasing the number of attempts.";
  }

  if (result.negativeMarks > 0 && result.negativeMarks >= result.positiveMarks * 0.25) {
    return "Incorrect attempts caused a notable marks deduction. Avoid guessing when the answer is uncertain.";
  }

  if (result.percentage >= 80 && result.incorrect <= 1 && result.unanswered === 0) {
    return "Your result is stable. Proceed to the next paper or a higher-difficulty challenge.";
  }

  if (result.correct === result.totalQuestions && result.unanswered === 0) {
    return "Your result is stable. Proceed to the next paper or a higher-difficulty challenge.";
  }

  return "Review the incorrect answers below, then retry this paper before moving to a longer mock test.";
}
