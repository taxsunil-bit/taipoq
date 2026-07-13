import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DailyMissionSection } from "@/components/DailyMissionSection";
import { PageShell } from "@/components/PageShell";
import { ProductToolCard } from "@/components/ProductToolCard";
import { ToughMockChallengePopup } from "@/components/ToughMockChallengePopup";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { SSC_CGL_PATTERN_PRACTICE_HREF } from "@/content/sscCglPatternPracticeContent";
import { SITE_CANONICAL_URL, SITE_DESCRIPTION, SITE_TITLE, UTILITY_ROW } from "@/lib/brand";
import { getResults, getUser } from "@/lib/storage";
import { PYQ_GUIDE_PAPER_ID, PYQ_GUIDE_SUBJECT_SLUG } from "@/lib/tests/pyqGuide";
import { getVerifiedPublicVacancies, loadVacanciesLive } from "@/lib/vacancies";
import { getPublishedVacanciesSnapshot } from "@/lib/vacanciesPublishedSnapshot";
import type { VacancyItem } from "@/types/vacancy";
import { cn } from "@/lib/utils";

const PYQ_ROUTE = {
  to: "/tests/$subject/$paperId" as const,
  params: { subject: PYQ_GUIDE_SUBJECT_SLUG, paperId: PYQ_GUIDE_PAPER_ID },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_CANONICAL_URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_CANONICAL_URL }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <ToughMockChallengePopup />
      <PageShell>
        <div className="space-y-8 md:space-y-10">
          <HomeHero />
          <section
            aria-labelledby="mission-continue-heading"
            className="grid gap-4 lg:grid-cols-12 lg:gap-6"
          >
            <h2 id="mission-continue-heading" className="sr-only">
              Today&apos;s Mission and Recommended Preparation
            </h2>
            <div className="space-y-4 lg:col-span-8">
              <DailyMissionSection />
              <ContinuePreparation />
            </div>
            <aside className="hidden lg:col-span-4 lg:block">
              <HomeProgressRail />
            </aside>
          </section>
          <PreparationTools />
          <ChooseYourExam />
          <LatestVerifiedVacancies />
          <ProgressSummary />
          <WhyTaipoq />
          <TypingAndLibraryLinks />
          <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
            TAIPOQ is under continuous development. Some learning features may change as the
            platform is improved.
          </p>
        </div>
      </PageShell>
    </>
  );
}

function HomeHero() {
  return (
    <section
      className="overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-focus)] p-5 shadow-[var(--shadow-subtle)] md:p-8 lg:p-10"
      aria-labelledby="home-hero-heading"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(220px,280px)] md:items-center md:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">TAIPOQ</p>
          <h1
            id="home-hero-heading"
            className="mt-2 font-display text-[34px] font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-[52px]"
          >
            Prepare Smarter. Progress Every Day.
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Verified opportunities, focused tests and daily practice—organised around your next
            useful step.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/daily-mission"
              className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-[var(--cs-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Start Today&apos;s Mission
            </Link>
            <Link
              to="/tests"
              className="inline-flex min-h-12 items-center justify-center rounded-[12px] border border-primary/35 bg-white px-6 text-base font-semibold text-primary transition-colors hover:bg-[var(--cs-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Explore Tests
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
            <li>Official-source checked jobs</li>
            <li>Verified PYQ provenance</li>
            <li>Mobile-first preparation</li>
          </ul>
        </div>
        <div
          className="mx-auto w-full max-w-[280px] space-y-2 rounded-[16px] border border-[var(--border-subtle)] bg-white p-3 shadow-[var(--shadow-subtle)]"
          aria-hidden="true"
        >
          <div className="rounded-xl bg-[var(--surface-focus)] px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              Today&apos;s Mission
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              3 preparation activities
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div className="h-full w-2/5 rounded-full bg-[var(--cs-secondary)]" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3 py-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Verified PYQ</span>
            <span className="rounded-full bg-[var(--status-info-container)] px-2 py-0.5 text-[10px] font-semibold text-[var(--status-info)]">
              Provenance
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3 py-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Open Jobs</span>
            <span className="rounded-full bg-[var(--status-success-container)] px-2 py-0.5 text-[10px] font-semibold text-[var(--status-success)]">
              Verified
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3 py-2">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Math Speed Lab</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cs-accent-intelligence)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeProgressRail() {
  const [resultCount, setResultCount] = useState(0);
  const [vacancyTitle, setVacancyTitle] = useState<string | null>(null);

  useEffect(() => {
    setResultCount(getResults().length);
    const first = getVerifiedPublicVacancies(getPublishedVacanciesSnapshot().items)[0];
    setVacancyTitle(first?.title ?? null);
  }, []);

  return (
    <div className="space-y-3 rounded-[20px] border border-[var(--border-subtle)] bg-white p-4 shadow-[var(--shadow-subtle)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Preparation rail</h3>
      <div className="rounded-xl bg-[var(--cs-secondary-container)] px-3 py-3">
        <p className="text-xs font-medium text-[var(--cs-on-secondary-container)]">
          Browser practice results
        </p>
        <p className="mt-1 text-2xl font-bold text-[var(--cs-on-secondary-container)]">
          {resultCount}
        </p>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] px-3 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">Latest verified vacancy</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--text-primary)]">
          {vacancyTitle ?? "Open Jobs for current listings"}
        </p>
        <Link
          to="/upcoming-exams"
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--status-success)] hover:underline"
        >
          View Jobs →
        </Link>
      </div>
      <Link
        to="/math-speed-lab"
        className="flex min-h-11 items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--cs-secondary-container)]"
      >
        <span>Recommended: Math Speed Lab</span>
        <span className="h-2 w-2 rounded-full bg-[var(--cs-accent-intelligence)]" aria-hidden />
      </Link>
    </div>
  );
}

function ContinuePreparation() {
  return (
    <section
      aria-labelledby="continue-prep-heading"
      className="rounded-[16px] border border-[var(--border-subtle)] bg-white p-4 shadow-[var(--shadow-subtle)] md:p-5"
    >
      <h2
        id="continue-prep-heading"
        className="text-lg font-bold text-[var(--text-primary)] md:text-xl"
      >
        Recommended Preparation
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Choose a reliable next practice step — Math Speed Lab, Tests, or verified PYQ.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "Math Speed Lab",
            sub: "Lessons and direct practice for calculation speed",
            to: "/math-speed-lab",
          },
          {
            title: "Tests Hub",
            sub: "Subject tests, model papers and verified PYQs",
            to: "/tests",
          },
          {
            title: "Explore Verified PYQ",
            sub: "Official-source verified previous-year practice",
            ...PYQ_ROUTE,
          },
        ].map((item) => (
          <li key={item.title}>
            {"params" in item ? (
              <Link
                to={item.to}
                params={item.params}
                className="flex min-h-11 flex-col rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 transition-colors hover:border-[var(--border-focus)] hover:bg-[var(--cs-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.title}
                </span>
                <span className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.sub}</span>
              </Link>
            ) : (
              <Link
                to={item.to}
                className="flex min-h-11 flex-col rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 transition-colors hover:border-[var(--border-focus)] hover:bg-[var(--cs-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.title}
                </span>
                <span className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.sub}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Four primary product cards — Math Speed Lab retained with Early Access badge. */
function PreparationTools() {
  return (
    <section aria-labelledby="prep-tools-heading" className="space-y-4">
      <div>
        <h2
          id="prep-tools-heading"
          className="text-[23px] font-bold tracking-tight text-[var(--text-primary)] md:text-[28px]"
        >
          Preparation Tools
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)] md:text-base">
          Tests, Math Speed Lab, PYQs and Daily Mission — start with one clear next step.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <ProductToolCard
            title="Mock Tests"
            description="Full, subject and mini tests for structured exam practice."
            cta="Start a Test"
            to="/tests"
            accent="tests"
          />
        </li>
        <li>
          <ProductToolCard
            title="Verified PYQs"
            description="Officially sourced or clearly labelled previous-year questions."
            cta="Practise PYQs"
            to="/tests/$subject/$paperId"
            params={PYQ_ROUTE.params}
            accent="pyqs"
          />
        </li>
        <li>
          {/* Math Speed Lab homepage card — order after Tests, before typing links section */}
          <ProductToolCard
            title="Math Speed Lab"
            hindiTitle="तीव्र गणना अभ्यास"
            description="वर्ग, पूरक और निकट-आधार गुणा की सरल तकनीकों से गणना गति बढ़ाएँ।"
            supportingLabel="3 Techniques · Lesson + Direct Practice"
            cta="गणना अभ्यास आरम्भ करें"
            badge="Early Access"
            to="/math-speed-lab"
            accent="msl"
          />
        </li>
        <li>
          <ProductToolCard
            title="Daily Mission"
            description="Short focused daily preparation you can finish in one sitting."
            cta="Begin Today"
            to="/daily-mission"
            accent="mission"
          />
        </li>
      </ul>
    </section>
  );
}

function ChooseYourExam() {
  const exams = [
    { label: "SSC", to: SSC_CGL_PATTERN_PRACTICE_HREF },
    {
      label: "Teaching / CTET",
      to: "/tests/$subject/$paperId" as const,
      params: PYQ_ROUTE.params,
    },
    { label: "Railways", to: "/upcoming-exams" as const },
    { label: "Banking", to: "/upcoming-exams" as const },
    { label: "State Exams", to: "/upcoming-exams" as const },
    { label: "Other Government Exams", to: "/tests" as const },
  ];

  return (
    <section aria-labelledby="choose-exam-heading" className="space-y-3">
      <div>
        <h2
          id="choose-exam-heading"
          className="text-[23px] font-bold text-[var(--text-primary)] md:text-[28px]"
        >
          Choose Your Exam
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Open a genuine preparation path — no invented test counts.
        </p>
      </div>
      <div className="-mx-1 overflow-x-auto pb-1">
        <ul className="flex min-w-max gap-2 px-1 md:grid md:min-w-0 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {exams.map((exam) => (
            <li key={exam.label} className="w-[148px] shrink-0 md:w-auto">
              {"params" in exam && exam.params ? (
                <Link
                  to={exam.to}
                  params={exam.params}
                  className="flex min-h-12 items-center justify-center rounded-[12px] border border-[var(--border-subtle)] bg-white px-3 py-3 text-center text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-subtle)] transition-colors hover:border-[var(--border-focus)] hover:bg-[var(--cs-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {exam.label}
                </Link>
              ) : (
                <Link
                  to={exam.to}
                  className="flex min-h-12 items-center justify-center rounded-[12px] border border-[var(--border-subtle)] bg-white px-3 py-3 text-center text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-subtle)] transition-colors hover:border-[var(--border-focus)] hover:bg-[var(--cs-primary-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {exam.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LatestVerifiedVacancies() {
  const snapshot = getPublishedVacanciesSnapshot();
  const [items, setItems] = useState<VacancyItem[]>(() =>
    getVerifiedPublicVacancies(snapshot.items).slice(0, 3),
  );
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadVacanciesLive()
      .then((result) => {
        if (cancelled) return;
        const verified = getVerifiedPublicVacancies(result.payload.items).slice(0, 3);
        setItems(verified);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="vacancies-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="vacancies-heading"
            className="text-[23px] font-bold text-[var(--text-primary)] md:text-[28px]"
          >
            Latest Verified Vacancies
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Official-source verified openings from the Jobs module.
          </p>
        </div>
        <Link
          to="/upcoming-exams"
          className="min-h-11 text-sm font-semibold text-[var(--status-success)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--status-success)]"
        >
          View all Jobs →
        </Link>
      </div>
      {!loaded ? (
        <p className="text-sm text-[var(--text-secondary)]">Loading verified vacancies…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--status-success-container)] p-4 text-sm text-[var(--status-success)]">
          No current verified vacancies to show here. Check Jobs for the full list.
        </p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <VerifiedVacancyCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ProgressSummary() {
  const [name, setName] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    const user = getUser();
    setName(user?.name ?? null);
    setResultCount(getResults().length);
  }, []);

  return (
    <section
      aria-labelledby="progress-heading"
      className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--cs-secondary-container)] p-5"
    >
      <h2
        id="progress-heading"
        className="text-[23px] font-bold text-[var(--text-primary)] md:text-[28px]"
      >
        Progress Summary
      </h2>
      {name ? (
        <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
          <p>
            Profile: <span className="font-semibold text-[var(--text-primary)]">{name}</span>
          </p>
          {resultCount > 0 ? (
            <p>
              Typing results saved in this browser:{" "}
              <span className="font-semibold text-[var(--text-primary)]">{resultCount}</span>
            </p>
          ) : (
            <p>No saved results yet. Complete a test to see progress here.</p>
          )}
          <Link
            to="/progress"
            className="inline-flex min-h-11 items-center font-semibold text-[var(--cs-secondary-strong)] hover:underline"
          >
            Open Progress →
          </Link>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Create a free profile to save your progress and continue later.
          </p>
          <Link
            to="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[var(--cs-secondary)] px-5 text-sm font-semibold text-white hover:bg-[var(--cs-secondary-strong)]"
          >
            Set Local Profile
          </Link>
        </div>
      )}
    </section>
  );
}

function WhyTaipoq() {
  const points = [
    "Official-source vacancy verification",
    "Clearly labelled PYQs",
    "Original practice content identified separately",
    "Transparent explanations",
    "No misleading job assurance",
  ];
  return (
    <section aria-labelledby="why-heading" className="space-y-3">
      <h2
        id="why-heading"
        className="text-[23px] font-bold text-[var(--text-primary)] md:text-[28px]"
      >
        Why TAIPOQ
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {points.map((p) => (
          <li
            key={p}
            className="rounded-[12px] border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm font-medium text-[var(--text-primary)]"
          >
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Secondary typing / library discovery — preserves phase-1 core link contracts. */
function TypingAndLibraryLinks() {
  const links = [
    { title: "English Typing Practice", to: "/english/practice" as const },
    {
      title: "Hindi Typing Practice",
      to: "/hindi/practice" as const,
      search: { mode: "Remington" as const },
    },
    { title: "पुस्तकालय / Library", to: "/study-corner" as const },
    { title: "शब्द अभ्यास / Word Learning", to: "/word-learning" as const },
    { title: "Typing Guide", to: "/typing-start-guide" as const },
    { title: "My Progress", to: "/progress" as const },
  ];

  return (
    <section aria-labelledby="typing-lib-heading" className="space-y-3">
      <h2 id="typing-lib-heading" className="text-lg font-bold text-[var(--text-primary)]">
        Typing &amp; Library
      </h2>
      <ul className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.to + link.title}>
            {"search" in link && link.search ? (
              <Link
                to={link.to}
                search={link.search}
                className={cn(UTILITY_ROW, "justify-between")}
              >
                <span className="text-sm font-medium text-[var(--text-primary)]">{link.title}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">
                  →
                </span>
              </Link>
            ) : (
              <Link to={link.to} className={cn(UTILITY_ROW, "justify-between")}>
                <span className="text-sm font-medium text-[var(--text-primary)]">{link.title}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">
                  →
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
