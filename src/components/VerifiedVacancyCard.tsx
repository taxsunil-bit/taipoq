import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  classifyVacancyTrust,
  formatVacancyApplicationEndDisplay,
  formatVacancyApplicationStartDisplay,
  formatVacancyApplyWindowStrip,
  formatVacancyStatusLabel,
  isHttpsUrl,
  isJudicialLocalVacancyCategory,
  isMeaningfulVacancyDetailText,
  normalizeVacancyDisplayText,
} from "@/lib/vacancies";
import { markDailyMissionTaskComplete } from "@/lib/dailyMission";
import { formatDateDDMMYYYY, getPrepareLinkLabel, resolvePrepareLink } from "@/lib/upcomingExams";
import type { VacancyItem, VacancyPostGroup } from "@/types/vacancy";
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

function handleVerifiedJobReview(source: string) {
  markDailyMissionTaskComplete("jobUpdate", { source });
}

function formatPostGroupAge(group: VacancyPostGroup): string | undefined {
  if (group.ageLimitText?.trim()) return displayText(group.ageLimitText);
  if (group.ageMinimum != null && group.ageMaximum != null) {
    const cutoff = group.ageCutoffDate ? ` as on ${formatDateDDMMYYYY(group.ageCutoffDate)}` : "";
    return `${group.ageMinimum}–${group.ageMaximum} years${cutoff}`;
  }
  if (group.ageNotApplicable) return "Not applicable per official notice";
  return undefined;
}

function formatPostGroupPay(group: VacancyPostGroup): string | undefined {
  const pay = group.payLevel?.trim() || group.salary?.trim();
  return pay ? displayText(pay) : group.payNotApplicable ? "Not specified in official notice" : undefined;
}

function PostGroupCard({ group }: { group: VacancyPostGroup }) {
  const age = formatPostGroupAge(group);
  const pay = formatPostGroupPay(group);
  const selection = group.selectionProcess?.length
    ? group.selectionProcess.map((s) => displayText(s)).join("; ")
    : undefined;
  const codes = group.postCodes?.length ? group.postCodes.join(", ") : undefined;
  const disciplines = group.disciplines?.length ? group.disciplines.join("; ") : undefined;

  return (
    <article className="rounded-md border border-border/60 bg-muted/10 p-2.5">
      <h4 className="text-xs font-semibold leading-snug text-foreground">{group.title}</h4>
      <div className="mt-1 space-y-0.5">
        <CompactLine label="Vacancies" value={String(group.vacancies.total)} emphasize />
        {codes ? <CompactLine label="Post codes" value={codes} /> : null}
        {disciplines ? <CompactLine label="Discipline / trade" value={disciplines} /> : null}
        {group.vacancies.locationNote ? (
          <CompactLine label="Location split" value={displayText(group.vacancies.locationNote)} />
        ) : null}
        <CompactLine label="Qualification" value={displayText(group.qualification)} />
        {age ? <CompactLine label="Age" value={age} /> : null}
        {pay ? <CompactLine label="Pay" value={pay} /> : null}
        {group.fee ? <CompactLine label="Fee" value={displayText(group.fee)} /> : null}
        {selection ? <CompactLine label="Selection" value={selection} /> : null}
      </div>
    </article>
  );
}

export function VerifiedVacancyCard({ item }: VerifiedVacancyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [postWiseOpen, setPostWiseOpen] = useState(false);

  if (item.status === "verification_pending" || item.isPreparationOnly) {
    return null;
  }

  const showSource = isHttpsUrl(item.sourceUrl);
  const showNotice = isHttpsUrl(item.officialNoticeUrl);
  const trustClass = classifyVacancyTrust(item);
  const isFullyVerified = trustClass === "VERIFIED_PUBLISHED";
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
  const postGroups = item.postGroups ?? [];
  const hasPostGroups = postGroups.length > 0;
  const postWisePanelId = `post-wise-${item.id}`;

  return (
    <li>
      <Card className="border-emerald-500/20 bg-card/80 shadow-sm">
        <CardContent className="space-y-2 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {isFullyVerified ? (
              <Badge
                variant="outline"
                className="border-emerald-400/40 bg-emerald-500/15 px-1.5 py-0 text-[11px] font-medium text-emerald-300"
              >
                Verified Open Job
              </Badge>
            ) : (
              <Badge
                variant="outline"
                title="Preserved public listing. Confirm details on the official website before applying."
                className="border-slate-400/40 bg-slate-500/15 px-1.5 py-0 text-[11px] font-medium text-slate-200"
              >
                Open listing — verification review pending
              </Badge>
            )}
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
            {!hasPostGroups ? (
              <CompactLine label="Eligibility" value={displayText(item.qualificationShort)} />
            ) : (
              <p className="text-xs leading-snug text-muted-foreground">
                Eligibility varies by post — expand post-wise details below.
              </p>
            )}
          </div>

          {hasPostGroups ? (
            <div className="space-y-2">
              <button
                type="button"
                id={`${postWisePanelId}-trigger`}
                aria-controls={postWisePanelId}
                aria-expanded={postWiseOpen}
                onClick={() => setPostWiseOpen((open) => !open)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "min-h-11 w-full justify-between px-3 text-xs sm:text-sm",
                )}
              >
                <span>{postWiseOpen ? "Hide post-wise details" : "View post-wise details"}</span>
                <span aria-hidden="true">{postWiseOpen ? "▲" : "▼"}</span>
              </button>
              {postWiseOpen ? (
                <div
                  id={postWisePanelId}
                  role="region"
                  aria-labelledby={`${postWisePanelId}-trigger`}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {postGroups.map((group) => (
                    <PostGroupCard key={group.id} group={group} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {showSource ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVerifiedJobReview("vacancy-official-source")}
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
                onClick={() => handleVerifiedJobReview("vacancy-official-notice")}
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
                    onClick={() => handleVerifiedJobReview("vacancy-official-notice")}
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
                    onClick={() => handleVerifiedJobReview("vacancy-official-source")}
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
