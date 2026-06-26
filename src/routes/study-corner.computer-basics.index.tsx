import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXCEL_BASICS_MODULE } from "@/content/excelBasicKnowledgeContent";
import { CB_COURSE } from "@/content/studyCornerContent";
import { cn } from "@/lib/utils";

const navLinkClass = (variant: "default" | "outline" = "default", extra?: string) =>
  cn(
    buttonVariants({ variant, size: "lg" }),
    "min-h-11 h-auto whitespace-normal break-words py-3 text-center",
    extra,
  );

export const Route = createFileRoute("/study-corner/computer-basics/")({
  head: () => ({
    meta: [
      {
        title: "कम्प्यूटर का मूलभूत ज्ञान / Computer Basics — पुस्तकालय / Library",
      },
      {
        name: "description",
        content:
          "कम्प्यूटर, Hardware, Software, Input, Output, Memory, Storage, Internet और Email की मूलभूत तैयारी।",
      },
    ],
  }),
  component: ComputerBasicsCourse,
});

function ComputerBasicsCourse() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 font-hindi">
        <PageHeader title={CB_COURSE.title} subtitle={CB_COURSE.subtitle} accent="hindi" />

        <div className="flex flex-wrap gap-3">
          <Link to="/study-corner" className={navLinkClass("outline")}>
            ← पुस्तकालय / Library
          </Link>
          <Link to={CB_COURSE.firstChapterHref} className={navLinkClass("default")}>
            {CB_COURSE.firstChapterButtonLabel}
          </Link>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold">कोर्स परिचय</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-muted-foreground">{CB_COURSE.intro}</p>
          </CardContent>
        </Card>

        <section aria-labelledby="cb-chapters-heading">
          <h2 id="cb-chapters-heading" className="mb-4 text-xl font-bold text-foreground">
            अध्याय सूची
          </h2>
          <ul className="space-y-3">
            {CB_COURSE.chapters.map((ch, index) => (
              <li key={ch.id}>
                <Card className="border-border bg-card/80">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">अध्याय {index + 1}</p>
                      <p className="mt-1 text-base font-semibold leading-snug text-foreground md:text-lg">
                        {ch.title}
                      </p>
                    </div>
                    {ch.available && "href" in ch ? (
                      <Link to={ch.href} className={navLinkClass("default", "shrink-0")}>
                        {ch.buttonLabel}
                      </Link>
                    ) : (
                      <Button disabled size="lg" variant="secondary" className="min-h-11 shrink-0">
                        {ch.buttonLabel}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cb-excel-module-heading">
          <h2 id="cb-excel-module-heading" className="mb-4 text-xl font-bold text-foreground">
            विशेष Module
          </h2>
          <Card className="border-primary/30 bg-primary/5 transition-colors hover:border-primary/50">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{EXCEL_BASICS_MODULE.titleHindi}</p>
                <p className="mt-1 text-base font-semibold leading-snug text-foreground md:text-lg">
                  {EXCEL_BASICS_MODULE.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {EXCEL_BASICS_MODULE.description}
                </p>
              </div>
              <Link to={EXCEL_BASICS_MODULE.href} className={navLinkClass("default", "shrink-0")}>
                {EXCEL_BASICS_MODULE.buttonLabel}
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
