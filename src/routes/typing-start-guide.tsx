import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/typing-start-guide")({
  head: () => ({
    meta: [
      { title: "Typing Start Guide — TAIPOQ" },
      { name: "description", content: "Finger placement, home row, F/J bump, and posture basics before you start typing practice." },
      { property: "og:title", content: "Typing Start Guide — TAIPOQ" },
      { property: "og:url", content: "/typing-start-guide" },
    ],
    links: [{ rel: "canonical", href: "/typing-start-guide" }],
  }),
  component: GuidePage,
});

type KeyCell = { label: string; finger?: string; bump?: boolean; highlight?: "left" | "right" | "thumb" };

const HOME_ROW: KeyCell[] = [
  { label: "A", finger: "Left Little", highlight: "left" },
  { label: "S", finger: "Left Ring", highlight: "left" },
  { label: "D", finger: "Left Middle", highlight: "left" },
  { label: "F", finger: "Left Index", highlight: "left", bump: true },
  { label: "G", finger: "Left Index (stretch)" },
  { label: "H", finger: "Right Index (stretch)" },
  { label: "J", finger: "Right Index", highlight: "right", bump: true },
  { label: "K", finger: "Right Middle", highlight: "right" },
  { label: "L", finger: "Right Ring", highlight: "right" },
  { label: ";", finger: "Right Little", highlight: "right" },
];

function GuidePage() {
  return (
    <PageShell>
      <PageHeader
        title="Typing shuru karne se pahle"
        subtitle="Pehle fingers sahi position par rakho — phir speed apne aap aayegi."
      />

      {/* Home Row visual */}
      <Card>
        <CardHeader>
          <CardTitle>Home Row — Fingers ki shuruaati position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <div className="flex min-w-max items-end gap-2">
              {HOME_ROW.map((k) => (
                <div key={k.label} className="flex flex-col items-center">
                  <div
                    className={`relative grid h-16 w-14 place-items-center rounded-lg border-2 font-mono text-xl font-bold shadow-sm ${
                      k.highlight === "left"
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : k.highlight === "right"
                        ? "border-amber-500/50 bg-amber-500/10 text-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {k.label}
                    {k.bump && (
                      <span className="absolute bottom-1 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div className="mt-1 max-w-[3.5rem] text-center text-[10px] leading-tight text-muted-foreground">
                    {k.finger}
                  </div>
                </div>
              ))}
            </div>
            {/* Spacebar */}
            <div className="mt-4 flex flex-col items-center">
              <div className="grid h-12 w-full max-w-md place-items-center rounded-lg border-2 border-success/50 bg-success/10 font-mono text-sm font-semibold">
                S P A C E B A R
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">Dono Thumbs (Left + Right)</div>
            </div>
          </div>

          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold">F aur J par chhote bumps (dots) hote hain</p>
            <p className="mt-1 text-muted-foreground">
              Apni aankhein band karke bhi <b>F</b> aur <b>J</b> keys ko ungli se mehsoos kar sakte ho.
              Left index finger <b>F</b> par, Right index finger <b>J</b> par. Baaki fingers apne aap
              A S D aur K L ; par baith jaate hain. Dono thumbs <b>Spacebar</b> par.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-primary/5 p-4">
              <h4 className="font-semibold">Left Hand</h4>
              <ul className="mt-2 space-y-1 font-mono text-sm">
                <li>A — Little finger</li>
                <li>S — Ring finger</li>
                <li>D — Middle finger</li>
                <li>F — Index finger (bump)</li>
              </ul>
            </div>
            <div className="rounded-md bg-amber-500/10 p-4">
              <h4 className="font-semibold">Right Hand</h4>
              <ul className="mt-2 space-y-1 font-mono text-sm">
                <li>J — Index finger (bump)</li>
                <li>K — Middle finger</li>
                <li>L — Ring finger</li>
                <li>; — Little finger</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posture */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Posture Tips — Baithne ka sahi tareeka</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            <li className="rounded-md border bg-card p-3">Back seedhi rakho.</li>
            <li className="rounded-md border bg-card p-3">Shoulders relaxed rakho — uthao mat.</li>
            <li className="rounded-md border bg-card p-3">Wrists straight rakho — neeche mat jhukao.</li>
            <li className="rounded-md border bg-card p-3">Screen eye-level par rakho.</li>
            <li className="rounded-md border bg-card p-3 md:col-span-2">Keyboard apne body ke center mein rakho.</li>
          </ul>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild size="lg" className="sm:flex-1">
          <Link to="/english/practice">Start English Practice →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/test">Go to Speed Test</Link>
        </Button>
      </div>
    </PageShell>
  );
}
