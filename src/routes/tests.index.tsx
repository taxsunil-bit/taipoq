import { createFileRoute, Link } from "@tanstack/react-router";
import { SubjectTestGrid } from "@/components/tests/SubjectTestGrid";
import { TestCard } from "@/components/tests/TestCard";
import { CurrentAffairsToughPack02Card } from "@/components/current-affairs-pack-02/CurrentAffairsToughPack02Card";
import { PageShell } from "@/components/PageShell";
import { SSC_CGL_PATTERN_PRACTICE_HREF } from "@/content/sscCglPatternPracticeContent";
import { PACK_PREPARED_DATE, TEST_SUBJECTS } from "@/content/tests/subjects";
import { getAllPapers } from "@/lib/tests/testGenerator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tests/")({
  head: () => ({
    meta: [
      { title: "TAIPOQ Tests — All practice free" },
      {
        name: "description",
        content: "Subject tests, model papers and official-source verified PYQs — Computer, Maths, Reasoning, Current Affairs and more.",
      },
    ],
  }),
  component: TestsLandingPage,
});

const LEGACY_TESTS = [
  { title: "Typing Speed Test", subtitle: "समय आधारित typing speed जाँच", to: "/test" as const },
  { title: "Model Paper Test", subtitle: "पूर्ण प्रश्नपत्र अभ्यास", to: "/model-paper-test" as const },
  { title: "Current Affairs Hub", subtitle: "समसामयिक अभ्यास", to: "/current-affairs" as const },
  { title: "General Science Test", subtitle: "विज्ञान model test", to: "/study-corner/general-science/model-test-01" as const },
] as const;

const LEGACY_BTN =
  "flex min-h-[52px] w-full flex-col justify-center rounded-xl border border-border bg-surface px-4 py-3.5 text-left hover:bg-surface-hover";

const SSC_CGL_PRACTICE_CARD =
  "flex min-h-[52px] w-full flex-col justify-center rounded-xl border border-blue-300/30 bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-4 text-white shadow-md shadow-blue-950/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-600/20";

function TestsLandingPage() {
  const allPapers = getAllPapers();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8 overflow-x-hidden font-hindi">
        <header className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">TAIPOQ Tests</h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            सभी tests अभी निःशुल्क — Basic practice unlimited और free.
          </p>
          <p className="text-xs text-muted-foreground">Pack prepared: {PACK_PREPARED_DATE}</p>
        </header>

        <CurrentAffairsToughPack02Card />

        <section aria-labelledby="basic-subjects-heading" className="space-y-3">
          <h2 id="basic-subjects-heading" className="text-lg font-bold">
            विषय चुनें — All subjects open
          </h2>
          <Link to={SSC_CGL_PATTERN_PRACTICE_HREF} className={cn(SSC_CGL_PRACTICE_CARD)}>
            <span className="text-base font-semibold leading-snug">SSC CGL Pattern Practice</span>
            <span className="mt-1 text-sm leading-relaxed text-blue-100">
              100 starter questions — Maths, Reasoning, English, General Awareness
            </span>
            <span className="mt-1 text-[11px] text-amber-100/90">
              TAIPOQ original illustrative practice
            </span>
            <span className="mt-2 text-sm font-semibold text-white">Open Practice →</span>
          </Link>
          <SubjectTestGrid subjects={TEST_SUBJECTS} />
        </section>

        <section aria-labelledby="all-papers-heading" className="space-y-3">
          <h2 id="all-papers-heading" className="text-lg font-bold">
            All Test Papers — Free Practice
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {allPapers.map((paper) => (
              <li key={paper.paperId + paper.subject}>
                <TestCard paper={paper} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="legacy-tests-heading" className="space-y-3">
          <h2 id="legacy-tests-heading" className="text-lg font-bold">
            Typing & Other TAIPOQ Tests
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
