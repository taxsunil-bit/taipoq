import { analyzeMockTestResult } from "@/lib/mockTestAnalysis";
import {
  adaptGaGsJsonPaper,
  gaGsAnswersToSelections,
} from "@/lib/gaGsMockTestAdapter";
import { scoreMockTest } from "@/lib/mockTestScoring";
import {
  calculateGAScore,
  type GAScoreResult,
  type GATestData,
} from "@/types/generalAwarenessTest";
import type { MockTestAnalysis, MockTestScoreResult } from "@/types/mockTest";

export type GaGsScoringContract = {
  marksPerCorrect: number;
  marksPerIncorrect: number;
  marksPerUnanswered: number;
  scoreFloor: number;
  maximumMarks: number;
  durationSeconds: number;
  negativeMarkingApplied: boolean;
  negativeMarkingConfigured: boolean;
};

export function getGaGsScoringContract(data: GATestData): GaGsScoringContract {
  return {
    marksPerCorrect: data.marksPerQuestion,
    marksPerIncorrect: 0,
    marksPerUnanswered: 0,
    scoreFloor: 0,
    maximumMarks: data.totalMarks,
    durationSeconds: data.durationMinutes * 60,
    negativeMarkingApplied: false,
    negativeMarkingConfigured: data.negativeMarking,
  };
}

export function scoreGaGsMockTest(
  data: GATestData,
  answers: Record<string, number>,
  subjectSlug: string,
): MockTestScoreResult {
  const paper = adaptGaGsJsonPaper(data, subjectSlug);
  const selections = gaGsAnswersToSelections(data, answers);
  return scoreMockTest(paper, selections, { floorScoreAtZero: true });
}

export function analyzeGaGsMockResult(
  data: GATestData,
  result: MockTestScoreResult,
  subjectSlug: string,
): MockTestAnalysis {
  return analyzeMockTestResult(adaptGaGsJsonPaper(data, subjectSlug), result);
}

export function mapSharedScoreToGAScoreResult(
  data: GATestData,
  shared: MockTestScoreResult,
): GAScoreResult {
  const byTopic: Record<string, { correct: number; total: number }> = {};

  for (const question of data.questions) {
    if (!byTopic[question.topic]) {
      byTopic[question.topic] = { correct: 0, total: 0 };
    }
    byTopic[question.topic].total += 1;
  }

  for (const row of shared.questionResults) {
    if (row.status !== "correct") continue;
    const question = data.questions.find((entry) => entry.id === row.questionId);
    if (question) {
      byTopic[question.topic].correct += 1;
    }
  }

  const percentage =
    data.totalMarks > 0 ? Math.round((shared.score / data.totalMarks) * 100) : 0;

  return {
    correct: shared.correct,
    wrong: shared.incorrect,
    notAttempted: shared.unanswered,
    score: shared.score,
    percentage,
    byTopic,
  };
}

/** Legacy scorer preserved for non-pilot papers and regression comparison. */
export function scoreGaGsLegacyInline(
  data: GATestData,
  answers: Record<string, number>,
): GAScoreResult {
  return calculateGAScore(data, answers);
}

export function createGaGsSubmissionGuard() {
  let submitted = false;

  return {
    trySubmit(run: () => void): boolean {
      if (submitted) return false;
      submitted = true;
      run();
      return true;
    },
    reset() {
      submitted = false;
    },
    isSubmitted() {
      return submitted;
    },
  };
}

export function shouldGaGsAutoSubmitAtSeconds(secondsLeft: number): boolean {
  return secondsLeft <= 0;
}

export function nextGaGsRemainingSeconds(current: number): number {
  return Math.max(0, current - 1);
}

export function clampGaGsRemainingSeconds(seconds: number): number {
  return Math.max(0, seconds);
}
