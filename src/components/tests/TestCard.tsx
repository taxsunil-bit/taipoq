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
    "flex min-h-[52px] w-full cursor-pointer flex-col rounded-xl border border-blue-300/30 bg-gradient-to-br from-blue-600/90 to-blue-700/90 px-4 py-3.5 text-left text-white transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-600/20",
    !unlocked && "cursor-not-allowed opacity-80",
    className,
  );

  const inner = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-base font-semibold leading-snug text-white">{paper.title}</span>
        <div className="flex flex-wrap gap-1.5">
          {isPyqGuide ? (
            <span className="rounded-full border border-amber-200/40 bg-amber-100/15 px-2 py-0.5 text-[11px] font-semibold text-amber-100">
              {PYQ_GUIDE_CONTENT_LABEL}
            </span>
          ) : null}
          <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
            {getTestLevelLabel(paper.level)}
          </span>
        </div>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-blue-100">{paper.intro}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-blue-100/90">
        <span>{paper.questionCount} प्रश्न</span>
        <span>·</span>
        <span>{paper.durationMinutes} मिनट</span>
        <span>·</span>
        <span>{getAccessRequirementLabelHi(paper.access)}</span>
      </div>
      {isCA ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-200/90">
          Current Affairs questions are date-stamped. Refresh before long-term use.
        </p>
      ) : null}
      <span className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-white underline-offset-2 hover:underline">
        {getTestCardCtaLabel()}
      </span>
      {resultHint ? (
        <span className="text-xs text-blue-100/90">{resultHint}</span>
      ) : null}
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
    <Link
      to="/tests/$subject/$paperId"
      params={{ subject, paperId }}
      className={cardClass}
    >
      {inner}
    </Link>
  );
}
