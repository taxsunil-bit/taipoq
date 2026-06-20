import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TypingScreen, type FinalResult } from "@/components/TypingScreen";
import { englishLessons, hindiLessons } from "@/lib/sample-data";
import { getActiveParagraphs, saveResult } from "@/lib/storage";

export const Route = createFileRoute("/test")({
  head: () => ({ meta: [{ title: "Typing Test — TAIPOQ" }] }),
  component: TestPage,
});

type Lang = "English" | "Hindi";
type HindiMode = "Unicode" | "Remington" | "Phonetic";

function TestPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<Lang>("English");
  const [hindiMode, setHindiMode] = useState<HindiMode>("Remington");
  const [duration, setDuration] = useState("3");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced" | "Legal Practice">("Intermediate");
  const [backspace, setBackspace] = useState<"Allowed" | "Not Allowed">("Allowed");
  const [highlight, setHighlight] = useState<"On" | "Off">("On");

  const inactive = lang === "Hindi" && hindiMode !== "Remington";

  const target = useMemo(() => {
    // Active admin paragraphs must match language + difficulty + duration.
    // For Hindi, the paragraph's hindiMode must also match the selected Hindi mode.
    const custom = getActiveParagraphs(lang).find(
      (p) =>
        p.difficulty === difficulty &&
        String(p.durationMin) === duration &&
        (lang === "English" || p.hindiMode === hindiMode)
    );
    if (custom) return { title: custom.title, text: custom.text };
    const pool = lang === "English" ? englishLessons : hindiLessons;
    const match = pool.find((l) => l.level === difficulty) ?? pool[pool.length - 1];
    return { title: match.title, text: match.target };
  }, [lang, difficulty, duration, hindiMode]);

  const mode = lang === "English" ? "QWERTY" : hindiMode;

  function handleSubmit(r: FinalResult) {
    const passed = r.netWpm >= 25 && r.accuracy >= 90;
    saveResult({
      language: lang,
      mode,
      title: `${lang} Typing Test (${duration} min)`,
      kind: "test",
      durationMin: Number(duration),
      elapsedSec: r.elapsedSec,
      grossWpm: r.grossWpm,
      netWpm: r.netWpm,
      accuracy: r.accuracy,
      total: r.total,
      correct: r.correct,
      wrong: r.wrong,
      mistakes: r.mistakes,
      backspaceAllowed: backspace === "Allowed",
      mistakeHighlight: highlight === "On",
      passed,
      mistakeList: r.mistakeList,
    });
    navigate({ to: "/result" });
  }

  if (started && !inactive) {
    return (
      <PageShell>
        <PageHeader title={`${lang} Typing Test`} subtitle={`${duration} min · ${difficulty}${lang === "Hindi" ? ` · ${hindiMode}` : ""}`} />
        <TypingScreen
          title={target.title}
          target={target.text}
          language={lang === "Hindi" ? "hi" : "en"}
          script={lang === "Hindi" && hindiMode === "Remington" ? "kruti" : "unicode"}
          durationMin={Number(duration)}
          backspaceAllowed={backspace === "Allowed"}
          mistakeHighlight={highlight === "On"}
          onSubmit={handleSubmit}
        />
        <div className="mt-4">
          <Button variant="ghost" onClick={() => setStarted(false)}>← Change Settings</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Typing Test" subtitle="Configure your test, then begin." />
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Field label="Language">
            <Group value={lang} onChange={(v) => setLang(v as Lang)} options={["English", "Hindi"]} />
          </Field>
          {lang === "Hindi" && (
            <Field label="Hindi Mode">
              <Group value={hindiMode} onChange={(v) => setHindiMode(v as HindiMode)} options={["Remington", "Unicode", "Phonetic"]} />
              {hindiMode === "Remington" && (
                <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  <b>KrutiDev / Remington</b> mode is active. Install <b>KrutiDev 010</b> font for proper Devanagari display.
                </p>
              )}
              {inactive && (
                <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                  {hindiMode} mode — Coming Soon. Please use <b>Remington</b> for now.
                </p>
              )}
            </Field>
          )}
          <Field label="Duration (minutes)">
            <Group value={duration} onChange={setDuration} options={["1", "3", "5", "10", "15"]} />
          </Field>
          <Field label="Difficulty">
            <Group value={difficulty} onChange={(v) => setDifficulty(v as typeof difficulty)} options={["Beginner", "Intermediate", "Advanced", "Legal Practice"]} />
          </Field>
          <Field label="Backspace">
            <Group value={backspace} onChange={(v) => setBackspace(v as typeof backspace)} options={["Allowed", "Not Allowed"]} />
          </Field>
          <Field label="Mistake Highlight">
            <Group value={highlight} onChange={(v) => setHighlight(v as typeof highlight)} options={["On", "Off"]} />
          </Field>
          <Button size="lg" onClick={() => setStarted(true)} disabled={inactive}>
            {inactive ? "Mode Coming Soon" : "Start Test"}
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Group({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            value === o ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
