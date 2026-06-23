import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navLinkClass = (variant: "default" | "outline" = "default", extra?: string) =>
  cn(
    buttonVariants({ variant, size: "lg" }),
    "min-h-11 h-auto whitespace-normal break-words py-3 text-center",
    extra,
  );

export const Route = createFileRoute("/study-corner/quiz-result")({
  head: () => ({
    meta: [{ title: "अभ्यास परिणाम — पुस्तकालय / Library" }],
  }),
  component: QuizResult,
});

function QuizResult() {
  return (
    <PageShell>
      <div className="mx-auto max-w-lg space-y-6 font-hindi text-center">
        <PageHeader
          title="अभ्यास पूरा हुआ"
          subtitle="यह एक सरल उदाहरण पृष्ठ है। भविष्य में यहाँ आपके अभ्यास के अंक दिख सकते हैं।"
          accent="hindi"
        />

        <Card className="border-success/30 bg-success/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">अत्यधिक अच्छा प्रयास!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-base text-muted-foreground">
            <p>अभी Phase 1 में पूर्ण क्विज़ इंजन नहीं है।</p>
            <p>अध्याय पढ़कर प्रश्नों के उत्तर खुद जांचें।</p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/study-corner" className={navLinkClass("default")}>
            पुस्तकालय / Library
          </Link>
          <Link
            to="/study-corner/general-awareness/chapter-1"
            className={navLinkClass("outline")}
          >
            फिर से पढ़ें
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
