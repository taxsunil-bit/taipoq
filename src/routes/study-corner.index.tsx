import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STUDY_CORNER_LANDING, STUDY_COURSES } from "@/content/studyCornerContent";
import { cn } from "@/lib/utils";

const navLinkClass = (extra?: string) =>
  cn(
    buttonVariants({ size: "lg" }),
    "min-h-11 h-auto whitespace-normal break-words py-3 text-center",
    extra,
  );

export const Route = createFileRoute("/study-corner/")({
  head: () => ({
    meta: [
      { title: "पुस्तकालय / Library — TAIPOQ" },
      {
        name: "description",
        content:
          "टाइपिंग के साथ सामान्य जागरूकता / General Awareness और कम्प्यूटर ज्ञान की तैयारी।",
      },
    ],
  }),
  component: StudyCornerLanding,
});

function StudyCornerLanding() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8 font-hindi">
        <PageHeader
          title={STUDY_CORNER_LANDING.title}
          subtitle={STUDY_CORNER_LANDING.subtitle}
          accent="hindi"
        />

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {STUDY_CORNER_LANDING.heroText}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {STUDY_COURSES.map((course) => (
            <Card
              key={course.id}
              className={
                course.available
                  ? "border-border bg-card/80 transition-colors hover:border-primary/40"
                  : "border-border/60 bg-card/40"
              }
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold leading-snug md:text-xl">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.available && course.href ? (
                  <Link to={course.href} className={navLinkClass("w-full sm:w-auto")}>
                    {course.startLabel}
                  </Link>
                ) : (
                  <Button
                    disabled
                    size="lg"
                    className="min-h-11 w-full sm:w-auto"
                    variant="secondary"
                  >
                    {course.startLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {STUDY_CORNER_LANDING.howToRead.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-muted-foreground">
              {STUDY_CORNER_LANDING.howToRead.text}
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
