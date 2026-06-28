import { Link } from "@tanstack/react-router";
import type { GATestData, GAScoreResult } from "@/types/generalAwarenessTest";
import { getResultLabel } from "@/types/generalAwarenessTest";
import { cn } from "@/lib/utils";

type GeneralAwarenessResultProps = {
  testData: GATestData;
  answers: Record<string, number>;
  score: GAScoreResult;
  onRestart: () => void;
  libraryBackHref?: string;
};

function optionLabel(index: number): string {
  return ["A", "B", "C", "D"][index] ?? "?";
}

export function GeneralAwarenessResult({
  testData,
  answers,
  score,
  onRestart,
  libraryBackHref = "/study-corner/general-awareness",
}: GeneralAwarenessResultProps) {
  const label = getResultLabel(score.percentage);
  const topics = Object.entries(score.byTopic).sort((a, b) => a[0].localeCompare(b[0], "hi"));

  return (
    <div className="mx-auto max-w-3xl space-y-6 overflow-x-hidden p-4 pb-10 font-hindi sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">आपका परिणाम</h2>
        <p className="mt-1 text-sm text-slate-600">{testData.titleHi}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="अंक" value={`${score.score} / ${testData.totalMarks}`} highlight />
          <StatBox label="सही" value={String(score.correct)} tone="success" />
          <StatBox label="गलत" value={String(score.wrong)} tone="error" />
          <StatBox label="नहीं किए" value={String(score.notAttempted)} tone="warning" />
        </div>

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{score.percentage}%</p>
          <p className="mt-1 text-base font-semibold text-blue-800">{label}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-slate-900">विषयवार विश्लेषण</h3>
        <ul className="mt-4 space-y-4">
          {topics.map(([topic, stats]) => {
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            return (
              <li key={topic}>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-slate-800">{topic}</span>
                  <span className="text-slate-600">
                    {stats.correct} / {stats.total} सही
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">उत्तर समीक्षा</h3>
        {testData.questions.map((q, index) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctOptionIndex;
          const isAttempted = selected !== undefined;
          const cardTone = !isAttempted
            ? "border-amber-200 bg-amber-50"
            : isCorrect
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50";

          return (
            <article
              key={q.id}
              className={cn("rounded-2xl border p-4 shadow-sm sm:p-5", cardTone)}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                  प्रश्न {index + 1}
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                  {q.topic}
                </span>
              </div>
              <p className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
                {q.question}
              </p>
              <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-700 sm:text-base">
                <p>
                  <span className="font-medium">आपका उत्तर:</span>{" "}
                  {isAttempted
                    ? `${optionLabel(selected)} — ${q.options[selected]}`
                    : "प्रयास नहीं किया"}
                </p>
                <p>
                  <span className="font-medium">सही उत्तर:</span>{" "}
                  {optionLabel(q.correctOptionIndex)} — {q.options[q.correctOptionIndex]}
                </p>
                <p className="mt-2 rounded-lg bg-white/60 p-3 text-slate-600">{q.explanation}</p>
              </div>
            </article>
          );
        })}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-12 flex-1 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:min-w-[10rem]"
        >
          फिर से Test दें
        </button>
        <Link
          to={libraryBackHref}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 sm:min-w-[10rem]"
        >
          Library पर वापस जाएँ
        </Link>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
  tone,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  tone?: "success" | "error" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : tone === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : highlight
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : "border-slate-200 bg-slate-50 text-slate-800";

  return (
    <div className={cn("rounded-xl border px-3 py-3 text-center", toneClass)}>
      <p className="text-xs text-current/80">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
