import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MSL_MODULE } from "@/content/math-speed-lab/module";
import { T01_TECHNIQUE } from "@/content/math-speed-lab/techniques/t01-square-ending-5";
import { getT01Progress } from "@/lib/math-speed-lab";
import type { MslTechniqueProgress } from "@/lib/math-speed-lab/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/math-speed-lab/")({
  head: () => ({
    meta: [
      { title: "Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Canary module landing for Math Speed Lab Technique 1 only. Direct URL access. No examination-body endorsement.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MathSpeedLabIndex,
});

function MathSpeedLabIndex() {
  const [progress, setProgress] = useState<MslTechniqueProgress | null>(null);

  useEffect(() => {
    setProgress(getT01Progress());
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-hindi">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
          Canary / Pilot
        </span>
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          Technique 1 of 3 planned — T01 only shipped
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

      <Card className="border-border bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg font-bold leading-snug">{T01_TECHNIQUE.titleEn}</CardTitle>
          <CardDescription className="text-base text-foreground/80">
            {T01_TECHNIQUE.titleHi}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Current progress:{" "}
            <span className="font-semibold text-foreground">
              {progress?.state ?? "not_started"}
            </span>
            {progress?.directScorePercent != null
              ? ` · direct ${progress.directScorePercent}%`
              : ""}
          </p>
          <Link
            to="/math-speed-lab/square-ending-5"
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-h-11 inline-flex w-full touch-manipulation justify-center sm:w-auto",
            )}
          >
            Open T01 lesson
          </Link>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        This canary does not include Techniques T02 or T03. Reachable by direct URL only — not
        listed in site navigation.
      </p>
    </div>
  );
}
