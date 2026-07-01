import type { CurrentAffairsToughPack02 } from "@/content/tests/currentAffairsToughPack02";
import { Link } from "@tanstack/react-router";

type Props = {
  pack: CurrentAffairsToughPack02;
  mode: "model" | "mock";
};

export function Pack02PaperHeader({ pack, mode }: Props) {
  return (
    <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
          {pack.level} Level
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          {pack.subject}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          {mode === "model" ? "Model Paper" : "Mock Test"}
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{pack.title}</h1>
        <p className="mt-1 text-base font-medium text-slate-700">{pack.titleHindi}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <dt className="text-xs text-slate-500">प्रश्न</dt>
          <dd className="font-semibold text-slate-900">{pack.totalQuestions}</dd>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <dt className="text-xs text-slate-500">समय</dt>
          <dd className="font-semibold text-slate-900">{pack.durationMinutes} मिनट</dd>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <dt className="text-xs text-slate-500">अंक</dt>
          <dd className="font-semibold text-slate-900">{pack.marksPerQuestion} / प्रश्न</dd>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <dt className="text-xs text-slate-500">Negative</dt>
          <dd className="font-semibold text-slate-900">{pack.negativeMarks}</dd>
        </div>
      </dl>
      <p className="text-sm leading-relaxed text-slate-600">{pack.disclaimer}</p>
      {mode === "model" && (
        <Link
          to="/mock-test/current-affairs-pack-02"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Mock Test शुरू करें
        </Link>
      )}
    </header>
  );
}
