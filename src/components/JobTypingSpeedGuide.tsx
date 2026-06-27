import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SpeedLevel = {
  wpm: string;
  label: string;
  text: string;
};

const CORE_LEVELS: SpeedLevel[] = [
  { wpm: "25", label: "Practice Level", text: "Basic practice start karne ke liye." },
  { wpm: "30", label: "RRB English Target", text: "Railway/clerical type practice ke liye common English target." },
  { wpm: "35", label: "SSC/DSSSB Safer Target", text: "Government job typing preparation ke liye stronger target." },
  { wpm: "40", label: "Office/Data Entry Comfort", text: "Daily office/data entry work ke liye better comfort speed." },
];

const PRO_LEVEL: SpeedLevel = {
  wpm: "45–50",
  label: "Strong Professional Level",
  text: "Fast typing aur serious data-entry practice ke liye.",
};

export function JobTypingSpeedGuide({
  variant = "full",
  testLinkLabel = "Take Speed Test",
  showTestLink = true,
  className,
}: {
  variant?: "compact" | "full";
  testLinkLabel?: string;
  showTestLink?: boolean;
  className?: string;
}) {
  const levels = variant === "compact" ? CORE_LEVELS : [...CORE_LEVELS, PRO_LEVEL];
  const wrapperClass =
    variant === "compact"
      ? cn("bento-tile overflow-hidden p-6 md:p-8", className)
      : cn("rounded-3xl border border-border bg-card/60 p-6 md:p-8", className);

  return (
    <section className={wrapperClass} aria-labelledby="job-typing-speed-heading">
      <h2 id="job-typing-speed-heading" className="font-display text-xl font-bold tracking-tight md:text-2xl">
        Minimum Typing Speed for Jobs
      </h2>

      {variant === "full" && (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Har job/exam ki typing speed alag ho sakti hai. Final requirement hamesha official notification se verify karein.
          TAIPOQ me ye targets practice guidance ke liye diye gaye hain.
        </p>
      )}

      {variant === "compact" && (
        <p className="mt-2 text-sm text-muted-foreground">
          Practice targets for RRB, SSC, DSSSB, and office typing — verify final rules from official notification.
        </p>
      )}

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {levels.map((level) => (
          <li
            key={level.label}
            className="rounded-2xl border border-border bg-surface/50 p-4 transition-colors hover:border-border/80 hover:bg-surface-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-snug text-foreground">{level.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{level.text}</p>
              </div>
              <span
                className="shrink-0 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-sm font-bold text-foreground"
                aria-label={`${level.wpm} words per minute`}
              >
                {level.wpm} WPM
              </span>
            </div>
          </li>
        ))}
      </ul>

      {variant === "full" && (
        <>
          <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Speed se zyada accuracy important hai. Target: <b className="text-foreground">35–40 WPM with 90%+ accuracy</b>.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild>
              <Link to="/test">{testLinkLabel}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/typing-start-guide">Learn Finger Placement</Link>
            </Button>
          </div>
        </>
      )}

      {variant === "compact" && showTestLink && (
        <div className="mt-5">
          <Button asChild size="sm" className="min-h-11 w-full sm:w-auto">
            <Link to="/test">{testLinkLabel}</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
