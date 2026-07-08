import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MSL_MODULE, MSL_PILOT_TECHNIQUES } from "@/content/math-speed-lab";
import { getTechniqueProgress } from "@/lib/math-speed-lab";
import type { MslTechniqueId, MslTechniqueProgress } from "@/lib/math-speed-lab/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/math-speed-lab/")({
  head: () => ({
    meta: [
      { title: "Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Canary module landing for Math Speed Lab Techniques T01–T03 (direct practice). Direct URL access. No examination-body endorsement.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MathSpeedLabIndex,
});

const LESSON_PATH: Record<
  MslTechniqueId,
  | "/math-speed-lab/square-ending-5"
  | "/math-speed-lab/complements-10n"
  | "/math-speed-lab/nearbase-100"
> = {
  "MSL-T01-SQUARE-ENDING-5": "/math-speed-lab/square-ending-5",
  "MSL-T02-COMPLEMENTS-10N": "/math-speed-lab/complements-10n",
  "MSL-T03-NEARBASE-100": "/math-speed-lab/nearbase-100",
};

function MathSpeedLabIndex() {
  const [progressMap, setProgressMap] = useState<
    Partial<Record<MslTechniqueId, MslTechniqueProgress>>
  >({});

  useEffect(() => {
    const next: Partial<Record<MslTechniqueId, MslTechniqueProgress>> = {};
    for (const tech of MSL_PILOT_TECHNIQUES) {
      next[tech.techniqueId] = getTechniqueProgress(tech.techniqueId);
    }
    setProgressMap(next);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-hindi">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
          Canary / Pilot
        </span>
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          Local pilot — T01, T02, T03 direct practice
        </span>
      </div>

      <PageHeader
        title={
          <>
            {MSL_MODULE.titleEn}
            <span className="mt-2 block text-xl font-semibold md:text-2xl">
              {MSL_MODULE.titleHi}
            </span>
          </>
        }
        subtitle={MSL_MODULE.description}
        accent="neutral"
      />

      <section
        aria-labelledby="msl-disclaimer-heading"
        className="rounded-xl border border-border bg-surface/40 p-4 text-sm leading-relaxed text-muted-foreground"
      >
        <h2 id="msl-disclaimer-heading" className="mb-2 text-base font-bold text-foreground">
          Disclaimer
        </h2>
        <p className="whitespace-pre-line">{MSL_MODULE.disclaimer}</p>
      </section>

      <section className="space-y-4" aria-labelledby="msl-techniques-heading">
        <h2 id="msl-techniques-heading" className="text-lg font-bold">
          Pilot techniques
        </h2>
        {MSL_PILOT_TECHNIQUES.map((tech) => {
          const progress = progressMap[tech.techniqueId];
          return (
            <Card key={tech.techniqueId} className="border-border bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg font-bold leading-snug">{tech.titleEn}</CardTitle>
                <CardDescription className="text-base text-foreground/80">
                  {tech.titleHi}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tech.shortDescription}</p>
                <p className="text-sm text-muted-foreground">
                  Learner level:{" "}
                  <span className="font-semibold text-foreground">{tech.learnerLevel}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Progress:{" "}
                  <span className="font-semibold text-foreground">
                    {progress?.state ?? "not_started"}
                  </span>
                  {progress?.directScorePercent != null
                    ? ` · direct ${progress.directScorePercent}%`
                    : ""}
                </p>
                <Link
                  to={LESSON_PATH[tech.techniqueId]}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "min-h-11 inline-flex w-full touch-manipulation justify-center sm:w-auto",
                  )}
                >
                  Open lesson
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <p className="text-xs text-muted-foreground">
        Local pilot canary for direct lessons and direct practice only. Recognition, mixed, exam,
        error-identification, and revision sets are not included yet. Reachable by direct URL only —
        not listed in site navigation. This is not a full public release.
      </p>
    </div>
  );
}
