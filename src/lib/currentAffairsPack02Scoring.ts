import { analyzeMockTestResult } from "@/lib/mockTestAnalysis";
import {
  adaptPack02ToMockPaper,
  pack02AnswersToSelections,
} from "@/lib/currentAffairsPack02Adapter";
import { scoreMockTest } from "@/lib/mockTestScoring";
import type { CurrentAffairsToughPack02 } from "@/content/tests/currentAffairsToughPack02";
import type { MockTestAnalysis, MockTestScoreResult } from "@/types/mockTest";

export type Pack02ScoringContract = {
  marksPerCorrect: number;
  marksPerIncorrect: number;
  marksPerUnanswered: number;
  scoreFloor: number;
  maximumMarks: number;
  durationSeconds: number;
  negativeMarkingApplied: boolean;
};

export type Pack02LegacyScoreDisplay = {
  correct: number;
  wrong: number;
  total: number;
  marks: number;
  percentage: number;
};

export function getPack02ScoringContract(pack: CurrentAffairsToughPack02): Pack02ScoringContract {
  return {
    marksPerCorrect: pack.marksPerQuestion,
    marksPerIncorrect: pack.negativeMarks,
    marksPerUnanswered: 0,
    scoreFloor: 0,
    maximumMarks: pack.totalQuestions * pack.marksPerQuestion,
    durationSeconds: pack.durationMinutes * 60,
    negativeMarkingApplied: pack.negativeMarks > 0,
  };
}

export function scorePack02MockTest(
  pack: CurrentAffairsToughPack02,
  answers: Record<string, number>,
): MockTestScoreResult {
  const paper = adaptPack02ToMockPaper(pack);
  const selections = pack02AnswersToSelections(pack, answers);
  return scoreMockTest(paper, selections, { floorScoreAtZero: true });
}

export function analyzePack02MockResult(
  pack: CurrentAffairsToughPack02,
  result: MockTestScoreResult,
): MockTestAnalysis {
  return analyzeMockTestResult(adaptPack02ToMockPaper(pack), result);
}

/** Legacy inline scorer preserved for regression comparison. */
export function scorePack02LegacyInline(
  pack: CurrentAffairsToughPack02,
  answers: Record<string, number>,
): Pack02LegacyScoreDisplay {
  let correct = 0;
  for (const question of pack.questions) {
    if (answers[question.id] === question.answerIndex) {
      correct += 1;
    }
  }
  const total = pack.totalQuestions;
  return {
    correct,
    wrong: total - correct,
    total,
    marks: correct * pack.marksPerQuestion,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export function clampRemainingSeconds(seconds: number): number {
  return Math.max(0, seconds);
}

export function shouldAutoSubmitAtSeconds(secondsLeft: number): boolean {
  return secondsLeft <= 1;
}

export function nextRemainingSeconds(current: number): number {
  if (current <= 1) return 0;
  return current - 1;
}

export function createPack02SubmissionGuard() {
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

export function formatPack02NegativeMarkingLabel(negativeMarks: number): string {
  return negativeMarks === 0 ? "None (0)" : String(negativeMarks);
}
