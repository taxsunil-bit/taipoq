import { createFileRoute, Link } from "@tanstack/react-router";
import { JobTypingSpeedGuide } from "@/components/JobTypingSpeedGuide";
import { PageShell } from "@/components/PageShell";
import { DailyMissionSection } from "@/components/DailyMissionSection";
import { ToughMockChallengePopup } from "@/components/ToughMockChallengePopup";
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

const HOME_TITLE = "TAIPOQ — Government Job Updates, Mock Tests, PYQ and Computer Practice";
const HOME_DESCRIPTION =
  "Verified government job updates, mock tests, PYQ practice, current affairs, computer knowledge, and English–Hindi typing preparation for Indian competitive examinations.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: HOME_TITLE }, { name: "description", content: HOME_DESCRIPTION }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <ToughMockChallengePopup />
      <PageShell>
        <div className="space-y-4 md:space-y-6">
          <HomeHero />
          <HomeMobilePrimarySection />
          <div className="hidden md:block">
            <HomeDesktopPracticeSection />
          </div>
          <DailyMissionSection />
          <HomeMobileBody />
          <HomeDesktopFooter />
        </div>
      </PageShell>
    </>
  );
}

function HomeHero() {
  return (
    <section
      className="bento-tile p-5 font-hindi md:p-8 lg:p-10"
      aria-labelledby="home-hero-heading"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
        <div>
          <h1
            id="home-hero-heading"
            className="font-display text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            TAIPOQ
          </h1>
          <p className="mt-2 text-base font-medium leading-snug text-foreground md:mt-3 md:text-xl">
            Govt Job Computer & Typing Preparation
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            Upcoming Exams · MS Word · Excel · Model Papers · Typing · PYQ · Current Affairs
          </p>
          <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground md:block">
            TAIPOQ is under continuous development. Some learning features may change as the
            platform is improved.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[260px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:max-w-[320px] md:rounded-3xl md:p-4 lg:max-w-[360px]">
          <img
            src={BRAND_ASSETS.logo3d}
            alt="TAIPOQ"
            width={320}
            height={320}
            className="mx-auto h-auto max-h-[160px] w-full object-contain md:max-h-none md:max-w-[280px]"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
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
        className={cn(
          MOBILE_CARD_BTN,
          MAIN_ACTION_CARD,
          TESTS_HUB_CARD_HIGHLIGHT,
          "relative gap-1",
        )}
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
    <section className="bento-tile space-y-4 p-5 md:p-6" aria-labelledby="desktop-practice-heading">
      <div>
        <h2
          id="desktop-practice-heading"
          className="font-display text-xl font-bold tracking-tight md:text-2xl"
        >
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
          <span className="w-full text-sm font-normal opacity-90">
            SSC · Railway · PET · Police
          </span>
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
      <section
        className="bento-tile space-y-3 p-5 font-hindi"
        aria-labelledby="mobile-onboarding-heading"
      >
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
                      <p className="text-base font-semibold leading-snug text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.subtext}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {item.choices.map((choice) => (
                          <Link
                            key={choice.to}
                            to={choice.to}
                            className={cn(
                              MOBILE_BTN,
                              "px-3 text-sm bg-primary text-primary-foreground",
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

      {/* Typing Practice — secondary on mobile */}
      <section
        className="bento-tile space-y-4 p-5 font-hindi"
        aria-labelledby="mobile-typing-heading"
      >
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

function HomeDesktopFooter() {
  return (
    <div className="hidden space-y-6 md:block">
      <JobTypingSpeedGuide variant="compact" />
      <section
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Progress and resources"
      >
        <Link
          to="/upcoming-exams"
          className="bento-tile bento-tile-hover flex min-h-11 items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium">Upcoming Exams</span>
          <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
            →
          </span>
        </Link>
        <Link
          to="/progress"
          className="bento-tile bento-tile-hover flex min-h-11 items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium">My Progress</span>
          <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
            →
          </span>
        </Link>
        <Link
          to="/certificate"
          className="bento-tile bento-tile-hover flex min-h-11 items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium">Certificate</span>
          <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
            →
          </span>
        </Link>
        <Link
          to="/typing-start-guide"
          className="bento-tile bento-tile-hover flex min-h-11 items-center justify-between px-5 py-4 text-sm"
        >
          <span className="font-medium">Typing Guide</span>
          <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
            →
          </span>
        </Link>
      </section>
    </div>
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
    title: "Upcoming Exams & Job Updates",
    subtitle: "Official links, exam updates और verified job updates",
    to: "/upcoming-exams" as const,
    highlight: false,
  },
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
