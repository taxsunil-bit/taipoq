import { createFileRoute, Link } from "@tanstack/react-router";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { PageShell } from "@/components/PageShell";
import { STUDY_CORNER_LANDING } from "@/content/studyCornerContent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TAIPOQ — English & Hindi Typing Practice for Job Preparation" },
      {
        name: "description",
        content:
          "Practice daily. Track your progress. Build job-ready English and Hindi typing speed and accuracy.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      <HomeMobile />
      <HomeDesktop />
    </PageShell>
  );
}

function HomeMobile() {
  return (
    <div className="space-y-4 overflow-x-hidden md:hidden">
      {/* Hero */}
      <section className="bento-tile p-5">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
          T
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">TAIPOQ</h1>
        <p className="mt-2 text-base font-medium leading-snug text-foreground">
          Free Typing Practice for Govt Job Aspirants
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          English + Hindi Typing | Speed Test | Lessons
        </p>
      </section>

      {/* Primary actions */}
      <section className="space-y-3" aria-label="Primary actions">
        <Link to="/english" className={cn(MOBILE_BTN, "bg-primary text-primary-foreground shadow-sm")}>
          Start English Practice
        </Link>
        <Link
          to="/hindi"
          className={cn(
            MOBILE_BTN,
            "border border-amber-500/40 bg-amber-500/15 font-hindi text-amber-900 dark:text-amber-100",
          )}
        >
          Start Hindi Practice
        </Link>
        <Link to="/typing-start-guide" className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}>
          Learn Finger Placement
        </Link>
      </section>

      {/* Using phone? */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
        <h2 className="text-base font-semibold text-foreground">Using phone?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Real typing exam practice is best on a computer keyboard. On phone, use TAIPOQ for lessons,
          keyboard layout, passages and preparation.
        </p>
      </section>

      {/* How to use TAIPOQ — mobile onboarding */}
      <section className="bento-tile space-y-3 p-5 font-hindi" aria-labelledby="mobile-onboarding-heading">
        <h2 id="mobile-onboarding-heading" className="text-lg font-bold text-foreground">
          TAIPOQ कैसे उपयोग करें?
        </h2>
        <ol className="space-y-2">
          {ONBOARDING_STEPS.map((item) => (
            <li key={item.step}>
              {"choices" in item ? (
                <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                      aria-hidden="true"
                    >
                      {item.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold leading-snug text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.subtext}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {item.choices.map((choice) => (
                          <Link
                            key={choice.to}
                            to={choice.to}
                            search={"search" in choice ? choice.search : undefined}
                            className={cn(
                              MOBILE_BTN,
                              "px-3 text-sm",
                              choice.variant === "hindi"
                                ? "border border-amber-500/40 bg-amber-500/15 font-hindi text-amber-900 dark:text-amber-100"
                                : "bg-primary text-primary-foreground",
                            )}
                          >
                            {choice.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to={item.to}
                  className="flex min-h-11 items-start gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3 transition-colors active:bg-surface-hover"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-snug text-foreground">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {item.subtext}
                    </span>
                  </span>
                  <span className="shrink-0 pt-1 text-muted-foreground" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* English practice card */}
      <Link
        to="/english"
        className="bento-tile flex flex-col gap-3 p-5"
        style={{ background: "linear-gradient(135deg, oklch(0.5 0.18 260), oklch(0.38 0.16 265))" }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">EN · QWERTY</p>
          <h2 className="mt-1 font-display text-xl font-bold text-white">English Typing</h2>
          <p className="mt-2 text-sm text-white/85">Lessons, passages and Mobile Learning Mode.</p>
        </div>
        <span className={cn(MOBILE_BTN, "bg-white text-[oklch(0.4_0.16_265)]")}>Practice Passage</span>
      </Link>

      {/* Hindi practice card */}
      <Link
        to="/hindi"
        className="bento-tile flex flex-col gap-3 p-5"
        style={{ background: "linear-gradient(135deg, oklch(0.65 0.16 60), oklch(0.5 0.16 45))" }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">HI · KrutiDev</p>
          <h2 className="mt-1 font-display text-xl font-bold text-white">
            Hindi Typing <span className="font-hindi">हिन्दी</span>
          </h2>
          <p className="mt-2 text-sm text-white/85">Remington layout lessons and passage practice.</p>
        </div>
        <span className={cn(MOBILE_BTN, "bg-white font-hindi text-[oklch(0.4_0.16_45)]")}>अभ्यास आरम्भ करें</span>
      </Link>

      {/* Library — prominent */}
      <section className="bento-tile space-y-4 p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Mobile Learning Mode</p>
          <h2 className="mt-1 font-display text-xl font-bold">Learn before speed test</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Speed test के पहले keyboard layout, typing rules और exam targets समझें।
          </p>
        </div>
        <ul className="space-y-2">
          {LIBRARY_QUICK_LINKS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex min-h-11 items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm font-medium"
              >
                <span>{item.label}</span>
                <span className="text-muted-foreground">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/study-corner" className={cn(MOBILE_BTN, "bg-primary text-primary-foreground")}>
          {STUDY_CORNER_LANDING.homeCard.button}
        </Link>
      </section>

      {/* Speed targets */}
      <JobTypingSpeedGuide variant="compact" testLinkLabel="Desktop Speed Test" />

      {/* Desktop speed test note */}
      <Link
        to="/test"
        className="flex min-h-11 items-center justify-between rounded-xl border border-dashed border-border bg-surface/30 px-4 py-3 text-sm"
      >
        <span>
          <span className="font-medium">Desktop Speed Test</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">Computer keyboard पर WPM test</span>
        </span>
        <span className="text-muted-foreground">→</span>
      </Link>

      {/* Progress & Certificate */}
      <section className="space-y-3">
        <Link
          to="/progress"
          className="bento-tile flex min-h-[3.25rem] items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium">My Progress</span>
          <span className="font-mono text-xs text-muted-foreground">→</span>
        </Link>
        <Link
          to="/certificate"
          className="bento-tile flex min-h-[3.25rem] items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium">Certificate</span>
          <span className="font-mono text-xs text-muted-foreground">→</span>
        </Link>
      </section>
    </div>
  );
}

function HomeDesktop() {
  return (
    <>
      <div className="hidden auto-rows-fr grid-cols-1 gap-4 md:grid md:grid-cols-4 md:grid-rows-3">
        {/* Hero — 2x2 */}
        <section className="bento-tile bento-tile-hover group relative overflow-hidden p-8 md:col-span-2 md:row-span-2 md:p-10">
          <div className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[14rem] font-bold leading-none text-foreground/[0.04] transition-opacity group-hover:text-foreground/[0.08]">
            T
          </div>
          <div className="relative grid h-full gap-8 md:grid-cols-2 md:grid-rows-[1fr_auto] md:items-center md:gap-x-10 md:gap-y-8">
            <div className="md:col-start-1 md:row-start-1">
              <div className="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                T
              </div>
              <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tighter md:text-7xl">
                TAIPOQ
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                Master precision and speed. The smart English & Hindi typing tutor designed for students,
                clerks, advocates, and high-performance typists.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[360px] md:col-start-2 md:row-start-1 md:row-span-2 md:max-w-[420px] md:self-center lg:max-w-[460px]">
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-surface/40 shadow-2xl">
                <img
                  src="/images/tipoq-cyber-youth.png"
                  alt="TAIPOQ cyber youth typing practice visual"
                  className="h-auto w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:col-start-1 md:row-start-2">
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
              आरम्भ करें
            </div>
          </div>
        </Link>

        {/* Word Learning */}
        <Link
          to="/word-learning"
          className="bento-tile bento-tile-hover group relative flex flex-col justify-between overflow-hidden p-6 md:col-span-2 md:p-8"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Word Learning
            </div>
            <h2 className="font-hindi text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              शब्द अभ्यास / Word Learning
            </h2>
            <p className="mt-3 max-w-md font-hindi text-base leading-relaxed text-muted-foreground md:text-lg">
              English typing और Hindi typing के लिए उपयोगी शब्दों का अभ्यास।
            </p>
          </div>
          <div className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 font-hindi text-base font-semibold text-amber-700 transition-transform active:scale-95 dark:text-amber-300 sm:w-auto">
            अभ्यास आरम्भ करें
          </div>
        </Link>

        {/* Library */}
        <Link
          to="/study-corner"
          className="bento-tile bento-tile-hover group relative flex flex-col justify-between overflow-hidden p-6 md:col-span-2 md:p-8"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {STUDY_CORNER_LANDING.homeCard.title}
            </div>
            <h2 className="font-hindi text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {STUDY_CORNER_LANDING.homeCard.title}
            </h2>
            <p className="mt-3 max-w-md font-hindi text-base leading-relaxed text-muted-foreground md:text-lg">
              {STUDY_CORNER_LANDING.homeCard.subtitle}
            </p>
            <p className="mt-2 max-w-md font-hindi text-sm leading-relaxed text-muted-foreground md:text-base">
              {STUDY_CORNER_LANDING.homeCard.helper}
            </p>
          </div>
          <div className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-hindi text-base font-semibold text-primary-foreground transition-transform active:scale-95 sm:w-auto">
            {STUDY_CORNER_LANDING.homeCard.button}
          </div>
        </Link>

        {/* Upcoming Exams */}
        <Link
          to="/upcoming-exams"
          className="bento-tile bento-tile-hover group relative flex flex-col justify-between overflow-hidden p-6 md:col-span-2 md:p-8"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Upcoming Exams
            </div>
            <h2 className="font-hindi text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              आगामी परीक्षाएँ
            </h2>
            <p className="mt-3 max-w-md font-hindi text-base leading-relaxed text-muted-foreground md:text-lg">
              Central और उत्तर भारत की शासकीय सेवा परीक्षाओं की मुख्य सूचना और official links।
            </p>
          </div>
          <div className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 font-hindi text-base font-semibold text-primary transition-transform active:scale-95 sm:w-auto">
            परीक्षाएँ देखें
          </div>
        </Link>

        {/* Speed Test tile */}
        <Link
          to="/test"
          className="bento-tile bento-tile-hover group flex flex-col items-center justify-center p-6 text-center md:col-span-1"
        >
          <div className="mb-4 rounded-full bg-surface-hover p-4 transition-colors group-hover:bg-accent">
            <svg
              className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-display font-bold">Take Speed Test</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get certified in 5 min</p>
        </Link>

        {/* Daily Practice tile */}
        <div className="bento-tile flex flex-col justify-between p-6 md:col-span-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Daily Practice
          </span>
          <div className="mt-4">
            <div className="font-display text-2xl font-bold leading-tight">Practice daily.</div>
            <p className="mt-2 text-xs text-muted-foreground">Improve speed and accuracy over time.</p>
          </div>
        </div>

        {/* What TAIPOQ helps */}
        <div className="bento-tile p-6 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              What TAIPOQ helps you do
            </span>
            <Link
              to="/typing-start-guide"
              className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
            >
              Start Guide →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="rounded-md border bg-card/40 p-3 text-sm">
              <b>Track your progress</b> — every test is saved locally.
            </li>
            <li className="rounded-md border bg-card/40 p-3 text-sm">
              <b>Improve speed and accuracy</b> with timed practice.
            </li>
            <li className="rounded-md border bg-card/40 p-3 text-sm">
              <b>Build job-ready typing skill</b> for RRB, SSC, DSSSB.
            </li>
            <li className="rounded-md border bg-card/40 p-3 text-sm">
              <b>Learn finger placement</b> before you race the clock.
            </li>
          </ul>
        </div>

        {/* Feature micro-tiles */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="bento-tile flex items-center gap-3 p-4 transition-colors hover:bg-surface-hover"
            >
              <div className={`grid h-9 w-9 place-items-center rounded-lg ${f.bg} ${f.fg} text-lg`}>
                {f.icon}
              </div>
              <div className="text-sm font-semibold">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <JobTypingSpeedGuide variant="compact" />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
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
      </div>
    </>
  );
}

function Arrow() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}

const MOBILE_BTN =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition-transform active:scale-[0.98]";

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "Finger Placement सीखें",
    subtext: "Keyboard पर उंगलियों की सही स्थिति समझें।",
    to: "/typing-start-guide" as const,
  },
  {
    step: 2,
    title: "Practice Passage करें",
    subtext: "English या Hindi passage चुनकर अभ्यास करें।",
    choices: [
      { label: "English Practice", to: "/english/practice" as const, variant: "english" as const },
      {
        label: "Hindi Practice",
        to: "/hindi/practice" as const,
        search: { mode: "Remington" as const },
        variant: "hindi" as const,
      },
    ],
  },
  {
    step: 3,
    title: "Speed Target देखें",
    subtext: "25, 30, 35 और 40 WPM लक्ष्य समझें।",
    to: "/typing-tips" as const,
  },
  {
    step: 4,
    title: "Desktop Speed Test दें",
    subtext: "वास्तविक typing test computer keyboard पर करें।",
    to: "/test" as const,
  },
] as const;

const LIBRARY_QUICK_LINKS = [
  { to: "/typing-start-guide" as const, label: "Finger placement" },
  { to: "/english/lessons" as const, label: "English typing basics" },
  { to: "/hindi/lessons" as const, label: "Hindi typing basics" },
  { to: "/typing-tips" as const, label: "Exam target guide" },
] as const;

const FEATURES = [
  { label: "Real-time WPM", icon: "⚡", bg: "bg-primary/10", fg: "text-primary" },
  { label: "Certificates", icon: "◆", bg: "bg-fuchsia-500/10", fg: "text-fuchsia-400" },
  { label: "Unicode Core", icon: "अ", bg: "bg-amber-500/10", fg: "text-amber-400 font-hindi" },
  { label: "Progress History", icon: "↗", bg: "bg-success/10", fg: "text-success" },
] as const;

const SECONDARY = [
  { to: "/upcoming-exams" as const, label: "आगामी परीक्षाएँ" },
  { to: "/word-learning" as const, label: "शब्द अभ्यास / Word Learning" },
  { to: "/study-corner" as const, label: "पुस्तकालय / Library" },
  { to: "/english/lessons" as const, label: "English Lessons" },
  { to: "/hindi/lessons" as const, label: "Hindi Lessons" },
  { to: "/progress" as const, label: "My Progress" },
  { to: "/certificate" as const, label: "Certificate" },
] as const;
