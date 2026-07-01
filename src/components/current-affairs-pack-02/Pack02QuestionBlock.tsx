import type { ToughPack02Question } from "@/content/tests/currentAffairsToughPack02";
import { TOUGH_PACK_02_TOPIC_LABELS } from "@/content/tests/currentAffairsToughPack02";
import { cn } from "@/lib/utils";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

type Props = {
  question: ToughPack02Question;
  questionIndex: number;
  totalQuestions: number;
  selectedIndex: number | null;
  onSelect?: (index: number) => void;
  revealAnswer: boolean;
  disabled?: boolean;
};

export function Pack02QuestionBlock({
  question,
  questionIndex,
  totalQuestions,
  selectedIndex,
  onSelect,
  revealAnswer,
  disabled = false,
}: Props) {
  const isCorrect = selectedIndex === question.answerIndex;
  const showStudyAnswer = revealAnswer && selectedIndex === null;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-labelledby={`pack02-q-${question.id}-heading`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
          प्रश्न {questionIndex + 1} / {totalQuestions}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          {TOUGH_PACK_02_TOPIC_LABELS[question.topic]}
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          Tough
        </span>
      </div>

      <h2
        id={`pack02-q-${question.id}-heading`}
        className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg"
      >
        {question.question}
      </h2>

      <div className="mt-4 space-y-2" role="group" aria-label="उत्तर विकल्प">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isAnswer = index === question.answerIndex;
          let tone = "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100";

          if ((revealAnswer || showStudyAnswer) && isAnswer) {
            tone = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200";
          } else if (revealAnswer && isSelected && !isAnswer) {
            tone = "border-red-400 bg-red-50 text-red-900 ring-2 ring-red-200";
          } else if (isSelected) {
            tone = "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200";
          }

          const interactive = Boolean(onSelect) && !disabled && !(revealAnswer && selectedIndex !== null);

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => onSelect?.(index)}
              className={cn(
                "flex min-h-11 w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors sm:text-base",
                tone,
                !interactive && "cursor-default",
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

      {(showStudyAnswer || (revealAnswer && selectedIndex !== null)) && (
        <div className="mt-4 space-y-3">
          {selectedIndex !== null && (
            <p
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold",
                isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800",
              )}
            >
              {isCorrect ? "सही उत्तर!" : `गलत। सही उत्तर: ${OPTION_LABELS[question.answerIndex]}`}
            </p>
          )}
          {showStudyAnswer && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              सही उत्तर: {OPTION_LABELS[question.answerIndex]} — {question.answer}
            </p>
          )}
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            <span className="font-semibold text-slate-900">व्याख्या: </span>
            {question.explanation}
          </p>
        </div>
      )}
    </section>
  );
}
