import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { TypingScreen, type FinalResult } from "@/components/TypingScreen";
import { hindiLessons } from "@/lib/sample-data";
import { saveResult } from "@/lib/storage";
import { z } from "zod";

export const Route = createFileRoute("/hindi/practice")({
  validateSearch: z.object({ lesson: z.string().optional(), mode: z.string().optional() }),
  head: () => ({ meta: [{ title: "Hindi KrutiDev Practice — TAIPOQ" }] }),
  component: Practice,
});

function Practice() {
  const { lesson, mode } = Route.useSearch();
  const navigate = useNavigate();

  // KrutiDev / Remington is the active Hindi mode in v1.
  const activeMode = mode ?? "Remington";

  if (activeMode !== "Remington") {
    return (
      <PageShell>
        <PageHeader title={`${activeMode} Mode`} subtitle="Hindi Typing" accent="hindi" />
        <div className="mx-auto max-w-xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
          <h2 className="font-display text-2xl font-bold">Coming Soon</h2>
          <p className="mt-2 text-muted-foreground">
            <b>Hindi {activeMode}</b> mode will be added in a future version. Please use the active{" "}
            <b>Hindi KrutiDev / Remington</b> mode for now.
          </p>
          <button
            onClick={() => navigate({ to: "/hindi/practice", search: { mode: "Remington" } })}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Switch to KrutiDev / Remington
          </button>
        </div>
      </PageShell>
    );
  }

  const current = hindiLessons.find((l) => l.id === lesson) ?? hindiLessons[0];
  const idx = hindiLessons.indexOf(current);
  const next = hindiLessons[(idx + 1) % hindiLessons.length];

  function handleSubmit(r: FinalResult) {
    saveResult({
      language: "Hindi",
      mode: "Remington",
      title: current.title,
      kind: lesson ? "lesson" : "practice",
      elapsedSec: r.elapsedSec,
      grossWpm: r.grossWpm,
      netWpm: r.netWpm,
      accuracy: r.accuracy,
      total: r.total,
      correct: r.correct,
      wrong: r.wrong,
      mistakes: r.mistakes,
      backspaceAllowed: true,
      mistakeHighlight: true,
      passed: r.netWpm >= 25 && r.accuracy >= 90,
      mistakeList: r.mistakeList,
    });
    navigate({ to: "/result" });
  }

  return (
    <PageShell>
      <PageHeader
        title={<span className="font-hindi">{current.title}</span>}
        subtitle="Hindi KrutiDev / Remington Practice"
        accent="hindi"
      />

      <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-200">
        <p className="font-hindi">
          यह KrutiDev / Remington Hindi typing mode है. कृपया अपने सिस्टम में <b>KrutiDev 010</b> font install रखें.
          इस mode में typed English keys KrutiDev font में Hindi की तरह दिखाई देंगी.
        </p>
        <p className="mt-2 text-xs text-amber-300/80">
          If the target text below looks like English letters and symbols, the KrutiDev 010 font is not installed on
          your system — please install it to see Devanagari.
        </p>
      </div>

      <TypingScreen
        title={current.title}
        target={current.target}
        language="hi"
        script="kruti"
        onSubmit={handleSubmit}
        onNext={() => navigate({ to: "/hindi/practice", search: { lesson: next.id, mode: "Remington" } })}
      />
    </PageShell>
  );
}
