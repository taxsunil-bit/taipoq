import { Link } from "@tanstack/react-router";
import { PRODUCT_CARD } from "@/lib/brand";
import { cn } from "@/lib/utils";

export type ProductToolAccent = "tests" | "pyqs" | "msl" | "mission" | "jobs" | "progress";

const ACCENT_STYLES: Record<ProductToolAccent, { bar: string; cta: string; badge: string }> = {
  tests: {
    bar: "bg-[#2563EB]",
    cta: "text-[#2563EB]",
    badge: "bg-[#EFF6FF] text-[#2563EB]",
  },
  pyqs: {
    bar: "bg-[#4F46E5]",
    cta: "text-[#4F46E5]",
    badge: "bg-[#EEF2FF] text-[#4F46E5]",
  },
  msl: {
    bar: "bg-[#0F766E]",
    cta: "text-[#0F766E]",
    badge: "bg-[#F0FDFA] text-[#0F766E]",
  },
  mission: {
    bar: "bg-[#D97706]",
    cta: "text-[#D97706]",
    badge: "bg-[#FFFBEB] text-[#D97706]",
  },
  jobs: {
    bar: "bg-[#15803D]",
    cta: "text-[#15803D]",
    badge: "bg-[#F0FDF4] text-[#15803D]",
  },
  progress: {
    bar: "bg-[#7C3AED]",
    cta: "text-[#7C3AED]",
    badge: "bg-[#F5F3FF] text-[#7C3AED]",
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
          <h3 className="text-base font-semibold leading-snug text-[#0F172A]">{title}</h3>
          {hindiTitle ? (
            <p className="mt-0.5 font-hindi text-sm font-medium text-[#475569]">{hindiTitle}</p>
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
      <p className="mt-2 flex-1 pl-2 text-sm leading-relaxed text-[#475569]">{description}</p>
      {supportingLabel ? (
        <p className="mt-1 pl-2 text-xs font-medium text-[#475569]">{supportingLabel}</p>
      ) : null}
      <span className={cn("mt-3 pl-2 text-sm font-semibold", styles.cta)}>{cta} →</span>
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
