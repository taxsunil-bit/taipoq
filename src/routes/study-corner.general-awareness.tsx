import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GA_COURSE } from "@/content/studyCornerContent";

export const Route = createFileRoute("/study-corner/general-awareness")({
  head: () => ({
    meta: [
      { title: "सामान्य जागरूकता / General Awareness — पुस्तकालय / Library" },
      {
        name: "description",
        content: "सामान्य जागरूकता कोर्स — नौकरी परीक्षा की आरम्भिक तैयारी।",
      },
    ],
  }),
  component: GeneralAwarenessCourse,
});

function GeneralAwarenessCourse() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 font-hindi">
        <PageHeader title={GA_COURSE.title} subtitle={GA_COURSE.subtitle} accent="hindi" />

        <Button asChild variant="outline" size="lg" className="min-h-11">
          <Link to="/study-corner">← पुस्तकालय / Library</Link>
        </Button>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold">कोर्स परिचय</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-muted-foreground">{GA_COURSE.intro}</p>
          </CardContent>
        </Card>

        <section aria-labelledby="ga-chapters-heading">
          <h2 id="ga-chapters-heading" className="mb-4 text-xl font-bold text-foreground">
            अध्याय सूची
          </h2>
          <ul className="space-y-3">
            {GA_COURSE.chapters.map((ch, index) => (
              <li key={ch.id}>
                <Card className="border-border bg-card/80">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">अध्याय {index + 1}</p>
                      <p className="mt-1 text-base font-semibold leading-snug text-foreground md:text-lg">
                        {ch.title}
                      </p>
                      {ch.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                          {ch.description}
                        </p>
                      )}
                    </div>
                    <Button asChild size="lg" className="min-h-11 shrink-0">
                      <Link to={ch.href}>{ch.buttonLabel}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
