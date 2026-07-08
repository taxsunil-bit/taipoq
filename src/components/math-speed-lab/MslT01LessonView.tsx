import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { T01_TECHNIQUE } from "@/content/math-speed-lab/techniques/t01-square-ending-5";
import { getT01Progress, markT01LessonOpened } from "@/lib/math-speed-lab";
import type { MslTechniqueProgress } from "@/lib/math-speed-lab/types";
import { cn } from "@/lib/utils";

function Sup2() {
  return <sup>2</sup>;
}

export function MslT01LessonView() {
  const [progress, setProgress] = useState<MslTechniqueProgress | null>(null);

  useEffect(() => {
    setProgress(markT01LessonOpened());
  }, []);

  const tech = T01_TECHNIQUE;

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-hindi">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
          Canary / Pilot
        </span>
        {progress ? (
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            Progress: {progress.state}
            {progress.directScorePercent != null
              ? ` · last direct ${progress.directScorePercent}%`
              : ""}
          </span>
        ) : null}
      </div>

      <PageHeader
        title={
          <>
            {tech.titleEn}
            <span className="mt-2 block text-xl font-semibold md:text-2xl">{tech.titleHi}</span>
          </>
        }
        subtitle={`Technique ID: ${tech.techniqueId}`}
        accent="neutral"
      />

      <p className="text-sm leading-relaxed text-muted-foreground">{tech.attribution}</p>

      <section className="space-y-2" aria-labelledby="msl-t01-recognition">
        <h2 id="msl-t01-recognition" className="text-lg font-bold">
          Recognition signal
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">{tech.recognitionSignal}</p>
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-when">
        <h2 id="msl-t01-when" className="text-lg font-bold">
          When to use
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-base text-muted-foreground">
          {tech.whenToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-when-not">
        <h2 id="msl-t01-when-not" className="text-lg font-bold">
          When not to use
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-base text-muted-foreground">
          {tech.whenNotToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-ordinary">
        <h2 id="msl-t01-ordinary" className="text-lg font-bold">
          Ordinary method
        </h2>
        <p className="text-base text-muted-foreground">{tech.ordinaryMethod}</p>
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-rapid">
        <h2 id="msl-t01-rapid" className="text-lg font-bold">
          Rapid method
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-base text-muted-foreground">
          {tech.rapidMethodSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="font-mono text-sm text-foreground">
          Identity: (10a + 5)
          <Sup2 /> = 100a(a + 1) + 25
        </p>
      </section>

      <Accordion type="single" collapsible className="rounded-xl border border-border px-4">
        <AccordionItem value="why" className="border-b-0">
          <AccordionTrigger className="text-base font-bold text-foreground">
            Why it works
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {tech.whyItWorks}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section className="space-y-4" aria-labelledby="msl-t01-guided">
        <h2 id="msl-t01-guided" className="text-lg font-bold">
          Guided examples
        </h2>
        {tech.guidedExamples.map((ex) => (
          <Card key={ex.exampleId} className="border-border bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">{ex.prompt}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                {ex.orderedSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                <span className="font-semibold text-foreground">Ordinary verification: </span>
                <span className="text-muted-foreground">{ex.ordinaryVerification}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3" aria-labelledby="msl-t01-invalid">
        <h2 id="msl-t01-invalid" className="text-lg font-bold">
          When the rapid rule does not apply
        </h2>
        {tech.invalidExamples.map((ex) => (
          <div
            key={ex.exampleId}
            className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm leading-relaxed"
          >
            <p className="font-semibold text-foreground">{ex.prompt}</p>
            <p className="mt-2 text-muted-foreground">{ex.reason}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-errors">
        <h2 id="msl-t01-errors" className="text-lg font-bold">
          Common errors
        </h2>
        <ul className="space-y-2">
          {tech.commonErrors.map((err) => (
            <li
              key={err.code}
              className="rounded-lg border border-border bg-surface/40 px-4 py-3 text-sm"
            >
              <span className="font-mono text-xs text-muted-foreground">{err.code}</span>
              <p className="mt-1 text-muted-foreground">{err.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-verify">
        <h2 id="msl-t01-verify" className="text-lg font-bold">
          Verification
        </h2>
        <p className="text-base text-muted-foreground">{tech.verificationMethod}</p>
      </section>

      <section className="space-y-3" aria-labelledby="msl-t01-practice-link">
        <h2 id="msl-t01-practice-link" className="text-lg font-bold">
          Direct practice
        </h2>
        <p className="text-sm text-muted-foreground">
          Nine exact-integer questions — one for each locked operand. Accuracy only; no timer.
        </p>
        <Link
          to="/math-speed-lab/square-ending-5/practice/direct"
          className={cn(
            buttonVariants({ size: "lg" }),
            "min-h-11 inline-flex w-full touch-manipulation justify-center sm:w-auto",
          )}
        >
          Start direct practice
        </Link>
      </section>

      <section className="space-y-2" aria-labelledby="msl-t01-progress">
        <h2 id="msl-t01-progress" className="text-lg font-bold">
          Basic progress summary
        </h2>
        {progress ? (
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>State: {progress.state}</li>
            <li>
              Direct score:{" "}
              {progress.directScorePercent != null ? `${progress.directScorePercent}%` : "—"}
            </li>
            <li>Last attempted: {progress.lastAttemptedAt ?? "—"}</li>
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Loading progress…</p>
        )}
      </section>

      <Link
        to="/math-speed-lab"
        className={cn(buttonVariants({ variant: "outline" }), "min-h-11 inline-flex")}
      >
        ← Math Speed Lab
      </Link>
    </div>
  );
}
