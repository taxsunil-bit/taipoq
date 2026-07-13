import { createFileRoute, Link } from "@tanstack/react-router";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { MOBILE_ACTION } from "@/components/MobileTestPrepNotice";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/english/")({
  head: () => ({ meta: [{ title: "English Typing — TAIPOQ" }] }),
  component: EnglishHub,
});

const cards = [
  {
    title: "English Lessons",
    desc: "Learn typing from basics using structured lessons.",
    btn: "Open Lessons",
    to: "/english/lessons" as const,
  },
  {
    title: "English Practice",
    desc: "Practice words, sentences, paragraphs, and legal English text.",
    btn: "Start Practice",
    to: "/english/practice" as const,
  },
  {
    title: "English Typing Test",
    desc: "Take timed English typing tests.",
    btn: "Take Test",
    to: "/test" as const,
  },
  {
    title: "English Progress",
    desc: "View your English speed, accuracy, and mistakes.",
    btn: "View Progress",
    to: "/progress" as const,
  },
];

function EnglishHub() {
  return (
    <PageShell>
      <PageHeader
        title="English Typing"
        subtitle="Build typing speed with lessons, practice, and tests."
        accent="english"
      />
      <EnglishHubMobile />
      <EnglishHubDesktop />
    </PageShell>
  );
}

function EnglishHubMobile() {
  return (
    <div className="space-y-4 overflow-x-hidden md:hidden">
      <Link
        to="/english/practice"
        className={cn(MOBILE_ACTION, "bg-english text-english-foreground shadow-sm")}
      >
        Practice Passage
      </Link>
      <Link
        to="/english/lessons"
        className={cn(MOBILE_ACTION, "border border-border bg-surface text-foreground")}
      >
        Open Lessons
      </Link>
      <Link
        to="/typing-start-guide"
        className={cn(MOBILE_ACTION, "border border-border bg-surface text-foreground")}
      >
        Learn Finger Placement
      </Link>

      <JobTypingSpeedGuide variant="compact" showTestLink={false} className="mt-0" />

      <Link
        to="/typing-tips"
        className={cn(MOBILE_ACTION, "border border-border bg-surface/50 text-foreground")}
      >
        View Speed Targets
      </Link>

      <Link
        to="/test"
        search={{ language: "english" }}
        className={cn(
          MOBILE_ACTION,
          "border border-dashed border-border bg-surface/30 text-foreground",
        )}
      >
        Desktop Speed Test
      </Link>

      <Link
        to="/progress"
        className="flex min-h-11 items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
      >
        <span>View Progress</span>
        <span className="text-muted-foreground">→</span>
      </Link>
    </div>
  );
}

function EnglishHubDesktop() {
  return (
    <div className="hidden md:block">
      <div className="mb-4 rounded-md border border-primary/40 bg-primary/5 p-4">
        <p className="text-sm">
          <b>First time?</b> Review finger placement before you start typing.{" "}
          <Link
            to="/typing-start-guide"
            className="font-semibold text-primary underline underline-offset-2"
          >
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
    </div>
  );
}
