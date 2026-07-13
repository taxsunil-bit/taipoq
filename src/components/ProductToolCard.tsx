import { Link } from "@tanstack/react-router";
import { PRODUCT_CARD } from "@/lib/brand";
import { cn } from "@/lib/utils";

export type ProductToolAccent = "tests" | "pyqs" | "msl" | "mission" | "jobs" | "progress";

const ACCENT_STYLES: Record<ProductToolAccent, { bar: string; cta: string; badge: string }> = {
  tests: {
    bar: "bg-[var(--tq-tests)]",
    cta: "text-[var(--tq-tests)]",
    badge: "bg-[var(--tq-pale-tests)] text-[var(--tq-tests)]",
  },
  pyqs: {
    bar: "bg-[var(--tq-pyqs)]",
    cta: "text-[var(--tq-pyqs)]",
    badge: "bg-[var(--tq-pale-pyqs)] text-[var(--tq-pyqs)]",
  },
  msl: {
    bar: "bg-[var(--tq-msl)]",
    cta: "text-[var(--tq-msl)]",
    badge: "bg-[var(--tq-pale-msl)] text-[var(--tq-msl)]",
  },
  mission: {
    bar: "bg-[var(--tq-mission)]",
    cta: "text-[var(--tq-mission)]",
    badge: "bg-[var(--tq-pale-mission)] text-[var(--tq-mission)]",
  },
  jobs: {
    bar: "bg-[var(--tq-jobs)]",
    cta: "text-[var(--tq-jobs)]",
    badge: "bg-[var(--tq-pale-jobs)] text-[var(--tq-jobs)]",
  },
  progress: {
    bar: "bg-[var(--tq-progress)]",
    cta: "text-[var(--tq-progress)]",
    badge: "bg-[var(--tq-pale-progress)] text-[var(--tq-progress)]",
  },
};

type ProductToolCardProps = {
  title: string;
  description: string;
  cta: string;
  accent: ProductToolAccent;
  badge?: string;
  supportingLabel?: string;
  hindiTitle?: string;
  className?: string;
} & (
  | {
      to:
        | "/tests"
        | "/daily-mission"
        | "/math-speed-lab"
        | "/upcoming-exams"
        | "/progress"
        | "/login";
      params?: never;
    }
  | {
      to: "/tests/$subject/$paperId";
      params: { subject: string; paperId: string };
    }
  | {
      to: "/study-corner/ssc-cgl-pattern-practice";
      params?: never;
    }
);

export function ProductToolCard(props: ProductToolCardProps) {
  const { title, description, cta, to, accent, badge, supportingLabel, hindiTitle, className } =
    props;
  const styles = ACCENT_STYLES[accent];
  const accessibleName = [title, hindiTitle, description, supportingLabel, cta]
    .filter(Boolean)
    .join(". ");

  const classNames = cn(
    PRODUCT_CARD,
    "relative flex min-h-[148px] flex-col overflow-hidden p-4",
    className,
  );

  const content = (
    <>
      <span className={cn("absolute inset-y-0 left-0 w-1", styles.bar)} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2 pl-2">
        <div>
          <h3 className="text-[17px] font-semibold leading-snug text-[var(--text-primary)]">
            {title}
          </h3>
          {hindiTitle ? (
            <p className="mt-0.5 font-hindi text-sm font-medium text-[var(--text-secondary)]">
              {hindiTitle}
            </p>
          ) : null}
        </div>
        {badge ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              styles.badge,
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex-1 pl-2 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
      {supportingLabel ? (
        <p className="mt-1 pl-2 text-xs font-medium text-[var(--text-muted)]">{supportingLabel}</p>
      ) : null}
      <span className={cn("mt-3 pl-2 text-[15px] font-semibold", styles.cta)}>{cta} →</span>
    </>
  );

  if (to === "/tests/$subject/$paperId" && "params" in props && props.params) {
    return (
      <Link
        to="/tests/$subject/$paperId"
        params={props.params}
        aria-label={accessibleName}
        className={classNames}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link to={to} aria-label={accessibleName} className={classNames}>
      {content}
    </Link>
  );
}
