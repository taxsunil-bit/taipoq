import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { VerifiedVacancyCard } from "@/components/VerifiedVacancyCard";
import { filterHomepageJobTeaserItems } from "@/lib/homeJobTeaser";
import { loadVacanciesLive } from "@/lib/vacancies";

type LoadState = "loading" | "ready" | "error";

export function HomeJobUpdatesTeaser() {
  const [items, setItems] = useState<ReturnType<typeof filterHomepageJobTeaserItems>>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    loadVacanciesLive()
      .then((result) => {
        if (cancelled) return;
        setItems(filterHomepageJobTeaserItems(result.payload.items));
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showEmpty = state === "ready" && items.length === 0;
  const showError = state === "error";

  return (
    <section
      className="bento-tile space-y-4 p-5 md:p-6"
      aria-labelledby="home-job-updates-heading"
    >
      <div className="space-y-1">
        <h2 id="home-job-updates-heading" className="font-display text-xl font-bold tracking-tight md:text-2xl">
          Verified Job Updates
        </h2>
        {state === "loading" ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Checking verified job updates…
          </p>
        ) : null}
        {state === "ready" && items.length > 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {items.length} highlighted verified update{items.length === 1 ? "" : "s"} — always confirm on
            official notifications.
          </p>
        ) : null}
      </div>

      {state === "ready" && items.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <VerifiedVacancyCard item={item} />
            </li>
          ))}
        </ul>
      ) : null}

      {showEmpty || showError ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-4 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">
            No verified open job updates are available at present.
          </p>
          <p className="mt-2">
            TAIPOQ publishes a vacancy only after checking the official source and application dates.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/upcoming-exams"
              className="inline-flex min-h-11 items-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
            >
              View Upcoming Exams
            </Link>
            <Link
              to="/tests"
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 py-2 text-sm font-medium"
            >
              Attempt a Mock Test
            </Link>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 py-2 text-sm font-medium"
            >
              Check Again Later
            </Link>
          </div>
        </div>
      ) : null}

      {!showEmpty && !showError ? (
        <Link
          to="/upcoming-exams"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition-transform active:scale-[0.98] sm:w-auto"
        >
          View All Job Updates
        </Link>
      ) : null}
    </section>
  );
}
