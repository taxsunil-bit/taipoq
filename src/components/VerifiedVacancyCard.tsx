import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatVacancyApplicationEndDisplay,
  formatVacancyApplicationStartDisplay,
  formatVacancyApplyWindowStrip,
  formatVacancyStatusLabel,
  isHttpsUrl,
  isJudicialLocalVacancyCategory,
  isMeaningfulVacancyDetailText,
  normalizeVacancyDisplayText,
} from "@/lib/vacancies";
import { formatDateDDMMYYYY, getPrepareLinkLabel, resolvePrepareLink } from "@/lib/upcomingExams";
import type { VacancyItem } from "@/types/vacancy";
import { cn } from "@/lib/utils";

type VerifiedVacancyCardProps = {
  item: VacancyItem;
};

const compactBtn =
  "h-9 min-h-10 px-2.5 text-xs sm:h-9 sm:min-h-9 sm:px-3 sm:text-sm whitespace-nowrap";

function displayText(value: string | undefined): string {
  return normalizeVacancyDisplayText(value);
}

function CompactLine({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <p className="text-xs leading-snug">
      <span className="text-muted-foreground">{label}: </span>
      <span className={emphasize ? "font-semibold text-foreground" : "text-foreground"}>{value}</span>
    </p>
  );
}

function PreparationLinkButton({ href, className }: { href: string; className?: string }) {
  const prepare = resolvePrepareLink(href);
  const label = getPrepareLinkLabel(href);

  if (prepare.external) {
    return (
      <a
        href={prepare.to}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn, className)}
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
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn, className)}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={prepare.to}
      className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn, className)}
    >
      {label}
    </Link>
  );
}

export function VerifiedVacancyCard({ item }: VerifiedVacancyCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (item.status === "verification_pending" || item.isPreparationOnly) {
    return null;
  }

  const showSource = isHttpsUrl(item.sourceUrl);
  const showNotice = isHttpsUrl(item.officialNoticeUrl);
  const isJudiciaryLocal = isJudicialLocalVacancyCategory(item.category);
  const statusPill = formatVacancyStatusLabel(item.status);
  const applyWindowStrip = formatVacancyApplyWindowStrip(
    item.applicationStartDate,
    item.applicationEndDate,
  );
  const applicationStart = formatVacancyApplicationStartDisplay(item.applicationStartDate);
  const applicationEnd = formatVacancyApplicationEndDisplay(
    item.applicationEndDate,
    item.applicationEndTime,
  );
  const primaryPrepLink = item.preparationLinks[0];
  const examLine = isMeaningfulVacancyDetailText(item.examWindowText)
    ? displayText(item.examWindowText)
    : undefined;
  const noticeLine = isMeaningfulVacancyDetailText(item.notificationWindowText)
    ? displayText(item.notificationWindowText)
    : undefined;

  return (
    <li>
      <Card className="border-emerald-500/20 bg-card/80 shadow-sm">
        <CardContent className="space-y-2 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="border-emerald-400/40 bg-emerald-500/15 px-1.5 py-0 text-[11px] font-medium text-emerald-300"
            >
              Verified Open Job
            </Badge>
            {isJudiciaryLocal ? (
              <>
                <Badge
                  variant="outline"
                  className="border-amber-400/40 bg-amber-500/15 px-1.5 py-0 text-[11px] font-medium text-amber-200"
                >
                  PLA / Local Notice
                </Badge>
                <Badge
                  variant="outline"
                  className="border-amber-400/30 bg-amber-500/10 px-1.5 py-0 text-[10px] font-medium text-amber-100/90"
                >
                  Judiciary Local / PLA
                </Badge>
              </>
            ) : null}
            <Badge
              variant="outline"
              className="border-border/80 bg-muted/25 px-1.5 py-0 text-[11px] font-medium text-foreground"
            >
              {statusPill}
            </Badge>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
            <p className="text-[11px] text-muted-foreground">
              {item.organisation}
              {item.category ? ` · ${item.category}` : ""}
            </p>
          </div>

          {applyWindowStrip ? (
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs leading-snug">
              <span className="font-semibold text-emerald-100">{applyWindowStrip}</span>
            </p>
          ) : null}

          <div className="space-y-0.5">
            <CompactLine label="Application Start" value={applicationStart} emphasize />
            {applicationEnd ? (
              <CompactLine label="Application End" value={applicationEnd} emphasize />
            ) : null}
            {noticeLine ? <CompactLine label="Notice" value={noticeLine} /> : null}
            {examLine ? <CompactLine label="Exam / Selection" value={examLine} /> : null}
            <CompactLine label="Vacancies" value={displayText(item.vacanciesText)} />
            <CompactLine label="Eligibility" value={displayText(item.qualificationShort)} />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {showSource ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
              >
                Official Source
              </a>
            ) : null}

            {primaryPrepLink ? <PreparationLinkButton href={primaryPrepLink} /> : null}

            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), compactBtn)}
              aria-expanded={expanded}
            >
              {expanded ? "Hide Details" : "Show Details"}
            </button>

            {showNotice && item.officialNoticeUrl ? (
              <a
                href={item.officialNoticeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), compactBtn)}
              >
                Official Notice
              </a>
            ) : null}
          </div>

          {expanded ? (
            <div className="space-y-2 border-t border-border/50 pt-2">
              <div className="space-y-0.5">
                {item.correctionStartDate && item.correctionEndDate ? (
                  <CompactLine
                    label="Correction Window"
                    value={`${formatDateDDMMYYYY(item.correctionStartDate)} to ${formatDateDDMMYYYY(item.correctionEndDate)}`}
                    emphasize
                  />
                ) : null}
                {item.correctionEndDate && !item.correctionStartDate ? (
                  <CompactLine
                    label="Correction / Modification End"
                    value={formatDateDDMMYYYY(item.correctionEndDate)}
                    emphasize
                  />
                ) : null}
                <CompactLine label="Age Limit" value={displayText(item.ageLimitShort)} />
                <CompactLine label="Fee" value={displayText(item.feeShort)} />
                <CompactLine label="Selection Process" value={displayText(item.selectionProcessShort)} />
                <CompactLine label="Exam / Selection Date" value={displayText(item.examWindowText)} />
              </div>

              <p className="rounded border border-border/50 bg-muted/15 p-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Trust note: </span>
                {displayText(item.trustNote)}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {showNotice && item.officialNoticeUrl ? (
                  <a
                    href={item.officialNoticeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
                  >
                    Official Notice
                  </a>
                ) : null}

                {showSource ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), compactBtn)}
                  >
                    Official Source
                  </a>
                ) : null}

                {item.preparationLinks.map((href) => (
                  <PreparationLinkButton key={href} href={href} />
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </li>
  );
}
