import type { ShuffledQuestion, TestAttemptAnswers } from "./testTypes";

export type ScoreSummary = {
  score: number;
  total: number;
  percentage: number;
  correctIds: string[];
  wrongIds: string[];
};

export function scoreTestAttempt(
  questions: ShuffledQuestion[],
  answers: TestAttemptAnswers,
): ScoreSummary {
  let score = 0;
  const correctIds: string[] = [];
  const wrongIds: string[] = [];

  for (const q of questions) {
    const selected = answers[q.id];
    if (selected === q.correctIndex) {
      score += 1;
      correctIds.push(q.id);
    } else {
      wrongIds.push(q.id);
    }
  }

  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  return { score, total, percentage, correctIds, wrongIds };
}
