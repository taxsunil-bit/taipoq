import { useMemo, useState } from "react";
import type { CurrentAffairsPaper } from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";
import { CurrentAffairsQuestionCard } from "./CurrentAffairsQuestionCard";
import { CurrentAffairsResultView } from "./CurrentAffairsResultView";

type Props = {
  paper: CurrentAffairsPaper;
};

export function CurrentAffairsTestView({ paper }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const total = paper.questions.length;
  const question = paper.questions[index];
  const selectedIndex = answers[question.id] ?? null;

  const score = useMemo(() => {
    let correct = 0;
    for (const q of paper.questions) {
      if (answers[q.id] === q.answerIndex) correct += 1;
    }
    return { correct, wrong: total - correct, total };
  }, [answers, paper.questions, total]);

  if (finished) {
    return (
      <CurrentAffairsResultView
        paper={paper}
        answers={answers}
        score={score}
        onRetake={() => {
          setAnswers({});
          setIndex(0);
          setFinished(false);
        }}
      />
    );
  }

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      return;
    }
    setFinished(true);
  };

  const attempted = Object.keys(answers).length;

  return (
    <div className="space-y-4 font-hindi">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <span className="font-medium text-slate-700">Test Mode</span>
        <span className="text-slate-500">
          {attempted}/{total} attempted
        </span>
      </div>

      <CurrentAffairsQuestionCard
        question={question}
        questionIndex={index}
        totalQuestions={total}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        revealAnswer={false}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={index === 0}
          onClick={goPrev}
          className={cn(
            "min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-800",
            index === 0 && "cursor-not-allowed opacity-50",
          )}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          className="min-h-11 flex-1 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700"
        >
          {index < total - 1 ? "Next Question" : "Submit Test"}
        </button>
      </div>
    </div>
  );
}
