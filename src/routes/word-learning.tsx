import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/word-learning")({
  head: () => ({
    meta: [
      { title: "शब्द अभ्यास / Word Learning — TAIPOQ" },
      {
        name: "description",
        content: "English typing और Hindi typing के लिए उपयोगी शब्दों का अभ्यास।",
      },
    ],
  }),
  component: WordLearningHub,
});

function WordLearningHub() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHeader
          title="शब्द अभ्यास / Word Learning"
          subtitle="English typing और Hindi typing के लिए उपयोगी शब्दों का अभ्यास।"
          accent="hindi"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border bg-card/80 transition-colors hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold">English Words Practice</CardTitle>
              <CardDescription>Common English words for typing practice.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="min-h-11 w-full bg-english text-english-foreground hover:bg-english/90 sm:w-auto">
                <Link to="/english/practice" search={{ lesson: "words" }}>
                  अभ्यास आरम्भ करें
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 transition-colors hover:border-amber-500/40">
            <CardHeader>
              <CardTitle className="font-hindi text-lg font-bold">Hindi शब्द अभ्यास</CardTitle>
              <CardDescription className="font-hindi">
                KrutiDev / Remington Hindi typing के लिए सामान्य शब्द।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="min-h-11 w-full bg-hindi text-hindi-foreground hover:bg-hindi/90 sm:w-auto">
                <Link to="/hindi/practice" search={{ lesson: "shabd", mode: "Remington" }}>
                  अभ्यास आरम्भ करें
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
