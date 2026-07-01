import { Link } from "@tanstack/react-router";
import { CURRENT_AFFAIRS_TOUGH_PACK_02 } from "@/content/tests/currentAffairsToughPack02";
import { cn } from "@/lib/utils";

const BTN_BASE =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors active:scale-[0.98]";

export function CurrentAffairsToughPack02Card() {
  const pack = CURRENT_AFFAIRS_TOUGH_PACK_02;

  return (
    <article
      aria-labelledby="pack02-featured-title"
      className="relative overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 p-5 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/20 sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative space-y-3">
        <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200">
          New Tough Challenge
        </span>

        <div>
          <h2
            id="pack02-featured-title"
            className="text-lg font-bold leading-snug text-white sm:text-xl"
          >
            {pack.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-amber-100/90">{pack.titleHindi}</p>
          <p className="mt-2 text-sm text-slate-300">
            30 Questions · 30 Minutes · Tough Current Affairs Practice
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Link
            to="/mock-test/current-affairs-pack-02"
            className={cn(
              BTN_BASE,
              "bg-amber-500 font-bold text-slate-950 shadow-md shadow-amber-950/40 hover:bg-amber-400",
            )}
          >
            Start Mock Test
          </Link>
          <Link
            to="/model-paper/current-affairs-pack-02"
            className={cn(
              BTN_BASE,
              "border border-white/25 bg-white/10 text-white hover:bg-white/15",
            )}
          >
            View Model Paper
          </Link>
        </div>
      </div>
    </article>
  );
}
