import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DailyMissionSection } from "@/components/DailyMissionSection";
import { PageShell } from "@/components/PageShell";
import { ProductToolCard } from "@/components/ProductToolCard";
import { ToughMockChallengePopup } from "@/components/ToughMockChallengePopup";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { SSC_CGL_PATTERN_PRACTICE_HREF } from "@/content/sscCglPatternPracticeContent";
import { BRAND_ASSETS } from "@/lib/brand";
import { getResults, getUser } from "@/lib/storage";
import { PYQ_GUIDE_PAPER_ID, PYQ_GUIDE_SUBJECT_SLUG } from "@/lib/tests/pyqGuide";
import { getVerifiedPublicVacancies, loadVacanciesLive } from "@/lib/vacancies";
import type { VacancyItem } from "@/types/vacancy";
import { cn } from "@/lib/utils";

const PYQ_ROUTE = {
  to: "/tests/$subject/$paperId" as const,
  params: { subject: PYQ_GUIDE_SUBJECT_SLUG, paperId: PYQ_GUIDE_PAPER_ID },
};

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
        <div className="space-y-8 md:space-y-10">
          <HomeHero />
          <section aria-labelledby="mission-continue-heading" className="space-y-4">
            <h2 id="mission-continue-heading" className="sr-only">
              Today&apos;s Mission and Continue Preparation
            </h2>
            <DailyMissionSection />
            <ContinuePreparation />
          </section>
          <PreparationTools />
          <ChooseYourExam />
          <SuggestedNextSteps />
          <LatestVerifiedVacancies />
          <ProgressSummary />
          <WhyTaipoq />
          <TypingAndLibraryLinks />
        </div>
      </PageShell>
    </>
  );
}

function HomeHero() {
  return (
    <section
      className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-[#EFF6FF] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] md:p-8 lg:p-10"
      aria-labelledby="home-hero-heading"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1D4ED8]">TAIPOQ</p>
          <h1
            id="home-hero-heading"
            className="mt-2 font-display text-[34px] font-bold leading-tight tracking-tight text-[#0F172A] md:text-5xl lg:text-[52px]"
          >
            Prepare Smarter. Progress Every Day.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#475569] md:text-lg">
            Verified vacancies, PYQs, tests, daily practice and calculation-speed learning for
            government-exam preparation.
          </p>
          <p className="mt-2 text-sm font-medium text-[#0F172A]">
            Govt Job Computer & Typing Preparation
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/daily-mission"
              className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[#1D4ED8] px-6 text-base font-semibold text-white transition-colors hover:bg-[#1E40AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
            >
              Start Today&apos;s Mission
            </Link>
            <Link
              to="/tests"
              className="inline-flex min-h-12 items-center justify-center rounded-[12px] border border-[#93C5FD] bg-white px-6 text-base font-semibold text-[#1D4ED8] transition-colors hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
            >
              Explore Tests
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#475569]">
            <li>Official-source verification</li>
            <li>Clearly labelled PYQs</li>
            <li>Free preparation tools</li>
          </ul>
          <p className="mt-4 hidden text-sm leading-relaxed text-[#475569] md:block">
            TAIPOQ is under continuous development. Some learning features may change as the
            platform is improved.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[240px] rounded-[14px] border border-[#E2E8F0] bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)] md:max-w-[280px]">
          <img
            src={BRAND_ASSETS.logo3d}
            alt="TAIPOQ"
            width={280}
            height={200}
            className="mx-auto h-auto max-h-[140px] w-full object-contain md:max-h-[180px]"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

function ContinuePreparation() {
  return (
    <section
      aria-labelledby="continue-prep-heading"
      className="rounded-[14px] border border-[#E2E8F0] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] md:p-5"
    >
      <h2 id="continue-prep-heading" className="text-lg font-bold text-[#0F172A] md:text-xl">
        Continue Preparation
      </h2>
      <p className="mt-1 text-sm text-[#475569]">
        Resume useful practice from where TAIPOQ can reliably guide you.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "Continue Math Speed Lab",
            sub: "Lessons and direct practice for calculation speed",
            to: "/math-speed-lab",
          },
          {
            title: "Resume Tests Hub",
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
                className="flex min-h-11 flex-col rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                <span className="text-sm font-semibold text-[#0F172A]">{item.title}</span>
                <span className="mt-0.5 text-xs text-[#475569]">{item.sub}</span>
              </Link>
            ) : (
              <Link
                to={item.to}
                className="flex min-h-11 flex-col rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                <span className="text-sm font-semibold text-[#0F172A]">{item.title}</span>
                <span className="mt-0.5 text-xs text-[#475569]">{item.sub}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Four primary product cards — Math Speed Lab retained with Pilot badge and homepage-card copy. */
function PreparationTools() {
  return (
    <section aria-labelledby="prep-tools-heading" className="space-y-4">
      <div>
        <h2
          id="prep-tools-heading"
          className="text-xl font-bold tracking-tight text-[#0F172A] md:text-2xl"
        >
          Preparation Tools
        </h2>
        <p className="mt-1 text-sm text-[#475569] md:text-base">
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
            badge="Pilot"
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
        <h2 id="choose-exam-heading" className="text-xl font-bold text-[#0F172A] md:text-2xl">
          Choose Your Exam
        </h2>
        <p className="mt-1 text-sm text-[#475569]">
          Open a genuine preparation path — no invented test counts.
        </p>
      </div>
      <div className="-mx-1 overflow-x-auto pb-1">
        <ul className="flex min-w-max gap-2 px-1 md:grid md:min-w-0 md:grid-cols-3 lg:grid-cols-6 md:gap-3">
          {exams.map((exam) => (
            <li key={exam.label} className="w-[148px] shrink-0 md:w-auto">
              {"params" in exam && exam.params ? (
                <Link
                  to={exam.to}
                  params={exam.params}
                  className="flex min-h-12 items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-3 text-center text-sm font-semibold text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  {exam.label}
                </Link>
              ) : (
                <Link
                  to={exam.to}
                  className="flex min-h-12 items-center justify-center rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-3 text-center text-sm font-semibold text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
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

function SuggestedNextSteps() {
  return (
    <section aria-labelledby="suggested-heading" className="space-y-3">
      <div>
        <h2 id="suggested-heading" className="text-xl font-bold text-[#0F172A] md:text-2xl">
          Suggested Next Steps
        </h2>
        <p className="mt-1 text-sm text-[#475569]">
          Rule-based suggestions from real TAIPOQ modules — not personalised claims.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        <li>
          <ProductToolCard
            title="Today's Mission"
            description="Complete today's focused preparation activities."
            cta="Open Mission"
            to="/daily-mission"
            accent="mission"
          />
        </li>
        <li>
          <ProductToolCard
            title="Verified PYQ Paper"
            description="Practise a clearly labelled previous-year paper."
            cta="Open PYQ"
            to="/tests/$subject/$paperId"
            params={PYQ_ROUTE.params}
            accent="pyqs"
          />
        </li>
        <li>
          <ProductToolCard
            title="Continue Math Speed Lab"
            description="Learn the next calculation technique with direct practice."
            cta="Open Lab"
            to="/math-speed-lab"
            accent="msl"
            badge="Pilot"
          />
        </li>
      </ul>
    </section>
  );
}

function LatestVerifiedVacancies() {
  const [items, setItems] = useState<VacancyItem[]>([]);
  const [loaded, setLoaded] = useState(false);

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
          <h2 id="vacancies-heading" className="text-xl font-bold text-[#0F172A] md:text-2xl">
            Latest Verified Vacancies
          </h2>
          <p className="mt-1 text-sm text-[#475569]">
            Official-source verified openings from the Jobs module.
          </p>
        </div>
        <Link
          to="/upcoming-exams"
          className="min-h-11 text-sm font-semibold text-[#15803D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D]"
        >
          View all Jobs →
        </Link>
      </div>
      {!loaded ? (
        <p className="text-sm text-[#475569]">Loading verified vacancies…</p>
      ) : items.length === 0 ? (
        <p className="rounded-[14px] border border-[#E2E8F0] bg-[#F0FDF4] p-4 text-sm text-[#15803D]">
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
      className="rounded-[14px] border border-[#E2E8F0] bg-[#F5F3FF] p-5"
    >
      <h2 id="progress-heading" className="text-xl font-bold text-[#0F172A] md:text-2xl">
        Progress Summary
      </h2>
      {name ? (
        <div className="mt-3 space-y-2 text-sm text-[#475569]">
          <p>
            Profile: <span className="font-semibold text-[#0F172A]">{name}</span>
          </p>
          <p>
            Typing results saved in this browser:{" "}
            <span className="font-semibold text-[#0F172A]">{resultCount}</span>
          </p>
          <Link
            to="/progress"
            className="inline-flex min-h-11 items-center font-semibold text-[#7C3AED] hover:underline"
          >
            Open Progress →
          </Link>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-[#475569]">
            Create a free profile to save your progress and continue later.
          </p>
          <Link
            to="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[#7C3AED] px-5 text-sm font-semibold text-white hover:bg-[#6D28D9]"
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
      <h2 id="why-heading" className="text-xl font-bold text-[#0F172A] md:text-2xl">
        Why TAIPOQ
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {points.map((p) => (
          <li
            key={p}
            className="rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#0F172A]"
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
      <h2 id="typing-lib-heading" className="text-lg font-bold text-[#0F172A]">
        Typing &amp; Library
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.to + link.title}>
            {"search" in link && link.search ? (
              <Link
                to={link.to}
                search={link.search}
                className={cn(
                  "flex min-h-11 items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]",
                )}
              >
                <span>{link.title}</span>
                <span aria-hidden="true" className="text-[#475569]">
                  →
                </span>
              </Link>
            ) : (
              <Link
                to={link.to}
                className="flex min-h-11 items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                <span>{link.title}</span>
                <span aria-hidden="true" className="text-[#475569]">
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
