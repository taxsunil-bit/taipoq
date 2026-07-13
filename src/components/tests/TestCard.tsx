import { Link } from "@tanstack/react-router";
import { getTestLevelLabel } from "@/content/tests/testLevels";
import {
  canAccessPaper,
  getAccessRequirementLabelHi,
  getTestCardCtaLabel,
  getTestResultHint,
} from "@/lib/tests/testAccess";
import { getPaperRouteParams } from "@/lib/tests/testGenerator";
import { isPyqGuideSubjectSlug, PYQ_GUIDE_CONTENT_LABEL } from "@/lib/tests/pyqGuide";
import type { TestPaper } from "@/lib/tests/testTypes";
import { cn } from "@/lib/utils";

type TestCardProps = {
  paper: TestPaper;
  subjectSlug?: string;
  className?: string;
};

export function TestCard({ paper, subjectSlug, className }: TestCardProps) {
  const routeParams = getPaperRouteParams(paper);
  const subject = subjectSlug ?? routeParams.subject;
  const paperId = routeParams.paperId;
  const unlocked = canAccessPaper(paper);
  const isCA = paper.subject === "Current Affairs";
  const isPyqGuide = isPyqGuideSubjectSlug(subject);
  const resultHint = getTestResultHint();

  const cardClass = cn(
    "flex min-h-[52px] w-full cursor-pointer flex-col rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3.5 text-left shadow-[var(--shadow-subtle)] transition-all duration-[var(--duration-standard)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-px",
    !unlocked && "cursor-not-allowed opacity-80",
    className,
  );

  const inner = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-[17px] font-semibold leading-snug text-[var(--text-primary)]">
          {paper.title}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {isPyqGuide ? (
            <span className="rounded-full border border-[var(--status-warning)]/25 bg-[var(--status-warning-container)] px-2 py-0.5 text-[11px] font-semibold text-[var(--status-warning)]">
              {PYQ_GUIDE_CONTENT_LABEL}
            </span>
          ) : null}
          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--cs-primary-container)] px-2 py-0.5 text-[11px] font-semibold text-[var(--cs-on-primary-container)]">
            {getTestLevelLabel(paper.level)}
          </span>
        </div>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">{paper.intro}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
        <span>{paper.questionCount} प्रश्न</span>
        <span>·</span>
        <span>{paper.durationMinutes} मिनट</span>
        <span>·</span>
        <span>{getAccessRequirementLabelHi(paper.access)}</span>
      </div>
      {isCA ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--status-warning)]">
          Current Affairs questions are date-stamped. Refresh before long-term use.
        </p>
      ) : null}
      <span className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-2 hover:underline">
        {getTestCardCtaLabel()}
      </span>
      {resultHint ? <span className="text-xs text-[var(--text-muted)]">{resultHint}</span> : null}
    </>
  );

  if (!unlocked) {
    return (
      <div className={cardClass} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link to="/tests/$subject/$paperId" params={{ subject, paperId }} className={cardClass}>
      {inner}
    </Link>
  );
}
