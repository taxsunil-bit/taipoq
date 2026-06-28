import type { ShuffledQuestion, TestAttemptAnswers } from "@/lib/tests/testTypes";
import { cn } from "@/lib/utils";

type QuestionPanelProps = {
  questions: ShuffledQuestion[];
  answers: TestAttemptAnswers;
  onSelect: (questionId: string, optionIndex: number) => void;
  disabled?: boolean;
  showReview?: boolean;
};

export function QuestionPanel({
  questions,
  answers,
  onSelect,
  disabled = false,
  showReview = false,
}: QuestionPanelProps) {
  return (
    <ol className="space-y-4">
      {questions.map((q, idx) => {
        const selected = answers[q.id];
        const isCorrect = selected === q.correctIndex;

        return (
          <li
            key={q.id}
            className="rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            <div className="mb-3 flex flex-wrap items-start gap-2">
              <span className="font-mono text-xs text-muted-foreground">Q{idx + 1}</span>
              {showReview ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    isCorrect ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300",
                  )}
                >
                  {isCorrect ? "सही" : "गलत"}
                </span>
              ) : null}
            </div>
            <p className="text-base font-medium leading-relaxed text-foreground">{q.question}</p>
            <ul className="mt-3 space-y-2">
              {q.shuffledOptions.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const isAnswer = showReview && optionIndex === q.correctIndex;

                return (
                  <li key={`${q.id}-${optionIndex}`}>
                    <button
                      type="button"
                      disabled={disabled || showReview}
                      onClick={() => onSelect(q.id, optionIndex)}
                      className={cn(
                        "flex min-h-11 w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                        isSelected && !showReview && "border-blue-500 bg-blue-600/20 text-white",
                        !isSelected && !showReview && "border-border bg-surface/50 hover:bg-surface-hover",
                        showReview && isAnswer && "border-emerald-500/60 bg-emerald-500/10",
                        showReview && isSelected && !isAnswer && "border-red-500/60 bg-red-500/10",
                        showReview && !isSelected && !isAnswer && "border-border bg-surface/30 opacity-80",
                      )}
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {showReview ? (
              <div className="mt-3 rounded-xl border border-blue-500/30 bg-blue-950/30 p-3 text-sm leading-relaxed text-blue-100">
                <p className="font-semibold text-blue-50">स्पष्टीकरण</p>
                <p className="mt-1">{q.explanation}</p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
