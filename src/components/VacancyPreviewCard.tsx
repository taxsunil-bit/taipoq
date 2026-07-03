import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  canShowApplyButton,
  classifyVacancyTrust,
  getVacancyTrustLabel,
  isHttpsUrl,
} from "@/lib/vacancies";
import { formatDisplayDate, getPrepareLinkLabel, resolvePrepareLink } from "@/lib/upcomingExams";
import type { VacancyItem } from "@/types/vacancy";
import { cn } from "@/lib/utils";

type VacancyPreviewCardProps = {
  item: VacancyItem;
};

const actionButtonClass =
  "h-auto min-h-11 max-w-full whitespace-normal break-words text-center";

function statusBadgeClass(status: VacancyItem["status"], isPreparationOnly: boolean) {
  if (isPreparationOnly || status === "preparation_only") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300";
  }
  switch (status) {
    case "verification_pending":
      return "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200";
    case "archive":
      return "border-border bg-muted/40 text-muted-foreground";
    case "active":
    case "closing_soon":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
    case "correction_window":
      return "border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-300";
    case "closed":
      return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300";
    default:
      return "border-border bg-muted/30 text-foreground";
  }
}

function cardSurfaceClass(item: VacancyItem) {
  if (item.status === "archive") {
    return "border-border/60 bg-card/50 opacity-80";
  }
  if (item.status === "verification_pending") {
    return "border-amber-500/25 bg-card/80";
  }
  if (item.isPreparationOnly || item.status === "preparation_only") {
    return "border-sky-500/20 bg-card/80";
  }
  return "border-border bg-card/80";
}

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}

function PreparationLinkButton({ href }: { href: string }) {
  const prepare = resolvePrepareLink(href);
  const label = getPrepareLinkLabel(href);

  if (prepare.external) {
    return (
      <a
        href={prepare.to}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "secondary", size: "lg" }), actionButtonClass)}
      >
        {label}
      </a>
    );
  }

  if (prepare.to === "/test" && "search" in prepare) {
    return (
      <Link
        to="/test"
        search={prepare.search}
        className={cn(buttonVariants({ variant: "secondary", size: "lg" }), actionButtonClass)}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={prepare.to}
      className={cn(buttonVariants({ variant: "secondary", size: "lg" }), actionButtonClass)}
    >
      {label}
    </Link>
  );
}

const TRUST_BADGE_CLASS: Record<string, string> = {
  VERIFIED_PUBLISHED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  LEGACY_PUBLIC_UNVERIFIED: "border-slate-500/40 bg-slate-500/10 text-slate-800 dark:text-slate-200",
  REVIEW_REQUIRED: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  EXCLUDED_FROM_PUBLIC: "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300",
};

export function VacancyPreviewCard({ item }: VacancyPreviewCardProps) {
  const showApply = canShowApplyButton(item);
  const showSource = isHttpsUrl(item.sourceUrl);
  const showNotice =
    isHttpsUrl(item.officialNoticeUrl) && item.officialNoticeUrl !== item.sourceUrl;
  const trustClass = classifyVacancyTrust(item);

  return (
    <Card className={cn("transition-colors", cardSurfaceClass(item))}>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg leading-snug md:text-xl">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {item.organisation}
              {item.category ? ` · ${item.category}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={statusBadgeClass(item.status, item.isPreparationOnly)}
            >
              {item.status}
            </Badge>
            <Badge
              variant="outline"
              className={TRUST_BADGE_CLASS[trustClass] ?? "border-border text-muted-foreground"}
              title={getVacancyTrustLabel(trustClass)}
            >
              {trustClass}
            </Badge>
            {!item.active ? (
              <Badge variant="outline" className="border-border text-muted-foreground">
                inactive
              </Badge>
            ) : null}
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed text-foreground">{item.statusLabel}</p>

        <div className="flex flex-wrap gap-2 text-xs">
          {item.isAllIndia ? (
            <span className="rounded-md border border-border bg-muted/30 px-2 py-1">All India</span>
          ) : (
            <span className="rounded-md border border-border bg-muted/30 px-2 py-1">
              State / regional
            </span>
          )}
          {item.isDepartmental ? (
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-900 dark:text-amber-200">
              Departmental
            </span>
          ) : null}
          {item.isPreparationOnly ? (
            <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-sky-900 dark:text-sky-200">
              Preparation / tracking only
            </span>
          ) : null}
        </div>

        {item.status === "verification_pending" ? (
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
            Preview only — not verified for live vacancy publication.
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="Vacancies" value={item.vacanciesText} />
          <InfoRow label="Qualification" value={item.qualificationShort} />
          <InfoRow label="Age limit" value={item.ageLimitShort} />
          <InfoRow label="Fee" value={item.feeShort} />
          <InfoRow label="Selection" value={item.selectionProcessShort} />
          <InfoRow label="Notification window" value={item.notificationWindowText} />
          <InfoRow label="Exam window" value={item.examWindowText} />
          <InfoRow label="Source" value={`${item.sourceLabel} (${item.sourceType})`} />
          <InfoRow label="Source checked" value={formatDisplayDate(item.sourceCheckedDate)} />
          {item.correctionStartDate && item.correctionEndDate ? (
            <InfoRow
              label="Correction window"
              value={`${formatDisplayDate(item.correctionStartDate)} – ${formatDisplayDate(item.correctionEndDate)}`}
              className="sm:col-span-2"
            />
          ) : null}
        </dl>

        <p className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Trust note: </span>
          {item.trustNote}
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          {showSource ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), actionButtonClass)}
            >
              {item.sourceType === "internal_preparation" ? "Source" : "Official Source"}
            </a>
          ) : null}

          {showNotice && item.officialNoticeUrl ? (
            <a
              href={item.officialNoticeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), actionButtonClass)}
            >
              Official Advertisement
            </a>
          ) : null}

          {showApply && item.applyUrl ? (
            <a
              href={item.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), actionButtonClass)}
            >
              Apply
            </a>
          ) : null}

          {item.preparationLinks.map((href) => (
            <PreparationLinkButton key={href} href={href} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
