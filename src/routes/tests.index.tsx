import { createFileRoute, Link } from "@tanstack/react-router";
import { SubjectTestGrid } from "@/components/tests/SubjectTestGrid";
import { TestCard } from "@/components/tests/TestCard";
import { CurrentAffairsToughPack02Card } from "@/components/current-affairs-pack-02/CurrentAffairsToughPack02Card";
import { PageShell } from "@/components/PageShell";
import { SSC_CGL_PATTERN_PRACTICE_HREF } from "@/content/sscCglPatternPracticeContent";
import { PACK_PREPARED_DATE, TEST_SUBJECTS } from "@/content/tests/subjects";
import {
  PYQ_GUIDE_CONTENT_LABEL,
  PYQ_GUIDE_PAPER_ID,
  PYQ_GUIDE_SUBJECT_SLUG,
} from "@/lib/tests/pyqGuide";
import { getAllPapers, getPaperBySlugs } from "@/lib/tests/testGenerator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tests/")({
  head: () => ({
    meta: [
      { title: "TAIPOQ Tests — Mock Tests, PYQs and Practice Papers" },
      {
        name: "description",
        content:
          "Subject tests, model papers and official-source verified PYQs — Computer, Maths, Reasoning, Current Affairs and more.",
      },
    ],
  }),
  component: TestsLandingPage,
});

const LEGACY_TESTS = [
  { title: "Typing Speed Test", subtitle: "Timed typing speed check", to: "/test" as const },
  { title: "Model Paper Test", subtitle: "Full paper practice", to: "/model-paper-test" as const },
  {
    title: "Current Affairs Hub",
    subtitle: "Current affairs practice",
    to: "/current-affairs" as const,
  },
  {
    title: "General Science Test",
    subtitle: "Science model test",
    to: "/study-corner/general-science/model-test-01" as const,
  },
] as const;

const LEGACY_BTN =
  "flex min-h-[52px] w-full flex-col justify-center rounded-xl border border-border bg-surface px-4 py-3.5 text-left hover:bg-surface-hover";

const SSC_CGL_PRACTICE_CARD =
  "flex min-h-[52px] w-full flex-col justify-center rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-4 text-[var(--text-primary)] shadow-[var(--shadow-subtle)] transition-all duration-[var(--duration-standard)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-px";

function TestsLandingPage() {
  const allPapers = getAllPapers();
  const verifiedPyq = getPaperBySlugs(PYQ_GUIDE_SUBJECT_SLUG, PYQ_GUIDE_PAPER_ID);
  const subjectsWithoutPyq = TEST_SUBJECTS.filter((s) => s.slug !== PYQ_GUIDE_SUBJECT_SLUG);
  const orderedPapers = [
    ...allPapers.filter((p) => p.subject === "Verified PYQ" || p.paperId === PYQ_GUIDE_PAPER_ID),
    ...allPapers.filter((p) => p.subject !== "Verified PYQ" && p.paperId !== PYQ_GUIDE_PAPER_ID),
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8 overflow-x-hidden font-hindi">
        <header className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            TAIPOQ Tests
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mock tests, verified PYQs and original practice papers — free to start.
          </p>
          <p className="text-xs text-muted-foreground">Content pack date: {PACK_PREPARED_DATE}</p>
        </header>

        {verifiedPyq ? (
          <section aria-labelledby="verified-pyq-heading" className="space-y-3">
            <div>
              <h2 id="verified-pyq-heading" className="text-lg font-bold">
                Official-Source Verified PYQ
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {PYQ_GUIDE_CONTENT_LABEL} — CTET January 2021 Paper I practice.
              </p>
            </div>
            <TestCard paper={verifiedPyq} subjectSlug={PYQ_GUIDE_SUBJECT_SLUG} />
          </section>
        ) : null}

        <CurrentAffairsToughPack02Card />

        <section aria-labelledby="basic-subjects-heading" className="space-y-3">
          <h2 id="basic-subjects-heading" className="text-lg font-bold">
            Choose a subject
          </h2>
          <Link to={SSC_CGL_PATTERN_PRACTICE_HREF} className={cn(SSC_CGL_PRACTICE_CARD)}>
            <span className="text-base font-semibold leading-snug text-[var(--text-primary)]">
              SSC CGL Pattern Practice
            </span>
            <span className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              100 starter questions — Maths, Reasoning, English, General Awareness
            </span>
            <span className="mt-1 text-[11px] text-[var(--status-warning)]">
              TAIPOQ original illustrative practice — not a verified PYQ
            </span>
            <span className="mt-2 text-sm font-semibold text-primary">Open Practice →</span>
          </Link>
          <SubjectTestGrid subjects={subjectsWithoutPyq} />
        </section>

        <section aria-labelledby="all-papers-heading" className="space-y-3">
          <h2 id="all-papers-heading" className="text-lg font-bold">
            All Test Papers — Free Practice
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {orderedPapers.map((paper) => (
              <li key={paper.paperId + paper.subject}>
                <TestCard paper={paper} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="legacy-tests-heading" className="space-y-3">
          <h2 id="legacy-tests-heading" className="text-lg font-bold">
            Typing and other practice
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LEGACY_TESTS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={cn(LEGACY_BTN)}>
                  <span className="text-base font-semibold">{item.title}</span>
                  <span className="text-sm text-muted-foreground">{item.subtitle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link
          to="/"
          className="inline-flex min-h-10 items-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
      </div>
    </PageShell>
  );
}
