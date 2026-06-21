import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/english/")({
  head: () => ({ meta: [{ title: "English Typing — TAIPOQ" }] }),
  component: EnglishHub,
});

const cards = [
  { title: "English Lessons", desc: "Learn typing from basics using structured lessons.", btn: "Open Lessons", to: "/english/lessons" as const },
  { title: "English Practice", desc: "Practice words, sentences, paragraphs, and legal English text.", btn: "Start Practice", to: "/english/practice" as const },
  { title: "English Typing Test", desc: "Take timed English typing tests.", btn: "Take Test", to: "/test" as const },
  { title: "English Progress", desc: "View your English speed, accuracy, and mistakes.", btn: "View Progress", to: "/progress" as const },
];

function EnglishHub() {
  return (
    <PageShell>
      <PageHeader title="English Typing" subtitle="Build typing speed with lessons, practice, and tests." accent="english" />
      <div className="mb-4 rounded-md border border-primary/40 bg-primary/5 p-4">
        <p className="text-sm">
          <b>First time?</b> Typing start karne se pahle finger position dekhein.{" "}
          <Link to="/typing-start-guide" className="font-semibold text-primary underline underline-offset-2">
            Learn finger placement →
          </Link>
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-english text-english-foreground hover:bg-english/90">
                <Link to={c.to}>{c.btn}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
