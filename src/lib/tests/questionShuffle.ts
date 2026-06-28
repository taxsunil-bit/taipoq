import type { ShuffledQuestion, TestQuestion } from "./testTypes";

function shuffleArray<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Fisher–Yates shuffle with optional seed for reproducibility in tests. */
export function shuffleQuestions(
  questions: TestQuestion[],
  random: () => number = Math.random,
): ShuffledQuestion[] {
  const indexed = questions.map((q, originalIndex) => ({ q, originalIndex }));
  const shuffled = shuffleArray(indexed, random);

  return shuffled.map(({ q, originalIndex }) => {
    const optionPairs = q.options.map((text, index) => ({ text, index }));
    const shuffledPairs = shuffleArray(optionPairs, random);
    const correctIndex = shuffledPairs.findIndex((pair) => pair.index === q.answerIndex);

    return {
      ...q,
      shuffledOptions: shuffledPairs.map((pair) => pair.text),
      correctIndex,
      originalIndex,
    };
  });
}
