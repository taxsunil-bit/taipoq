import { createFileRoute, Link } from "@tanstack/react-router";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TAIPOQ — English & Hindi Typing Practice for Job Preparation" },
      { name: "description", content: "Practice daily. Track your progress. Build job-ready English and Hindi typing speed and accuracy." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-3">
        {/* Hero — 2x2 */}
        <section className="bento-tile bento-tile-hover group relative overflow-hidden p-8 md:col-span-2 md:row-span-2 md:p-10">
          <div className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[14rem] font-bold leading-none text-foreground/[0.04] transition-opacity group-hover:text-foreground/[0.08]">
            T
          </div>
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <div className="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                T
              </div>
              <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tighter md:text-7xl">
                TAIPOQ
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                Master precision and speed. The smart English & Hindi typing tutor
                designed for students, clerks, advocates, and high-performance typists.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                v1.0 · Prototype
              </span>
              <Link
                to="/progress"
                className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                View Progress
              </Link>
              <Link
                to="/typing-start-guide"
                className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-primary underline-offset-2 hover:underline"
              >
                First time? Learn finger placement
              </Link>
            </div>
          </div>
        </section>

        {/* English Path — wide */}
        <Link
          to="/english"
          className="bento-tile group relative flex flex-col justify-between overflow-hidden p-8 transition-all hover:ring-4 hover:ring-primary/15 md:col-span-2"
          style={{ background: "linear-gradient(135deg, oklch(0.5 0.18 260), oklch(0.38 0.16 265))" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/90 backdrop-blur">
                EN · QWERTY
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">English Typing</h2>
            </div>
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm transition-transform group-hover:translate-x-1">
              <Arrow />
            </div>
          </div>
          <div>
            <p className="mb-6 text-white/80">
              Standard QWERTY mastery from basics to professional speed.
            </p>
            <div className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 font-semibold text-[oklch(0.4_0.16_265)] transition-transform active:scale-95">
              Start Session
            </div>
          </div>
        </Link>

        {/* Hindi Path — wide */}
        <Link
          to="/hindi"
          className="bento-tile group relative flex flex-col justify-between overflow-hidden p-8 transition-all hover:ring-4 hover:ring-amber-500/15 md:col-span-2"
          style={{ background: "linear-gradient(135deg, oklch(0.65 0.16 60), oklch(0.5 0.16 45))" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/90 backdrop-blur">
                HI · UNICODE
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                Hindi Typing <span className="font-hindi">हिन्दी</span>
              </h2>
            </div>
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm transition-transform group-hover:translate-x-1">
              <Arrow />
            </div>
          </div>
          <div>
            <p className="mb-6 text-white/85">
              KrutiDev / Remington Hindi typing now. Unicode and Phonetic modes coming soon.
            </p>
            <div className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 font-hindi font-semibold text-[oklch(0.4_0.16_45)] transition-transform active:scale-95">
              शुरू करें
            </div>
          </div>
        </Link>

        {/* Speed Test tile */}
        <Link
          to="/test"
          className="bento-tile bento-tile-hover group flex flex-col items-center justify-center p-6 text-center md:col-span-1"
        >
          <div className="mb-4 rounded-full bg-surface-hover p-4 transition-colors group-hover:bg-accent">
            <svg className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display font-bold">Take Speed Test</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get certified in 5 min</p>
        </Link>

        {/* Honest value prop — single tile */}
        <div className="bento-tile flex flex-col justify-between p-6 md:col-span-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily Practice</span>
          <div className="mt-4">
            <div className="font-display text-2xl font-bold leading-tight">Practice daily.</div>
            <p className="mt-2 text-xs text-muted-foreground">Improve speed and accuracy over time.</p>
          </div>
        </div>

        {/* Honest message block — replaces fake live preview */}
        <div className="bento-tile p-6 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              What TAIPOQ helps you do
            </span>
            <Link to="/typing-start-guide" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">
              Start Guide →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="rounded-md border bg-card/40 p-3 text-sm"><b>Track your progress</b> — every test is saved locally.</li>
            <li className="rounded-md border bg-card/40 p-3 text-sm"><b>Improve speed and accuracy</b> with timed practice.</li>
            <li className="rounded-md border bg-card/40 p-3 text-sm"><b>Build job-ready typing skill</b> for RRB, SSC, DSSSB.</li>
            <li className="rounded-md border bg-card/40 p-3 text-sm"><b>Learn finger placement</b> before you race the clock.</li>
          </ul>
        </div>


        {/* Feature micro-tiles 2x2 */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {FEATURES.map((f) => (
            <div key={f.label} className="bento-tile flex items-center gap-3 p-4 transition-colors hover:bg-surface-hover">
              <div className={`grid h-9 w-9 place-items-center rounded-lg ${f.bg} ${f.fg} text-lg`}>{f.icon}</div>
              <div className="text-sm font-semibold">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      <JobTypingSpeedGuide variant="compact" />

      {/* Secondary nav strip */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {SECONDARY.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="bento-tile bento-tile-hover flex items-center justify-between px-5 py-4 text-sm"
          >
            <span className="font-medium">{s.label}</span>
            <span className="font-mono text-xs text-muted-foreground">→</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

function Arrow() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}

const FEATURES = [
  { label: "Real-time WPM", icon: "⚡", bg: "bg-primary/10", fg: "text-primary" },
  { label: "Certificates", icon: "◆", bg: "bg-fuchsia-500/10", fg: "text-fuchsia-400" },
  { label: "Unicode Core", icon: "अ", bg: "bg-amber-500/10", fg: "text-amber-400 font-hindi" },
  { label: "Progress History", icon: "↗", bg: "bg-success/10", fg: "text-success" },
] as const;

const SECONDARY = [
  { to: "/english/lessons" as const, label: "English Lessons" },
  { to: "/hindi/lessons" as const, label: "Hindi Lessons" },
  { to: "/progress" as const, label: "My Progress" },
  { to: "/certificate" as const, label: "Certificate" },
];
