import { Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyChapter } from "@/content/studyCornerContent";

type StudyChapterPageProps = {
  chapter: StudyChapter;
};

const chapterNavButtonClass =
  "min-h-11 h-auto whitespace-normal break-words py-3 text-center";

function SectionList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-border bg-surface/50 px-4 py-3 text-base text-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ReadingPlanCards({ plan }: { plan: NonNullable<StudyChapter["readingPlan"]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {plan.map((item) => (
        <div key={item.day} className="rounded-lg border border-border bg-surface/50 p-4">
          <p className="text-sm font-medium text-primary">{item.day}</p>
          <p className="mt-1 text-base text-foreground">{item.topic}</p>
        </div>
      ))}
    </div>
  );
}

export function StudyChapterPage({ chapter }: StudyChapterPageProps) {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 font-hindi">
        <div className="mb-2">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-muted-foreground">
            {chapter.chapterLabel}
          </span>
        </div>

        <PageHeader title={chapter.title} subtitle={chapter.intro} accent="hindi" />

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg" className={chapterNavButtonClass}>
            <Link to={chapter.backTo}>{chapter.backLabel}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className={chapterNavButtonClass}>
            <Link to="/study-corner">पुस्तकालय / Library</Link>
          </Button>
        </div>

        {chapter.sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <Card className="border-border bg-card/80">
              <CardHeader>
                <CardTitle className="font-hindi text-lg font-bold leading-snug md:text-xl">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
                {section.subsections?.map((sub) => (
                  <div
                    key={sub.subtitle}
                    className="rounded-lg border border-border/60 bg-surface/40 p-4"
                  >
                    {sub.subtitle && (
                      <h3 className="mb-2 font-semibold text-foreground">{sub.subtitle}</h3>
                    )}
                    {sub.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </div>
                ))}
                {section.list && section.title === "इसमें कौन-कौन से विषय आते हैं?" ? (
                  <SectionList items={section.list} />
                ) : section.list ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>

            {section.title === "इसे कैसे पढ़ें?" && chapter.readingPlan && (
              <ReadingPlanCards plan={chapter.readingPlan} />
            )}
          </div>
        ))}

        {chapter.motivationalNote && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-base leading-relaxed text-amber-100">
            {chapter.motivationalNote}
          </p>
        )}

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="font-hindi text-lg font-bold md:text-xl">अभ्यास के प्रश्न</CardTitle>
            <p className="text-base text-muted-foreground">
              पहले खुद से सोचें, फिर नीचे उत्तर पढ़ें।
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal space-y-4 pl-5 text-base leading-relaxed">
              {chapter.questions.map((q) => (
                <li key={q.question} className="font-medium text-foreground">
                  {q.question}
                </li>
              ))}
            </ol>

            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="text-base font-semibold text-foreground">उत्तर</h3>
              {chapter.questions.map((q, i) => (
                <div
                  key={q.question}
                  className="rounded-lg border border-border bg-card/60 px-4 py-3 text-base"
                >
                  <p className="font-medium text-foreground">
                    {i + 1}. {q.question}
                  </p>
                  <p className="mt-1 text-muted-foreground">{q.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {chapter.chapterNav && (
          <Card className="border-border bg-card/80">
            <CardHeader>
              <CardTitle className="font-hindi text-lg font-bold">अगला / पिछला अध्याय</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              {chapter.chapterNav.prev ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`${chapterNavButtonClass} flex-1`}
                >
                  <Link to={chapter.chapterNav.prev.href}>{chapter.chapterNav.prev.label}</Link>
                </Button>
              ) : (
                <div className="flex-1" />
              )}
              {chapter.chapterNav.next ? (
                <Button asChild size="lg" className={`${chapterNavButtonClass} flex-1`}>
                  <Link to={chapter.chapterNav.next.href}>{chapter.chapterNav.next.label}</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}

        {chapter.nextStep && (
          <Card className="border-border bg-card/80">
            <CardHeader>
              <CardTitle className="font-hindi text-lg font-bold">
                {chapter.nextStep.title}
              </CardTitle>
              <p className="text-base leading-relaxed text-muted-foreground">
                {chapter.nextStep.text}
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className={`${chapterNavButtonClass} w-full sm:w-auto`}>
                <Link to={chapter.nextStep.href}>{chapter.nextStep.buttonLabel}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
