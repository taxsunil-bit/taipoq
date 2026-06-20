import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hindiLessons } from "@/lib/sample-data";

export const Route = createFileRoute("/hindi/lessons")({
  head: () => ({ meta: [{ title: "Hindi Lessons — TAIPOQ" }] }),
  component: Lessons,
});

function Lessons() {
  return (
    <PageShell>
      <PageHeader title="Hindi Lessons" subtitle="KrutiDev / Remington अभ्यास — स्वर, व्यंजन, मात्रा, संयुक्ताक्षर।" accent="hindi" />
      <p className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        सभी lessons <b>KrutiDev / Remington</b> mode के लिए हैं. Target text KrutiDev 010 font में दिखेगा.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hindiLessons.map((l) => (
          <Card key={l.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="font-hindi text-lg">{l.title}</CardTitle>
                <Badge variant="secondary">{l.level}</Badge>
              </div>
              <CardDescription>KrutiDev · {l.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-kruti truncate rounded bg-muted/40 px-2 py-1 text-base">{l.target}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">⏱ {l.time}</span>
                <Button asChild size="sm" className="bg-hindi text-hindi-foreground hover:bg-hindi/90">
                  <Link to="/hindi/practice" search={{ lesson: l.id, mode: "Remington" }}>Start Lesson</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
