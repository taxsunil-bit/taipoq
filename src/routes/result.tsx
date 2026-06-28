import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { playCompletionSound } from "@/lib/audio-feedback";
import { getSoundSettings } from "@/lib/sound-settings";
import { getLatestResult, type SavedResult } from "@/lib/storage";

export const Route = createFileRoute("/result")({
  head: () => ({ meta: [{ title: "Result — TAIPOQ" }] }),
  component: ResultPage,
});

function ResultPage() {
  const [result, setResult] = useState<SavedResult | null>(null);
  const completionPlayedRef = useRef(false);

  useEffect(() => {
    const r = getLatestResult();
    setResult(r);
    if (r && !completionPlayedRef.current) {
      completionPlayedRef.current = true;
      try {
        const s = getSoundSettings();
        if (s.soundEnabled && s.completionSound) playCompletionSound();
      } catch {
        /* never block result display */
      }
    }
  }, []);

  if (!result) {
    return (
      <PageShell>
        <PageHeader title="No Result Yet" subtitle="Complete a lesson or test to see your result here." />
        <Button asChild><Link to="/test">Take a Test</Link></Button>
      </PageShell>
    );
  }

  const isHindi = result.language === "Hindi";
  const isKruti = isHindi && result.mode === "Remington";
  const hindiFontClass = isKruti ? "font-kruti" : isHindi ? "font-hindi" : "";

  return (
    <PageShell>
      <PageHeader title="Test Result" subtitle={`${result.language} · ${result.mode} · ${result.title}`} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Gross WPM" value={result.grossWpm} />
        <Stat label="Net WPM" value={result.netWpm} />
        <Stat label="Accuracy" value={`${result.accuracy}%`} />
        <Stat label="Mistakes" value={result.mistakes} />
        <Stat label="Total Typed" value={result.total} />
        <Stat label="Correct Characters" value={result.correct} />
        <Stat label="Wrong Characters" value={result.wrong} />
        <Stat label="Time Taken" value={`${result.elapsedSec}s`} />
        <Stat label="Selected Duration" value={result.durationMin ? `${result.durationMin} min` : "—"} />
        <Stat label="Language" value={result.language} />
        <Stat label="Mode" value={result.mode} />
        <Stat label="Status" value={
          <Badge className={result.passed ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
            {result.passed ? "Pass" : "Fail"}
          </Badge>
        } />
      </div>

      {typeof result.targetWpm === "number" && (() => {
        const targetPassed = result.netWpm >= result.targetWpm && result.accuracy >= 90;
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Target Result — {result.targetLabel ?? "Custom"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-4">
                <Stat label="Target WPM" value={result.targetWpm} />
                <Stat label="Your Net WPM" value={result.netWpm} />
                <Stat label="Accuracy" value={`${result.accuracy}%`} />
                <Stat
                  label="vs Target"
                  value={
                    <Badge className={targetPassed ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                      {targetPassed ? "Pass" : "Fail"}
                    </Badge>
                  }
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Pass criteria: Net WPM ≥ {result.targetWpm} and Accuracy ≥ 90%.
              </p>
              {!targetPassed && (
                <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
                  Practice accuracy first, then increase speed. Slow down a little and aim for 95%+ accuracy — speed will follow.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })()}

      <Card className="mt-6">
        <CardHeader><CardTitle>Mistake Details ({result.mistakeList.length})</CardTitle></CardHeader>
        <CardContent>
          {result.mistakeList.length === 0 ? (
            <p className="text-muted-foreground">No mistakes — excellent!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expected</TableHead>
                  <TableHead>Typed</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Error Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.mistakeList.slice(0, 100).map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className={hindiFontClass}>{e.expected || "∅"}</TableCell>
                    <TableCell className={hindiFontClass}>{e.typed || "∅"}</TableCell>
                    <TableCell>{e.position}</TableCell>
                    <TableCell>{e.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild><Link to="/test">फिर से Test दें</Link></Button>
        <Button asChild variant="secondary"><Link to="/progress">Go to Dashboard</Link></Button>
        <Button variant="outline" onClick={() => window.print()}>Print Result</Button>
        <Button variant="outline" onClick={() => downloadResult(result)}>Download Result</Button>
        <Button asChild variant="outline"><Link to="/certificate">View Certificate</Link></Button>
      </div>
    </PageShell>
  );
}

function downloadResult(r: SavedResult) {
  const html = `<!doctype html><meta charset="utf-8"><title>TAIPOQ Result ${r.id}</title>
<body style="font-family:sans-serif;padding:24px;max-width:720px;margin:auto">
<h1>TAIPOQ Result</h1>
<p><b>${r.title}</b> — ${r.language} · ${r.mode}</p>
<ul>
<li>Date: ${new Date(r.date).toLocaleString()}</li>
<li>Duration: ${r.durationMin ?? "—"} min</li>
<li>Time Taken: ${r.elapsedSec}s</li>
<li>Gross WPM: ${r.grossWpm}</li>
<li>Net WPM: ${r.netWpm}</li>
<li>Accuracy: ${r.accuracy}%</li>
<li>Total Typed: ${r.total}</li>
<li>Correct: ${r.correct}</li>
<li>Wrong: ${r.wrong}</li>
<li>Mistakes: ${r.mistakes}</li>
<li>Status: ${r.passed ? "Pass" : "Fail"}</li>
</ul></body>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `taipoq-result-${r.id}.html`; a.click();
  URL.revokeObjectURL(url);
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
