import { useState } from "react";
import type { CurrentAffairsPaper } from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";
import { CurrentAffairsQuestionCard } from "./CurrentAffairsQuestionCard";

type Props = {
  paper: CurrentAffairsPaper;
};

export function CurrentAffairsPracticeView({ paper }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const total = paper.questions.length;
  const question = paper.questions[index];
  const selectedIndex = answers[question.id] ?? null;
  const revealAnswer = selectedIndex !== null;

  const handleSelect = (optionIndex: number) => {
    if (answers[question.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      return;
    }
    setFinished(true);
  };

  if (finished) {
    const finalCorrect = paper.questions.filter((q) => answers[q.id] === q.answerIndex).length;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center font-hindi">
        <h2 className="text-xl font-bold text-emerald-900">अभ्यास पूर्ण!</h2>
        <p className="mt-3 text-base text-emerald-800">
          आपका स्कोर:{" "}
          <span className="font-bold">
            {finalCorrect} / {total}
          </span>
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          Practice Mode में हर प्रश्न के बाद सही उत्तर और व्याख्या दिखाई जाती है।
        </p>
      </div>
    );
  }

  const canGoNext = selectedIndex !== null;

  return (
    <div className="space-y-4 font-hindi">
      <CurrentAffairsQuestionCard
        question={question}
        questionIndex={index}
        totalQuestions={total}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        revealAnswer={revealAnswer}
      />
      <button
        type="button"
        disabled={!canGoNext}
        onClick={handleNext}
        className={cn(
          "min-h-11 w-full rounded-xl px-5 py-3 text-base font-semibold text-white transition-colors",
          canGoNext ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-slate-300",
        )}
      >
        {index < total - 1 ? "Next Question" : "अभ्यास समाप्त करें"}
      </button>
    </div>
  );
}
