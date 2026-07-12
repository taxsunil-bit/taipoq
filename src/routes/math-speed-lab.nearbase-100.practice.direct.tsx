import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageShell";
import { MslT03DirectPracticeRunner } from "@/components/math-speed-lab/MslT03DirectPracticeRunner";
import { T03_TECHNIQUE } from "@/content/math-speed-lab/techniques/t03-nearbase-100";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/math-speed-lab/nearbase-100/practice/direct")({
  head: () => ({
    meta: [
      { title: "Direct Practice — Near-Base Multiplication — Math Speed Lab — TAIPOQ" },
      {
        name: "description",
        content:
          "Twelve exact-integer Model A products for operands in 90–99. Accuracy only; no timer.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MslT03DirectPracticePage,
});

function MslT03DirectPracticePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 font-hindi">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
          Early Access
        </span>
      </div>

      <PageHeader
        title={
          <>
            {T03_TECHNIQUE.titleEn} — Direct practice
            <span className="mt-2 block text-lg font-semibold md:text-xl">
              {T03_TECHNIQUE.titleHi} — प्रत्यक्ष अभ्यास
            </span>
          </>
        }
        subtitle="Exact integer answers only. Timing does not affect score or mastery."
        accent="neutral"
      />

      <MslT03DirectPracticeRunner />

      <Link
        to="/math-speed-lab/nearbase-100"
        className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}
      >
        ← Back to lesson
      </Link>
    </div>
  );
}
