import { Link } from "@tanstack/react-router";
import type { CurrentAffairsPaper } from "@/content/currentAffairsPapers";
import { formatExamLabel, getPaperAvailabilityLabel, getPaperTopics } from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";

const BTN =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors active:scale-[0.98]";

type Props = {
  paper: CurrentAffairsPaper;
};

export function CurrentAffairsPaperCard({ paper }: Props) {
  const topics = getPaperTopics(paper);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
          {formatExamLabel(paper.exam)}
        </span>
        <span className="text-xs text-slate-500">{getPaperAvailabilityLabel(paper)}</span>
      </div>
      <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 sm:text-lg">{paper.title}</h3>
      {topics.length > 0 && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          <span className="font-medium text-slate-700">Topics: </span>
          {topics.join(" · ")}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to="/current-affairs/paper/$paperId"
          params={{ paperId: paper.id }}
          search={{ mode: "practice" }}
          className={cn(BTN, "bg-blue-600 text-white hover:bg-blue-700")}
        >
          Practice Mode
        </Link>
        <Link
          to="/current-affairs/paper/$paperId"
          params={{ paperId: paper.id }}
          search={{ mode: "test" }}
          className={cn(BTN, "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100")}
        >
          Test Mode
        </Link>
      </div>
    </article>
  );
}
