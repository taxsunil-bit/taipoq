import { createFileRoute, Link } from "@tanstack/react-router";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { PageShell } from "@/components/PageShell";
import { EXCEL_BASICS_HREF } from "@/content/excelBasicKnowledgeContent";
import { SSC_CGL_PATTERN_PRACTICE_HREF } from "@/content/sscCglPatternPracticeContent";
import { WORD_BASICS_HREF } from "@/content/wordBasicKnowledgeContent";
import { STUDY_CORNER_LANDING } from "@/content/studyCornerContent";
import {
  BRAND_ASSETS,
  MAIN_ACTION_CARD,
  MAIN_ACTION_SUBTITLE,
  TESTS_HUB_BADGE,
  TESTS_HUB_CARD_HIGHLIGHT,
} from "@/lib/brand";
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
      <div className="space-y-4 md:space-y-6">
        <HomeMobileHero />
        <HomeMobilePrimarySection />
        <div className="hidden md:block">
          <HomeDesktopPracticeSection />
        </div>
        <HomeMobileBody />
        <HomeDesktop />
      </div>
    </PageShell>
  );
}

function HomeMobileHero() {
  return (
    <section className="bento-tile p-5 font-hindi md:hidden">
      <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <img
          src={BRAND_ASSETS.logo3d}
          alt="TAIPOQ"
          width={280}
          height={200}
          className="mx-auto h-auto max-h-[160px] w-full max-w-[260px] object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight">TAIPOQ</h1>
      <p className="mt-2 text-base font-medium leading-snug text-foreground">
        Govt Job Computer & Typing Preparation
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Upcoming Exams · MS Word · Excel · Model Papers · Typing
      </p>
    </section>
  );
}

function HomeMobilePrimarySection() {
  return (
    <section className="space-y-3 font-hindi md:hidden" aria-label="Primary actions">
      <Link
        to={MOBILE_ROUTES.jobAds}
        className={cn(MOBILE_BTN, "bg-primary text-primary-foreground shadow-sm")}
      >
        Exam Updates देखें
      </Link>
      <Link
        to="/study-corner"
        className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
      >
        {STUDY_CORNER_LANDING.homeCard.title}
      </Link>
      <Link
        to="/tests"
        className={cn(MOBILE_CARD_BTN, MAIN_ACTION_CARD, TESTS_HUB_CARD_HIGHLIGHT, "relative gap-1")}
      >
        <span className={TESTS_HUB_BADGE}>मुख्य</span>
        <span className="w-full pr-14 text-base font-semibold leading-snug text-white">
          परीक्षा अभ्यास / Tests
        </span>
        <span className={cn("w-full text-sm font-normal leading-snug", MAIN_ACTION_SUBTITLE)}>
          Model Paper, Typing Test, Current Affairs और General Science Test एक जगह
        </span>
        <span className="mt-1 w-full text-sm font-semibold text-white">सभी Tests देखें →</span>
      </Link>
      <Link
        to="/typing-start-guide"
        className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
      >
        Typing Guide — Finger Placement
      </Link>
    </section>
  );
}

function HomeDesktopPracticeSection() {
  return (
    <section
      className="bento-tile space-y-4 p-5 md:p-6"
      aria-labelledby="desktop-practice-heading"
    >
      <div>
        <h2 id="desktop-practice-heading" className="font-display text-xl font-bold tracking-tight md:text-2xl">
          मुख्य अभ्यास
        </h2>
        <p className="mt-1 font-hindi text-sm leading-relaxed text-muted-foreground md:text-base">
          Tests, Typing Practice और Library
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DESKTOP_PRACTICE_ACTIONS.map((action) => (
          <li key={action.to + action.title}>
            <PracticeActionCard action={action} />
          </li>
        ))}
      </ul>
    </section>
  );
}

type PracticeAction = (typeof DESKTOP_PRACTICE_ACTIONS)[number];

function PracticeActionCard({ action }: { action: PracticeAction }) {
  const content = (
    <>
      {action.highlight ? <span className={TESTS_HUB_BADGE}>मुख्य</span> : null}
      <span
        className={cn(
          "text-base font-semibold leading-snug text-white",
          action.highlight && "pr-14",
        )}
      >
        {action.title}
      </span>
      <span className={cn("text-sm font-normal leading-snug", MAIN_ACTION_SUBTITLE)}>
        {action.subtitle}
      </span>
      {action.highlight ? (
        <span className="mt-1 text-sm font-semibold text-white">सभी Tests देखें →</span>
      ) : null}
    </>
  );

  const className = cn(
    PRACTICE_CARD_BTN,
    MAIN_ACTION_CARD,
    action.highlight && TESTS_HUB_CARD_HIGHLIGHT,
  );

  if ("search" in action && action.search) {
    return (
      <Link to={action.to} search={action.search} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <Link to={action.to} className={className}>
      {content}
    </Link>
  );
}

function HomeMobileBody() {
  return (
    <div className="space-y-4 overflow-x-hidden md:hidden">
      {/* Study shortcuts — no duplicate test buttons */}
      <section className="space-y-3 font-hindi" aria-label="Study shortcuts">
        <Link
          to={MOBILE_ROUTES.currentAffairs}
          className={cn(
            MOBILE_CARD_BTN,
            "border border-blue-500/40 bg-blue-500/10 text-blue-950 dark:text-blue-100",
          )}
        >
          <span className="w-full text-base font-semibold leading-snug">
            Current Affairs / समसामयिक प्रश्नपत्र
          </span>
          <span className="w-full text-sm font-normal opacity-90">SSC · Railway · PET · Police</span>
        </Link>
        <Link
          to={MOBILE_ROUTES.sscCglPractice}
          className={cn(
            MOBILE_CARD_BTN,
            "border border-indigo-500/40 bg-indigo-500/10 text-indigo-950 dark:text-indigo-100",
          )}
        >
          <span className="w-full text-base font-semibold leading-snug">SSC CGL Practice</span>
          <span className="w-full text-sm font-normal opacity-90">
            Maths, Reasoning, English, GK — 100 starter questions.
          </span>
        </Link>
        <Link
          to={MOBILE_ROUTES.modelPapers}
          className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
        >
          Model Paper देखें
        </Link>
        <Link
          to={MOBILE_ROUTES.msWord}
          className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
        >
          MS Word सीखें
        </Link>
        <Link
          to={MOBILE_ROUTES.excel}
          className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
        >
          Excel सीखें
        </Link>
      </section>

      {/* How to use TAIPOQ — job & study first */}
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
                            className={cn(MOBILE_BTN, "px-3 text-sm bg-primary text-primary-foreground")}
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

      {/* Typing Practice — secondary on mobile */}
      <section className="bento-tile space-y-4 p-5 font-hindi" aria-labelledby="mobile-typing-heading">
        <div>
          <h2 id="mobile-typing-heading" className="text-lg font-bold text-foreground">
            Typing Practice
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Phone पर lessons और passages पढ़ें। वास्तविक speed test computer keyboard पर दें।
          </p>
        </div>
        <div className="space-y-2">
          <Link
            to="/typing-start-guide"
            className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
          >
            Finger Placement
          </Link>
          <Link
            to="/english/practice"
            className={cn(MOBILE_BTN, "border border-border bg-surface text-foreground")}
          >
            English Practice
          </Link>
          <Link
            to="/hindi/practice"
            search={{ mode: "Remington" }}
            className={cn(
              MOBILE_BTN,
              "border border-amber-500/40 bg-amber-500/15 text-amber-900 dark:text-amber-100",
            )}
          >
            Hindi Practice
          </Link>
        </div>
      </section>

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
              <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tighter md:text-7xl">
                TAIPOQ
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                Master precision and speed. The smart English & Hindi typing tutor designed for students,
                clerks, advocates, and high-performance typists.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[360px] md:col-start-2 md:row-start-1 md:row-span-2 md:max-w-[420px] md:self-center lg:max-w-[460px]">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={BRAND_ASSETS.logo3d}
                  alt="TAIPOQ"
                  width={320}
                  height={320}
                  className="mx-auto h-auto w-full max-w-[320px] object-contain"
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

        {/* Upcoming Exams & Job Updates */}
        <Link
          to="/upcoming-exams"
          className="bento-tile bento-tile-hover group relative flex flex-col justify-between overflow-hidden p-6 md:col-span-2 md:p-8"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Upcoming Exams & Job Updates
            </div>
            <h2 className="font-hindi text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Upcoming Exams & Job Updates
            </h2>
            <p className="mt-3 max-w-md font-hindi text-base leading-relaxed text-muted-foreground md:text-lg">
              Official links, exam updates और verified job updates एक स्थान पर.
            </p>
          </div>
          <div className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 font-hindi text-base font-semibold text-primary transition-transform active:scale-95 sm:w-auto">
            Exam Updates देखें
          </div>
        </Link>

        {/* Tests hub tile */}
        <Link
          to="/tests"
          className="bento-tile bento-tile-hover group flex flex-col items-center justify-center p-6 text-center md:col-span-1"
        >
          <div className="mb-4 rounded-full bg-emerald-500/10 p-4 transition-colors group-hover:bg-emerald-500/20">
            <svg
              className="h-7 w-7 text-emerald-700 dark:text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="font-hindi font-bold">परीक्षा अभ्यास / Tests</h3>
          <p className="mt-1 text-sm text-muted-foreground">सभी Tests एक जगह</p>
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

const MOBILE_CARD_BTN =
  "inline-flex min-h-[3.25rem] w-full rounded-xl px-5 py-3.5 text-left transition-transform active:scale-[0.98]";

const PRACTICE_CARD_BTN =
  "relative flex min-h-[52px] w-full flex-col items-start justify-center gap-0.5 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.98]";

const DESKTOP_PRACTICE_ACTIONS = [
  {
    title: "परीक्षा अभ्यास / Tests",
    subtitle: "Model Paper, Typing Test, Current Affairs और General Science Test",
    to: "/tests" as const,
    highlight: true,
  },
  {
    title: "English Typing Practice",
    subtitle: "English typing अभ्यास",
    to: "/english/practice" as const,
    highlight: false,
  },
  {
    title: "Hindi Typing Practice",
    subtitle: "KrutiDev / Remington अभ्यास",
    to: "/hindi/practice" as const,
    search: { mode: "Remington" as const },
    highlight: false,
  },
  {
    title: STUDY_CORNER_LANDING.homeCard.title,
    subtitle: "Computer, GA, General Science अध्ययन",
    to: "/study-corner" as const,
    highlight: false,
  },
  {
    title: "शब्द अभ्यास / Word Learning",
    subtitle: "Typing के लिए उपयोगी शब्द",
    to: "/word-learning" as const,
    highlight: false,
  },
] as const;

const MOBILE_ROUTES = {
  jobAds: "/upcoming-exams" as const,
  msWord: WORD_BASICS_HREF,
  excel: EXCEL_BASICS_HREF,
  modelPapers: "/study-corner/general-awareness" as const,
  currentAffairs: "/current-affairs" as const,
  sscCglPractice: SSC_CGL_PATTERN_PRACTICE_HREF,
};

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "Upcoming Exams & Job Updates",
    subtext: "Official links, exam updates और verified job updates एक स्थान पर.",
    to: MOBILE_ROUTES.jobAds,
  },
  {
    step: 2,
    title: "MS Word और Excel सीखें",
    subtext: "Computer knowledge के आवश्यक topics पढ़ें।",
    choices: [
      { label: "MS Word", to: MOBILE_ROUTES.msWord },
      { label: "Excel", to: MOBILE_ROUTES.excel },
    ],
  },
  {
    step: 3,
    title: "परीक्षा अभ्यास दें",
    subtext: "Model Paper, Current Affairs, General Science और Typing Test एक जगह।",
    to: "/tests" as const,
  },
  {
    step: 4,
    title: "Typing Speed Test दें",
    subtext: "Computer keyboard पर वास्तविक typing test दें।",
    to: "/tests" as const,
  },
] as const;

const FEATURES = [
  { label: "Real-time WPM", icon: "⚡", bg: "bg-primary/10", fg: "text-primary" },
  { label: "Certificates", icon: "◆", bg: "bg-fuchsia-500/10", fg: "text-fuchsia-400" },
  { label: "Unicode Core", icon: "अ", bg: "bg-amber-500/10", fg: "text-amber-400 font-hindi" },
  { label: "Progress History", icon: "↗", bg: "bg-success/10", fg: "text-success" },
] as const;

const SECONDARY = [
  { to: "/tests" as const, label: "परीक्षा अभ्यास / Tests" },
  { to: "/upcoming-exams" as const, label: "आगामी परीक्षाएँ" },
  { to: "/word-learning" as const, label: "शब्द अभ्यास / Word Learning" },
  { to: "/study-corner" as const, label: "पुस्तकालय / Library" },
  { to: "/english/lessons" as const, label: "English Lessons" },
  { to: "/hindi/lessons" as const, label: "Hindi Lessons" },
  { to: "/progress" as const, label: "My Progress" },
  { to: "/certificate" as const, label: "Certificate" },
] as const;
