import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageShell";
import { MslT02DirectPracticeRunner } from "@/components/math-speed-lab/MslT02DirectPracticeRunner";
import { T02_TECHNIQUE } from "@/content/math-speed-lab/techniques/t02-complements-10n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/math-speed-lab/complements-10n/practice/direct")({
  head: () => ({
    meta: [
      { title: "T02 Direct Practice — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Twelve exact-integer complement questions for bases 100 and 1000. Accuracy only; no timer.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MslT02DirectPracticePage,
});

function MslT02DirectPracticePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 font-hindi">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
          Canary / Pilot
        </span>
      </div>

      <PageHeader
        title={
          <>
            {T02_TECHNIQUE.titleEn} — Direct practice
            <span className="mt-2 block text-lg font-semibold md:text-xl">
              {T02_TECHNIQUE.titleHi} — प्रत्यक्ष अभ्यास
            </span>
          </>
        }
        subtitle="Exact integer answers only. Timing does not affect score or mastery."
        accent="neutral"
      />

      <MslT02DirectPracticeRunner />

      <Link
        to="/math-speed-lab/complements-10n"
        className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}
      >
        ← Back to lesson
      </Link>
    </div>
  );
}
