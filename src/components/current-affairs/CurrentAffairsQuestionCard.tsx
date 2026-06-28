import type { CurrentAffairsQuestion } from "@/content/currentAffairsPapers";
import { formatTopicLabel } from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

type Props = {
  question: CurrentAffairsQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  revealAnswer: boolean;
  disabled?: boolean;
};

export function CurrentAffairsQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedIndex,
  onSelect,
  revealAnswer,
  disabled = false,
}: Props) {
  const isCorrect = selectedIndex === question.answerIndex;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-labelledby={`ca-q-${question.id}-heading`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
          प्रश्न {questionIndex + 1} / {totalQuestions}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          {formatTopicLabel(question.topic)}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs capitalize text-slate-600">
          {question.difficulty}
        </span>
      </div>

      <h2
        id={`ca-q-${question.id}-heading`}
        className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg"
      >
        {question.question}
      </h2>

      <div className="mt-4 space-y-2" role="group" aria-label="उत्तर विकल्प">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isAnswer = index === question.answerIndex;
          let tone = "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100";

          if (revealAnswer && isAnswer) {
            tone = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200";
          } else if (revealAnswer && isSelected && !isAnswer) {
            tone = "border-red-400 bg-red-50 text-red-900 ring-2 ring-red-200";
          } else if (isSelected) {
            tone = "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200";
          }

          return (
            <button
              key={index}
              type="button"
              disabled={disabled || (revealAnswer && selectedIndex !== null)}
              onClick={() => onSelect(index)}
              className={cn(
                "flex min-h-11 w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors sm:text-base",
                tone,
                (disabled || (revealAnswer && selectedIndex !== null)) && "cursor-default",
              )}
              aria-pressed={isSelected}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/80 text-xs font-bold">
                {OPTION_LABELS[index]}
              </span>
              <span className="min-w-0 flex-1 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {revealAnswer && selectedIndex !== null && (
        <div className="mt-4 space-y-3">
          <p
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-semibold",
              isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800",
            )}
          >
            {isCorrect ? "सही उत्तर!" : `गलत। सही उत्तर: ${OPTION_LABELS[question.answerIndex]}`}
          </p>
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            <span className="font-semibold text-slate-900">व्याख्या: </span>
            {question.explanation}
          </p>
          {question.staticLink && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">
              <p className="font-semibold text-blue-950">Static Link</p>
              <p className="mt-1">{question.staticLink}</p>
            </div>
          )}
          {question.sourceLabel && (
            <p className="text-xs leading-relaxed text-slate-500">Source: {question.sourceLabel}</p>
          )}
        </div>
      )}
    </section>
  );
}
