import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageShell";
import { MslT01DirectPracticeRunner } from "@/components/math-speed-lab/MslT01DirectPracticeRunner";
import { T01_TECHNIQUE } from "@/content/math-speed-lab/techniques/t01-square-ending-5";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/math-speed-lab/square-ending-5/practice/direct")({
  head: () => ({
    meta: [
      { title: "T01 Direct Practice — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Nine exact-integer square questions for numbers ending in 5. Accuracy only; no timer.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MslT01DirectPracticePage,
});

function MslT01DirectPracticePage() {
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
            {T01_TECHNIQUE.titleEn} — Direct practice
            <span className="mt-2 block text-lg font-semibold md:text-xl">
              {T01_TECHNIQUE.titleHi} — प्रत्यक्ष अभ्यास
            </span>
          </>
        }
        subtitle="Exact integer answers only. Timing does not affect score or mastery."
        accent="neutral"
      />

      <MslT01DirectPracticeRunner />

      <Link
        to="/math-speed-lab/square-ending-5"
        className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}
      >
        ← Back to lesson
      </Link>
    </div>
  );
}
