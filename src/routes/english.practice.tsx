import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { TypingScreen, type FinalResult } from "@/components/TypingScreen";
import { englishLessons } from "@/lib/sample-data";
import { saveResult } from "@/lib/storage";
import { z } from "zod";

export const Route = createFileRoute("/english/practice")({
  validateSearch: z.object({ lesson: z.string().optional() }),
  head: () => ({ meta: [{ title: "English Practice — TAIPOQ" }] }),
  component: Practice,
});

function Practice() {
  const { lesson } = Route.useSearch();
  const navigate = useNavigate();
  const current = englishLessons.find((l) => l.id === lesson) ?? englishLessons[0];
  const idx = englishLessons.indexOf(current);
  const next = englishLessons[(idx + 1) % englishLessons.length];

  function handleSubmit(r: FinalResult) {
    saveResult({
      language: "English",
      mode: "QWERTY",
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
      <PageHeader title={current.title} subtitle="English Practice" accent="english" />
      <TypingScreen
        title={current.title}
        target={current.target}
        language="en"
        onSubmit={handleSubmit}
        onNext={() => navigate({ to: "/english/practice", search: { lesson: next.id } })}
      />
    </PageShell>
  );
}
