import type { MslDirectQuestion, MslProgressState } from "./types";

export type DirectSetScore = {
  total: number;
  firstPassCorrect: number;
  accuracyPercent: number;
  completedQuestionIds: string[];
};

/**
 * Accuracy is based on first valid submission per question (after normalisation).
 * Retries do not increase the first-pass correct count.
 */
export function scoreDirectSet(
  questions: MslDirectQuestion[],
  firstPassResults: Record<string, boolean>,
): DirectSetScore {
  const total = questions.length;
  let firstPassCorrect = 0;
  const completedQuestionIds: string[] = [];

  for (const q of questions) {
    completedQuestionIds.push(q.questionId);
    if (firstPassResults[q.questionId] === true) {
      firstPassCorrect += 1;
    }
  }

  const accuracyPercent = total === 0 ? 0 : Math.round((firstPassCorrect / total) * 100);

  return { total, firstPassCorrect, accuracyPercent, completedQuestionIds };
}

/**
 * Canary mastery rules (direct set only):
 * - mastered: accuracy >= 90%
 * - review_required: was mastered and later accuracy < 70%
 * - proficient: set complete but below 90%
 */
export function deriveStateAfterDirectSet(args: {
  previousState: MslProgressState;
  previouslyMastered: boolean;
  accuracyPercent: number;
  masteryThreshold?: number;
  reviewBelowThreshold?: number;
}): MslProgressState {
  const masteryThreshold = args.masteryThreshold ?? 90;
  const reviewBelow = args.reviewBelowThreshold ?? 70;

  if (args.previouslyMastered && args.accuracyPercent < reviewBelow) {
    return "review_required";
  }
  if (args.accuracyPercent >= masteryThreshold) {
    return "mastered";
  }
  if (args.previousState === "review_required" && args.accuracyPercent >= masteryThreshold) {
    return "mastered";
  }
  return "proficient";
}

/** @deprecated Prefer deriveStateAfterDirectSet */
export const deriveT01StateAfterDirectSet = deriveStateAfterDirectSet;
