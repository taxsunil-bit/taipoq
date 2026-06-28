import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CurrentAffairsPaperCard } from "@/components/current-affairs/CurrentAffairsPaperCard";
import { PageShell } from "@/components/PageShell";
import {
  CURRENT_AFFAIRS_EXAM_FILTERS,
  filterPapersByExam,
  MIXED_PAPER_ID,
  type CurrentAffairsExamFilter,
} from "@/content/currentAffairsPapers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/current-affairs/")({
  head: () => ({
    meta: [
      { title: "समसामयिक प्रश्नपत्र — TAIPOQ" },
      {
        name: "description",
        content:
          "SSC, Railway, PET और Police परीक्षाओं के लिए समसामयिक प्रश्न — Practice और Test Mode।",
      },
    ],
  }),
  component: CurrentAffairsLanding,
});

function CurrentAffairsLanding() {
  const [filter, setFilter] = useState<CurrentAffairsExamFilter>("All");
  const papers = filterPapersByExam(filter);

  return (
    <PageShell>
      <div className="min-h-[calc(100vh-8rem)] overflow-x-hidden bg-slate-50 font-hindi">
        <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">समसामयिक प्रश्नपत्र</h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
              SSC, Railway, PET और Police परीक्षाओं के लिए घटना + पृष्ठभूमि + अभ्यास
            </p>
          </header>

          <Link
            to="/current-affairs/paper/$paperId"
            params={{ paperId: MIXED_PAPER_ID }}
            search={{ mode: "practice" }}
            className={cn(
              "flex min-h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto sm:min-w-[16rem]",
            )}
          >
            Mixed Practice आरम्भ करें
          </Link>

          <section aria-labelledby="ca-filter-heading">
            <h2 id="ca-filter-heading" className="sr-only">
              Exam filter
            </h2>
            <div className="flex flex-wrap gap-2">
              {CURRENT_AFFAIRS_EXAM_FILTERS.map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setFilter(exam)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    filter === exam
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                  aria-pressed={filter === exam}
                >
                  {exam === "All" ? "All" : exam}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="ca-papers-heading" className="space-y-4">
            <h2 id="ca-papers-heading" className="text-lg font-bold text-slate-900">
              प्रश्नपत्र
            </h2>
            {papers.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                इस exam के लिए अभी कोई paper नहीं है।
              </p>
            ) : (
              <ul className="space-y-4">
                {papers.map((paper) => (
                  <li key={paper.id}>
                    <CurrentAffairsPaperCard paper={paper} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
