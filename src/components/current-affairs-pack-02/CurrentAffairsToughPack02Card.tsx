import { Link } from "@tanstack/react-router";
import { CURRENT_AFFAIRS_TOUGH_PACK_02 } from "@/content/tests/currentAffairsToughPack02";
import { cn } from "@/lib/utils";

const BTN =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors active:scale-[0.98]";

export function CurrentAffairsToughPack02Card() {
  const pack = CURRENT_AFFAIRS_TOUGH_PACK_02;

  return (
    <article className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          Tough · Pack 02
        </span>
        <span className="text-xs text-slate-500">{pack.subject}</span>
      </div>
      <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 sm:text-lg">{pack.title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-700">{pack.titleHindi}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        30 प्रश्न · 30 मिनट · कठिन समसामयिक अभ्यास
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to="/model-paper/current-affairs-pack-02"
          className={cn(BTN, "bg-blue-600 text-white hover:bg-blue-700")}
        >
          View Model Paper
        </Link>
        <Link
          to="/mock-test/current-affairs-pack-02"
          className={cn(BTN, "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50")}
        >
          Start Mock Test
        </Link>
      </div>
    </article>
  );
}
