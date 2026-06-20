import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { englishLessons } from "@/lib/sample-data";

export const Route = createFileRoute("/english/lessons")({
  head: () => ({ meta: [{ title: "English Lessons — TAIPOQ" }] }),
  component: Lessons,
});

function Lessons() {
  return (
    <PageShell>
      <PageHeader title="English Lessons" subtitle="Structured lessons from home row to legal practice." accent="english" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {englishLessons.map((l) => (
          <Card key={l.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{l.title}</CardTitle>
                <Badge variant="secondary">{l.level}</Badge>
              </div>
              <CardDescription>{l.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">⏱ {l.time}</span>
              <Button asChild size="sm" className="bg-english text-english-foreground hover:bg-english/90">
                <Link to="/english/practice" search={{ lesson: l.id }}>Start Lesson</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
