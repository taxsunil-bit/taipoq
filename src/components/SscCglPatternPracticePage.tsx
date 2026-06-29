import { Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SSC_CGL_PATTERN_PRACTICE_META,
  sscCglPatternPracticeSubjects,
  type SscCglPracticeQuestion,
} from "@/content/sscCglPatternPracticeContent";
import { cn } from "@/lib/utils";

const navLinkClass = (variant: "default" | "outline" = "outline", extra?: string) =>
  cn(
    buttonVariants({ variant, size: "lg" }),
    "min-h-11 h-auto touch-manipulation whitespace-normal break-words py-3 text-center",
    extra,
  );

function difficultyClass(difficulty: SscCglPracticeQuestion["difficulty"]) {
  switch (difficulty) {
    case "Easy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "Hard":
      return "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300";
    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300";
  }
}

function SubjectJumpNav() {
  return (
    <nav aria-label="Jump to subject sections" className="flex flex-wrap gap-2">
      {SSC_CGL_PATTERN_PRACTICE_META.subjectJumps.map((item) => (
        <a
          key={item.slug}
          href={`#${item.slug}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-10 touch-manipulation px-4 text-sm font-semibold",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function SubjectSummaryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sscCglPatternPracticeSubjects.map((subject) => (
        <Card key={subject.slug} className="border-border bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold leading-snug md:text-lg">
              {subject.title}
            </CardTitle>
            <CardDescription className="text-sm">{subject.hindiTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">25 questions</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PracticeQuestionCard({ q }: { q: SscCglPracticeQuestion }) {
  return (
    <Card className="border-border/80 bg-card/90">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            Q{q.questionNumber}
          </span>
          <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {q.chapter}
          </span>
          <span
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-semibold",
              difficultyClass(q.difficulty),
            )}
          >
            {q.difficulty}
          </span>
        </div>
        <CardTitle className="text-base font-semibold leading-relaxed text-foreground md:text-lg">
          {q.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed md:text-base">
        <ul className="space-y-2">
          {q.options.map((opt) => (
            <li
              key={opt.label}
              className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-foreground"
            >
              <span className="mr-2 font-bold text-primary">{opt.label}.</span>
              {opt.text}
            </li>
          ))}
        </ul>

        <div className="space-y-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p>
            <span className="font-semibold text-foreground">Answer: </span>
            <span className="text-foreground">{q.answer}</span>
          </p>
          <p>
            <span className="font-semibold text-foreground">Explanation: </span>
            <span className="text-muted-foreground">{q.explanation}</span>
          </p>
          {q.shortcut ? (
            <p>
              <span className="font-semibold text-foreground">Shortcut / Trick: </span>
              <span className="text-muted-foreground">{q.shortcut}</span>
            </p>
          ) : null}
          {q.commonMistake ? (
            <p>
              <span className="font-semibold text-foreground">Common mistake: </span>
              <span className="text-muted-foreground">{q.commonMistake}</span>
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function SscCglPatternPracticePage() {
  const meta = SSC_CGL_PATTERN_PRACTICE_META;

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8 pb-10">
        <div className="flex flex-wrap gap-3">
          <Link to="/study-corner" className={navLinkClass("outline", "w-full sm:w-auto")}>
            ← पुस्तकालय / Library
          </Link>
        </div>

        <PageHeader title={meta.title} subtitle={meta.subtitle} accent="english" />

        <SubjectJumpNav />

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground md:text-lg">
              Important notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {meta.notice}
            </p>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground md:text-xl">Subject overview</h2>
          <SubjectSummaryCards />
        </section>

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{meta.howToUse.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-muted-foreground">{meta.howToUse.text}</p>
          </CardContent>
        </Card>

        {sscCglPatternPracticeSubjects.map((subject) => (
          <section key={subject.slug} id={subject.slug} className="scroll-mt-20 space-y-4">
            <div className="space-y-2 border-b border-border pb-4">
              <h2 className="text-xl font-bold leading-snug text-foreground md:text-2xl">
                {subject.title}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">{subject.hindiTitle}</p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {subject.description}
              </p>
              <p className="text-sm font-semibold text-primary">25 questions</p>
            </div>

            <div className="space-y-4">
              {subject.questions.map((q) => (
                <PracticeQuestionCard key={q.id} q={q} />
              ))}
            </div>
          </section>
        ))}

        <Card className="border-border bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Content policy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              {meta.contentPolicy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
