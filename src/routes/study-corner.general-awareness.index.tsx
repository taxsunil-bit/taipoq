import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { GA_COURSE, GA_MODEL_TEST } from "@/content/studyCornerContent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/study-corner/general-awareness/")({
  head: () => ({
    meta: [
      { title: "सामान्य जागरूकता अभ्यास — TAIPOQ" },
      {
        name: "description",
        content:
          "SSC, रेलवे, CDS, NDA और उत्तर प्रदेश परीक्षाओं की प्रवृत्ति पर आधारित सरल online अभ्यास।",
      },
    ],
  }),
  component: GeneralAwarenessLanding,
});

function GeneralAwarenessLanding() {
  return (
    <PageShell>
      <div className="min-h-[calc(100vh-8rem)] overflow-x-hidden bg-slate-50 font-hindi">
        <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              सामान्य जागरूकता अभ्यास
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">General Awareness Practice</p>
            <p className="max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
              SSC, रेलवे, CDS, NDA और उत्तर प्रदेश परीक्षाओं की प्रवृत्ति पर आधारित सरल online
              अभ्यास।
            </p>
          </header>

          <Link
            to="/study-corner"
            className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← पुस्तकालय / Library
          </Link>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{GA_MODEL_TEST.titleHi}</h2>
            <p className="mt-2 text-sm text-slate-600">{GA_MODEL_TEST.titleEn}</p>
            <ul className="mt-4 space-y-2 text-base text-slate-700">
              <li>• {GA_MODEL_TEST.meta}</li>
              <li>• ऋणात्मक अंकन नहीं</li>
              <li>• स्तर: आरम्भिक से मध्यम</li>
            </ul>
            <Link
              to={GA_MODEL_TEST.href}
              className={cn(
                "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto",
              )}
            >
              {GA_MODEL_TEST.buttonLabel}
            </Link>
          </section>

          <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {GA_MODEL_TEST.sourceNote}
          </p>

          <section aria-labelledby="ga-chapters-heading">
            <h2 id="ga-chapters-heading" className="mb-4 text-xl font-bold text-slate-900">
              पठन अध्याय
            </h2>
            <p className="mb-4 text-base text-slate-600">{GA_COURSE.intro}</p>
            <ul className="space-y-3">
              {GA_COURSE.chapters.map((ch, index) => (
                <li
                  key={ch.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500">अध्याय {index + 1}</p>
                    <p className="mt-1 text-base font-semibold leading-snug text-slate-900 md:text-lg">
                      {ch.title}
                    </p>
                    {ch.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                        {ch.description}
                      </p>
                    )}
                  </div>
                  <Link
                    to={ch.href}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-100 sm:text-base"
                  >
                    {ch.buttonLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
