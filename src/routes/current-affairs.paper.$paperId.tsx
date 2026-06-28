import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CurrentAffairsPracticeView } from "@/components/current-affairs/CurrentAffairsPracticeView";
import { CurrentAffairsTestView } from "@/components/current-affairs/CurrentAffairsTestView";
import { PageShell } from "@/components/PageShell";
import { formatExamLabel, getCurrentAffairsPaper, getPaperAvailabilityLabel, getPaperTopics } from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/current-affairs/paper/$paperId")({
  validateSearch: z.object({
    mode: z.enum(["practice", "test"]).optional(),
  }),
  head: ({ params }) => {
    const paper = getCurrentAffairsPaper(params.paperId);
    return {
      meta: [
        {
          title: paper
            ? `${paper.title} — समसामयिक — TAIPOQ`
            : "प्रश्नपत्र — समसामयिक — TAIPOQ",
        },
      ],
    };
  },
  component: CurrentAffairsPaperPage,
});

const BTN =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition-colors sm:w-auto";

function CurrentAffairsPaperPage() {
  const { paperId } = Route.useParams();
  const { mode } = Route.useSearch();
  const paper = getCurrentAffairsPaper(paperId);

  if (!paper) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg space-y-4 p-4 font-hindi">
          <h1 className="text-xl font-bold">प्रश्नपत्र नहीं मिला</h1>
          <p className="text-sm text-muted-foreground">यह paper उपलब्ध नहीं है।</p>
          <Link to="/current-affairs" className={cn(BTN, "bg-blue-600 text-white hover:bg-blue-700")}>
            Back to Current Affairs
          </Link>
        </div>
      </PageShell>
    );
  }

  const topics = getPaperTopics(paper);

  return (
    <PageShell>
      <div className="min-h-[calc(100vh-8rem)] overflow-x-hidden bg-slate-50 font-hindi">
        <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
          <Link
            to="/current-affairs"
            className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← समसामयिक प्रश्नपत्र
          </Link>

          <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                {formatExamLabel(paper.exam)}
              </span>
              {mode && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  {mode === "practice" ? "Practice Mode" : "Test Mode"}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">{paper.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{getPaperAvailabilityLabel(paper)}</p>
            {topics.length > 0 && (
              <p className="mt-2 text-sm text-slate-600">Topics: {topics.join(" · ")}</p>
            )}
          </header>

          {!mode ? (
            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Mode चुनें</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Practice Mode में तुरंत उत्तर और व्याख्या मिलती है। Test Mode में अंत में result दिखता है।
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/current-affairs/paper/$paperId"
                  params={{ paperId }}
                  search={{ mode: "practice" }}
                  className={cn(BTN, "bg-blue-600 text-white hover:bg-blue-700")}
                >
                  Practice Mode
                </Link>
                <Link
                  to="/current-affairs/paper/$paperId"
                  params={{ paperId }}
                  search={{ mode: "test" }}
                  className={cn(BTN, "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100")}
                >
                  Test Mode
                </Link>
              </div>
            </section>
          ) : mode === "practice" ? (
            <CurrentAffairsPracticeView paper={paper} />
          ) : (
            <CurrentAffairsTestView paper={paper} />
          )}
        </div>
      </div>
    </PageShell>
  );
}
