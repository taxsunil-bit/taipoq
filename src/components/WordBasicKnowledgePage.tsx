import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WORD_BASICS_META,
  WORD_CHAPTER_CARDS,
  WORD_CHAPTERS,
  WORD_FINAL_PROJECT,
  WORD_MCQS,
  WORD_NEXT_PRACTICE,
  WORD_SHORTCUTS,
  type WordTable,
} from "@/content/wordBasicKnowledgeContent";
import { cn } from "@/lib/utils";

const navLinkClass = (variant: "default" | "outline" = "default", extra?: string) =>
  cn(
    buttonVariants({ variant, size: "lg" }),
    "min-h-11 h-auto touch-manipulation whitespace-normal break-words py-3 text-center",
    extra,
  );

const tocPillClass =
  "inline-flex min-h-10 shrink-0 touch-manipulation items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium leading-snug text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10";

function DataTable({ table }: { table: WordTable }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-border [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[260px] border-collapse text-left text-sm">
        {table.caption && (
          <caption className="caption-top px-3 pb-2 pt-1 text-left text-sm font-medium leading-relaxed text-foreground">
            {table.caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {table.headers.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-3 py-2.5 text-sm font-semibold text-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0 even:bg-muted/20">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="whitespace-nowrap px-3 py-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoBox({
  title,
  children,
  variant = "primary",
}: {
  title: string;
  children: ReactNode;
  variant?: "primary" | "practice" | "muted";
}) {
  const styles = {
    primary: "border-primary/25 bg-primary/5",
    practice: "border-amber-600/20 bg-amber-500/5 dark:border-amber-500/25 dark:bg-amber-500/5",
    muted: "border-border bg-muted/30",
  };
  return (
    <div className={cn("rounded-xl border p-4 md:p-5", styles[variant])}>
      <h3 className="mb-3 text-base font-bold leading-snug text-foreground md:text-lg">{title}</h3>
      {children}
    </div>
  );
}

function ChapterJumpNav() {
  return (
    <nav
      aria-label="अध्याय त्वरित नेविगेशन"
      className="rounded-xl border border-border bg-card/70 p-3 md:p-4"
    >
      <p className="mb-2.5 text-sm font-semibold text-foreground md:text-base">त्वरित नेविगेशन</p>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:overflow-visible">
        {WORD_CHAPTER_CARDS.map((card, index) => (
          <a key={card.id} href={`#${card.anchor}`} className={tocPillClass}>
            <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
            <span className="max-w-[9rem] truncate sm:max-w-none">{card.title}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function ChapterSection({
  chapter,
  showMcqs,
  showShortcuts,
  showFinalProject,
}: {
  chapter: (typeof WORD_CHAPTERS)[number];
  showMcqs?: boolean;
  showShortcuts?: boolean;
  showFinalProject?: boolean;
}) {
  return (
    <section
      id={chapter.anchor}
      aria-labelledby={`${chapter.anchor}-heading`}
      className="scroll-mt-20 space-y-5 md:scroll-mt-24 md:space-y-6"
    >
      <div className="space-y-2">
        <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-muted-foreground">
          {chapter.badge}
        </span>
        <h2
          id={`${chapter.anchor}-heading`}
          className="text-xl font-bold leading-snug text-foreground md:text-2xl"
        >
          {chapter.title}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground md:leading-7">
          {chapter.intro}
        </p>
      </div>

      <InfoBox title="Quick Learn" variant="primary">
        <ul className="space-y-2.5 text-base leading-relaxed text-muted-foreground md:leading-7">
          {chapter.quickLearn.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="shrink-0 text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </InfoBox>

      {chapter.body.map((block) => (
        <Card
          key={block.heading ?? block.paragraphs?.[0]?.slice(0, 24)}
          className="border-border bg-card/80"
        >
          <CardContent className="space-y-3 p-4 pt-4 md:p-5 md:pt-5">
            {block.heading && (
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                {block.heading}
              </h3>
            )}
            {block.paragraphs?.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="text-base leading-relaxed text-muted-foreground md:leading-7"
              >
                {p}
              </p>
            ))}
            {block.list && (
              <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground md:leading-7">
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}

      {chapter.table && <DataTable table={chapter.table} />}

      <InfoBox title="Practice Task" variant="practice">
        <ol className="list-decimal space-y-2.5 pl-5 text-base leading-relaxed text-muted-foreground md:leading-7">
          {chapter.practice.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </InfoBox>

      {chapter.revision && chapter.revision.length > 0 && (
        <InfoBox title="Mini Revision" variant="muted">
          <ul className="space-y-2 text-base leading-relaxed text-muted-foreground md:leading-7">
            {chapter.revision.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </InfoBox>
      )}

      {showShortcuts && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold leading-snug text-foreground">MS Word Shortcuts</h3>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[300px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">Shortcut</th>
                  <th className="whitespace-nowrap px-3 py-2.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {WORD_SHORTCUTS.map((row) => (
                  <tr
                    key={row.keys}
                    className="border-b border-border/60 last:border-0 even:bg-muted/20"
                  >
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-sm text-foreground">
                      {row.keys}
                    </td>
                    <td className="px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
                      {row.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showMcqs && (
        <Card id="mcq-practice" className="scroll-mt-20 border-border bg-card/80 md:scroll-mt-24">
          <CardHeader className="space-y-1.5 pb-2">
            <CardTitle className="text-lg font-bold leading-snug md:text-xl">
              MCQ Practice — 15 प्रश्न
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              पहले खुद से उत्तर सोचें, फिर नीचे देखें।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="list-decimal space-y-4 pl-5 text-base leading-relaxed md:leading-7">
              {WORD_MCQS.map((q) => (
                <li key={q.question} className="font-medium text-foreground">
                  {q.question}
                </li>
              ))}
            </ol>
            <div className="space-y-3 border-t border-border pt-5">
              <h3 className="text-base font-semibold text-foreground md:text-lg">उत्तर</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {WORD_MCQS.map((q, i) => (
                  <div
                    key={q.question}
                    className="rounded-lg border border-border bg-muted/30 px-4 py-3.5"
                  >
                    <p className="text-sm font-medium leading-relaxed text-foreground md:text-base">
                      <span className="text-muted-foreground">{i + 1}.</span> {q.question}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showFinalProject && (
        <InfoBox title={WORD_FINAL_PROJECT.title} variant="primary">
          <p className="mb-3 text-base leading-relaxed text-muted-foreground md:leading-7">
            {WORD_FINAL_PROJECT.description}
          </p>
          <ol className="list-decimal space-y-2.5 pl-5 text-base leading-relaxed text-muted-foreground md:leading-7">
            {WORD_FINAL_PROJECT.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </InfoBox>
      )}
    </section>
  );
}

export function WordBasicKnowledgePage() {
  return (
    <PageShell>
      <article className="mx-auto min-w-0 max-w-[56rem] space-y-6 overflow-x-hidden font-hindi md:space-y-8">
        <header className="space-y-3">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-hindi md:text-3xl">
            {WORD_BASICS_META.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base md:leading-7">
            {WORD_BASICS_META.subtitle}
          </p>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {WORD_BASICS_META.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium leading-snug text-muted-foreground sm:px-3 sm:text-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </header>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            to="/study-corner/computer-basics"
            className={navLinkClass(
              "outline",
              "min-h-10 px-4 py-2 text-sm sm:min-h-11 sm:text-base",
            )}
          >
            ← Computer Basics
          </Link>
          <Link
            to="/study-corner"
            className={navLinkClass(
              "outline",
              "min-h-10 px-4 py-2 text-sm sm:min-h-11 sm:text-base",
            )}
          >
            पुस्तकालय / Library
          </Link>
        </div>

        <ChapterJumpNav />

        <section aria-labelledby="word-chapter-cards-heading">
          <h2
            id="word-chapter-cards-heading"
            className="mb-3 text-xl font-bold leading-snug text-foreground md:mb-4 md:text-2xl"
          >
            अध्याय सूची
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WORD_CHAPTER_CARDS.map((card, index) => (
              <li key={card.id}>
                <Card className="flex h-full flex-col border-border bg-card/80 transition-colors hover:border-primary/40">
                  <CardHeader className="space-y-1.5 p-4 pb-2 md:p-6 md:pb-2">
                    <p className="text-xs font-medium text-muted-foreground md:text-sm">
                      अध्याय {index + 1}
                    </p>
                    <CardTitle className="text-base font-bold leading-snug md:text-lg">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed md:text-base md:leading-7">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-col gap-3 p-4 pt-0 md:p-6 md:pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] leading-snug text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`#${card.anchor}`}
                      className={navLinkClass("default", "min-h-12 w-full touch-manipulation")}
                    >
                      पढ़ना आरम्भ करें
                    </a>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-14 border-t border-border pt-8 md:space-y-16 md:pt-10">
          {WORD_CHAPTERS.map((chapter) => (
            <ChapterSection
              key={chapter.anchor}
              chapter={chapter}
              showMcqs={chapter.anchor === "chapter-8"}
              showShortcuts={chapter.anchor === "chapter-8"}
              showFinalProject={chapter.anchor === "chapter-8"}
            />
          ))}
        </div>

        <Card className="border-border bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold leading-snug md:text-xl">
              Next Practice Suggestion
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              अगला अभ्यास चुनें और दोहराएँ।
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {WORD_NEXT_PRACTICE.map((item) => (
              <a
                key={item.label}
                href={`#${item.anchor === "chapter-8" && item.label.includes("MCQ") ? "mcq-practice" : item.anchor}`}
                className={navLinkClass(
                  "outline",
                  "min-h-12 flex-1 touch-manipulation sm:min-w-[10rem]",
                )}
              >
                {item.label}
              </a>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 pb-6">
          <Link
            to="/study-corner/computer-basics"
            className={navLinkClass("default", "min-h-12 w-full touch-manipulation sm:w-auto")}
          >
            ← Computer Basics पर वापस जाएँ
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
