import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/hindi/")({
  head: () => ({ meta: [{ title: "Hindi Typing — TAIPOQ" }] }),
  component: HindiHub,
});

const modes = [
  { title: "Hindi KrutiDev / Remington Typing", badge: "Active · Recommended", badgeVariant: "default" as const, desc: "Type English keys on a standard keyboard — text appears as Devanagari using the KrutiDev 010 font. Used in most Hindi typing tests and traditional Hindi typing exams.", btn: "Start KrutiDev Typing", mode: "Remington" as const, active: true },
  { title: "Hindi Unicode / Mangal / InScript", badge: "Coming Soon", badgeVariant: "secondary" as const, desc: "InScript keyboard layout for MS Word, PDF, websites and modern Unicode Hindi typing.", btn: "Coming Soon", mode: "Unicode" as const, active: false },
  { title: "Hindi Phonetic Practice", badge: "Coming Soon", badgeVariant: "outline" as const, desc: "Easy phonetic Hindi typing for beginners.", btn: "Coming Soon", mode: "Phonetic" as const, active: false },
];

const subCards = [
  { title: "Hindi Lessons", desc: "Structured Hindi lessons from स्वर to कानूनी हिंदी.", btn: "Open Lessons", to: "/hindi/lessons" as const },
  { title: "Hindi Practice", desc: "Type words, sentences, and paragraphs in Hindi.", btn: "Start Practice", to: "/hindi/practice" as const },
  { title: "Hindi Typing Test", desc: "Take timed Hindi typing tests.", btn: "Take Test", to: "/test" as const },
  { title: "Hindi Progress", desc: "Track your Hindi speed and accuracy.", btn: "View Progress", to: "/progress" as const },
];

function HindiHub() {
  return (
    <PageShell>
      <PageHeader title="Hindi Typing" subtitle="हिंदी टाइपिंग सीखें, अभ्यास करें और परीक्षा दें।" accent="hindi" />

      <h2 className="mb-3 text-lg font-semibold">Choose Hindi Mode</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {modes.map((m) => (
          <Card key={m.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2"><Badge variant={m.badgeVariant}>{m.badge}</Badge></div>
              <CardTitle className="text-lg">{m.title}</CardTitle>
              <CardDescription>{m.desc}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              {m.active ? (
                <Button asChild className="w-full bg-hindi text-hindi-foreground hover:bg-hindi/90">
                  <Link to="/hindi/practice" search={{ mode: m.mode }}>{m.btn}</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/hindi/practice" search={{ mode: m.mode }}>{m.btn}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 mb-3 text-lg font-semibold">Hindi Modules</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {subCards.map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline"><Link to={c.to}>{c.btn}</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
