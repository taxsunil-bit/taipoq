import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnswerReview } from "@/components/tests/AnswerReview";
import { MockTestResultSummary } from "@/components/mock-test/MockTestResultSummary";
import { QuestionPanel } from "@/components/tests/QuestionPanel";
import { TestLevelBadge } from "@/components/tests/TestLevelBadge";
import { TestResultSummary } from "@/components/tests/TestResultSummary";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/PageShell";
import { getSubjectTitle } from "@/content/tests/subjects";
import {
  buildSharedHubResultView,
  scoreHubPaperAttempt,
  usesSharedMockFoundation,
} from "@/lib/mockTestHubIntegration";
import { canAccessPaper, getAccessRequirementLabelHi } from "@/lib/tests/testAccess";
import {
  createShuffledSession,
  getAllPapers,
  getPaperBySlugs,
  getPaperRouteParams,
} from "@/lib/tests/testGenerator";
import {
  isPyqGuidePaper,
  PYQ_CTET_OFFICIAL_SOURCES,
  PYQ_CTET_PROVENANCE_LINE,
  PYQ_CTET_SEO_DESCRIPTION,
  PYQ_CTET_SEO_TITLE,
  PYQ_GUIDE_CONTENT_LABEL,
} from "@/lib/tests/pyqGuide";
import {
  isDailyMissionCurrentAffairsPaper,
  isDailyMissionMiniMockPaper,
  markDailyMissionTaskComplete,
} from "@/lib/dailyMission";
import { getTestAttempt, saveTestAttempt } from "@/lib/tests/testStorage";
import type { TestAttemptAnswers } from "@/lib/tests/testTypes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tests/$subject/$paperId")({
  head: ({ params }) => {
    const paper = getPaperBySlugs(params.subject, params.paperId);
    const subjectTitle = getSubjectTitle(params.subject);
    if (isPyqGuidePaper(params.subject, params.paperId)) {
      return {
        meta: [
          { title: PYQ_CTET_SEO_TITLE },
          { name: "description", content: PYQ_CTET_SEO_DESCRIPTION },
        ],
      };
    }
    const pageTitle = paper
      ? `${paper.title} — ${subjectTitle} — TAIPOQ`
      : `${subjectTitle} — TAIPOQ`;
    return { meta: [{ title: pageTitle }] };
  },
  component: PaperTestPage,
});

type Phase = "intro" | "active" | "result";

function PaperNotFound({ subject, paperId }: { subject: string; paperId: string }) {
  const available = getAllPapers()
    .filter((p) => getPaperRouteParams(p).subject === subject)
    .map((p) => ({
      paperId: p.paperId,
      title: p.title,
      href: `/tests/${subject}/${p.paperId}`,
    }));

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-4 font-hindi">
        <h1 className="font-display text-2xl font-bold">Test paper not found</h1>
        <p className="text-muted-foreground">
          No paper matched{" "}
          <code className="font-mono text-sm">
            /tests/{subject}/{paperId}
          </code>
        </p>
        {available.length > 0 ? (
          <ul className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
            <li className="font-semibold text-foreground">Available papers for this subject:</li>
            {available.map((p) => (
              <li key={p.paperId}>
                <Link
                  to="/tests/$subject/$paperId"
                  params={{ subject, paperId: p.paperId }}
                  className="text-primary hover:underline"
                >
                  {p.title} — {p.paperId}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <Link to="/tests/$subject" params={{ subject }} className="text-primary hover:underline">
          ← Back to subject
        </Link>
      </div>
    </PageShell>
  );
}

function PaperTestPage() {
  const { subject, paperId } = Route.useParams();
  const paper = getPaperBySlugs(subject, paperId);

  if (!paper) {
    return <PaperNotFound subject={subject} paperId={paperId} />;
  }

  const unlocked = canAccessPaper(paper);
  const useSharedFoundation = usesSharedMockFoundation(subject, paperId);
  const [phase, setPhase] = useState<Phase>("intro");
  const [sessionKey, setSessionKey] = useState(0);
  const questions = useMemo(
    () => (unlocked ? createShuffledSession(paper) : []),
    [paper, unlocked, sessionKey],
  );
  const [answers, setAnswers] = useState<TestAttemptAnswers>({});
  const lastAttempt = getTestAttempt(subject, paperId);

  const result = useMemo(() => {
    if (phase !== "result") return null;
    return scoreHubPaperAttempt(subject, paperId, questions, answers);
  }, [phase, questions, answers, subject, paperId]);

  const sharedResultView = useMemo(() => {
    if (phase !== "result" || !useSharedFoundation) return null;
    return buildSharedHubResultView(subject, paperId, questions, answers);
  }, [phase, useSharedFoundation, subject, paperId, questions, answers]);

  function handleStart() {
    setAnswers({});
    setSessionKey((k) => k + 1);
    setPhase("active");
  }

  function handleSubmit() {
    const scored = scoreHubPaperAttempt(subject, paperId, questions, answers);
    saveTestAttempt({
      paperId: paper.paperId,
      subject: paper.subject,
      subjectSlug: subject,
      title: paper.title,
      score: scored.score,
      total: scored.total,
      percentage: scored.percentage,
      attemptedAt: new Date().toISOString(),
      answers,
    });
    if (isDailyMissionCurrentAffairsPaper(subject, paper.paperId)) {
      markDailyMissionTaskComplete("currentAffairs", {
        source: "tests-hub-current-affairs",
        result: {
          score: scored.score,
          total: scored.total,
          percentage: scored.percentage,
        },
      });
    } else if (isDailyMissionMiniMockPaper(subject, paper.paperId)) {
      markDailyMissionTaskComplete("miniMock", {
        source: "tests-hub-model-paper-01",
        result: {
          score: scored.score,
          total: scored.total,
          percentage: scored.percentage,
        },
      });
    }
    setPhase("result");
  }

  function handleRetry() {
    handleStart();
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const isCA = paper.subject === "Current Affairs";
  const isPyqGuide = isPyqGuidePaper(subject, paperId);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 font-hindi">
        <header className="space-y-2">
          <Link
            to="/tests/$subject"
            params={{ subject }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {getSubjectTitle(subject)}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{paper.title}</h1>
            {isPyqGuide ? (
              <span className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                {PYQ_GUIDE_CONTENT_LABEL}
              </span>
            ) : null}
            <TestLevelBadge level={paper.level} className="text-blue-950" />
          </div>
          <p className="text-muted-foreground">{paper.intro}</p>
          {isPyqGuide ? (
            <p className="text-sm font-medium text-foreground/90">{PYQ_CTET_PROVENANCE_LINE}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {paper.questionCount} प्रश्न · {paper.durationMinutes} मिनट ·{" "}
            {getAccessRequirementLabelHi(paper.access)}
          </p>
          {isCA ? (
            <p className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-sm text-amber-100/90">
              Current Affairs questions are date-stamped. Refresh before long-term use.
            </p>
          ) : null}
        </header>

        {unlocked && phase === "intro" ? (
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            {isPyqGuide ? (
              <>
                <p className="text-sm leading-relaxed text-foreground">
                  Official-source verified adapted PYQs from CTET January 2021 Paper I, Main Set I,
                  Child Development and Pedagogy (Questions 1–10). Explanations are prepared for
                  digital practice and are not official CBSE or CTET publications.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Official sources
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {PYQ_CTET_OFFICIAL_SOURCES.map((source) => (
                      <li key={source.href}>
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
            <p
              className={cn("text-sm leading-relaxed text-muted-foreground", isPyqGuide && "mt-3")}
            >
              प्रश्न shuffle होंगे। विकल्प भी shuffle होंगे। Login की आवश्यकता नहीं।
            </p>
            {lastAttempt ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Last attempt: {lastAttempt.score}/{lastAttempt.total} ({lastAttempt.percentage}%)
              </p>
            ) : null}
            <Button type="button" className="mt-4 min-h-11 w-full sm:w-auto" onClick={handleStart}>
              Open Test — आरम्भ करें
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">Result तुरंत देखें</p>
          </section>
        ) : null}

        {unlocked && phase === "active" ? (
          <>
            <QuestionPanel
              questions={questions}
              answers={answers}
              onSelect={(questionId, optionIndex) =>
                setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
              }
            />
            <Button
              type="button"
              className="min-h-11 w-full sm:w-auto"
              disabled={!allAnswered}
              onClick={handleSubmit}
            >
              Submit — परिणाम देखें
            </Button>
          </>
        ) : null}

        {unlocked && phase === "result" && result ? (
          <>
            {useSharedFoundation && sharedResultView ? (
              <MockTestResultSummary
                title={paper.title}
                result={sharedResultView.mockResult}
                analysis={sharedResultView.analysis}
                attemptedAt={new Date().toISOString()}
              />
            ) : (
              <TestResultSummary
                title={paper.title}
                result={result}
                attemptedAt={new Date().toISOString()}
              />
            )}
            <section className="space-y-3">
              <h2 className="text-lg font-bold">उत्तर समीक्षा / Answer Review</h2>
              <AnswerReview
                questions={questions}
                answers={answers}
                onSelect={() => undefined}
                disabled
                showReview
              />
            </section>
            <div className="flex flex-wrap gap-2">
              <Button type="button" className="min-h-11" onClick={handleRetry}>
                पुनः प्रयास
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <Link to="/tests/$subject" params={{ subject }}>
                  Subject tests
                </Link>
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
