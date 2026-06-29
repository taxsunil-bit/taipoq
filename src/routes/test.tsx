import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { MobileTestPrepNotice } from "@/components/MobileTestPrepNotice";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SoundSettings } from "@/components/SoundSettings";
import { TypingScreen, type FinalResult } from "@/components/TypingScreen";
import { englishLessons, hindiLessons } from "@/lib/sample-data";
import { getActiveParagraphs, saveResult } from "@/lib/storage";

export const Route = createFileRoute("/test")({
  validateSearch: z.object({
    language: z.enum(["english", "hindi"]).optional(),
  }),
  head: () => ({ meta: [{ title: "Typing Test — TAIPOQ" }] }),
  component: TestPage,
});

type Lang = "English" | "Hindi";
type HindiMode = "Unicode" | "Remington" | "Phonetic";

const TARGETS = [
  { label: "Practice", wpm: 25, hint: "Warm-up speed" },
  { label: "RRB English", wpm: 30, hint: "Railway exam target" },
  { label: "SSC/DSSSB English", wpm: 35, hint: "SSC/DSSSB target" },
  { label: "Office / Data Entry", wpm: 40, hint: "Job-ready speed" },
] as const;

function TestPage() {
  const navigate = useNavigate();
  const { language } = Route.useSearch();
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<Lang>(() =>
    language === "hindi" ? "Hindi" : language === "english" ? "English" : "English",
  );
  const [hindiMode, setHindiMode] = useState<HindiMode>("Remington");
  const [duration, setDuration] = useState("3");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced" | "Legal Practice">("Intermediate");
  const [backspace, setBackspace] = useState<"Allowed" | "Not Allowed">("Allowed");
  const [highlight, setHighlight] = useState<"On" | "Off">("On");
  const [targetLabel, setTargetLabel] = useState<string>("Practice");
  const target_ = TARGETS.find((t) => t.label === targetLabel) ?? TARGETS[0];
  const targetWpm = target_.wpm;

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
    const passed = r.netWpm >= targetWpm && r.accuracy >= 90;
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
      targetWpm,
      targetLabel,
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
      <MobileTestPrepNotice
        practiceTo={lang === "Hindi" ? "/hindi/practice" : "/english/practice"}
        onContinue={() =>
          document.getElementById("test-configuration")?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <div className="mx-auto mb-6 hidden max-w-3xl md:block">
        <JobTypingSpeedGuide variant="full" />
      </div>
      <Card id="test-configuration" className="mx-auto max-w-3xl scroll-mt-24">
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
          <Field label="Target (Net WPM)">
            <div className="grid gap-2 sm:grid-cols-2">
              {TARGETS.map((t) => {
                const active = targetLabel === t.label;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setTargetLabel(t.label)}
                    aria-pressed={active}
                    className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm transition-colors md:min-h-0 ${
                      active
                        ? "border-primary bg-primary/15 ring-2 ring-primary"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{t.label}</span>
                      <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {t.wpm} WPM
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{t.hint}</div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Selected: <b className="text-foreground">{targetLabel} · {targetWpm} WPM</b> · Pass = Net WPM ≥ {targetWpm} and Accuracy ≥ 90%.
            </p>
          </Field>
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
          <SoundSettings />
          <Button size="lg" className="min-h-11 w-full md:w-auto" onClick={() => setStarted(true)} disabled={inactive}>
            {inactive ? (
              "Mode Coming Soon"
            ) : (
              <>
                Start Test / आरम्भ करें
              </>
            )}
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
          className={`min-h-11 rounded-md border px-3 py-2 text-sm transition-colors md:min-h-0 ${
            value === o ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
