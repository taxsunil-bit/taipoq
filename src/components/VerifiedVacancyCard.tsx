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
import type { VacancyItem, VacancyPostGroup, VacancyStatus } from "@/types/vacancy";
import { cn } from "@/lib/utils";

type VerifiedVacancyCardProps = {
  item: VacancyItem;
};

const touchBtn = "min-h-11 px-3 text-sm whitespace-nowrap";

/** Calm Focus readable status styles — light surfaces, WCAG-friendly contrast. */
const BADGE_VERIFIED =
  "border-[var(--status-success)]/35 bg-[var(--status-success-container)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--status-success)]";
const BADGE_PENDING =
  "border-[var(--border-default)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]";
const BADGE_JUDICIAL =
  "border-[var(--status-warning)]/35 bg-[var(--status-warning-container)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--status-warning)]";
const APPLY_WINDOW =
  "rounded-md border border-[var(--status-success)]/40 bg-[var(--status-success-container)] px-2.5 py-1.5 text-xs font-semibold leading-snug text-[var(--status-success)]";

function statusBadgeClass(status: VacancyStatus): string {
  switch (status) {
    case "closing_soon":
      return "border-[var(--status-warning)]/35 bg-[var(--status-warning-container)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--status-warning)]";
    case "closed":
    case "archive":
      return "border-[var(--status-danger)]/35 bg-[var(--status-danger-container)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--status-danger)]";
    case "active":
    default:
      return "border-[var(--status-info)]/35 bg-[var(--status-info-container)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--status-info)]";
  }
}

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
    <p className="text-xs leading-snug sm:text-sm">
      <span className="text-[#64748B]">{label}: </span>
      <span className={emphasize ? "font-semibold text-[#0F172A]" : "text-[#0F172A]"}>{value}</span>
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
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), touchBtn, className)}
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
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), touchBtn, className)}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={prepare.to}
      className={cn(buttonVariants({ variant: "secondary", size: "sm" }), touchBtn, className)}
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
  return pay
    ? displayText(pay)
    : group.payNotApplicable
      ? "Not specified in official notice"
      : undefined;
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
    <article className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
      <h4 className="text-xs font-semibold leading-snug text-[#0F172A]">{group.title}</h4>
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
  const detailsId = `vacancy-details-${item.id}`;

  return (
    <li>
      <Card className="border-[var(--border-subtle)] bg-white shadow-[var(--shadow-subtle)]">
        <CardContent className="space-y-2.5 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {isFullyVerified ? (
              <Badge variant="outline" className={BADGE_VERIFIED}>
                Verified Open Job
              </Badge>
            ) : (
              <Badge
                variant="outline"
                title="Preserved public listing. Confirm details on the official website before applying."
                className={BADGE_PENDING}
              >
                Open listing — verification review pending
              </Badge>
            )}
            {isJudiciaryLocal ? (
              <Badge variant="outline" className={BADGE_JUDICIAL}>
                Judiciary Local / PLA
              </Badge>
            ) : null}
            <Badge variant="outline" className={statusBadgeClass(item.status)}>
              {statusPill}
            </Badge>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-base font-semibold leading-snug text-[#0F172A] sm:text-lg">
              {item.title}
            </h3>
            <p className="text-xs text-[#64748B] sm:text-sm">
              {item.organisation}
              {item.category ? ` · ${item.category}` : ""}
            </p>
          </div>

          {applyWindowStrip ? <p className={APPLY_WINDOW}>{applyWindowStrip}</p> : null}

          {/* Mobile actions early — before dense meta — so CTAs clear the bottom-nav fold */}
          <div className="space-y-1.5 pt-0.5 md:hidden">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                className={cn(buttonVariants({ variant: "default", size: "sm" }), touchBtn)}
                aria-expanded={expanded}
                aria-controls={detailsId}
              >
                {expanded ? "Hide Details" : "Show Details"}
              </button>
              {showNotice && item.officialNoticeUrl ? (
                <a
                  href={item.officialNoticeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleVerifiedJobReview("vacancy-official-notice")}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), touchBtn)}
                >
                  Official Notice
                </a>
              ) : null}
            </div>
            {showSource ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVerifiedJobReview("vacancy-official-source")}
                className="inline-flex min-h-11 items-center text-sm font-medium text-[#1D4ED8] underline-offset-4 hover:underline"
              >
                Official Source
              </a>
            ) : null}
          </div>

          <div className="space-y-1">
            {applicationEnd ? (
              <CompactLine label="Application End" value={applicationEnd} emphasize />
            ) : null}
            <p className="text-xs leading-snug sm:text-sm">
              <span className="text-[#64748B]">Vacancies: </span>
              <span className="line-clamp-1 font-semibold text-[#0F172A] md:line-clamp-none">
                {displayText(item.vacanciesText)}
              </span>
            </p>
            {!hasPostGroups ? (
              <p className="text-xs leading-snug sm:text-sm md:hidden">
                <span className="text-[#64748B]">Eligibility: </span>
                <span className="line-clamp-1 text-[#0F172A]">
                  {displayText(item.qualificationShort)}
                </span>
              </p>
            ) : (
              <p className="text-xs leading-snug text-[#64748B] md:hidden">
                Eligibility: varies by post — use Show Details
              </p>
            )}
          </div>

          <div className={cn("space-y-1", !expanded && "hidden md:block")}>
            <CompactLine label="Application Start" value={applicationStart} emphasize />
            {!hasPostGroups ? (
              <CompactLine label="Eligibility" value={displayText(item.qualificationShort)} />
            ) : (
              <p className="text-xs leading-snug text-[#64748B]">
                Eligibility varies by post — expand post-wise details below.
              </p>
            )}
            {noticeLine ? <CompactLine label="Notice" value={noticeLine} /> : null}
            {examLine ? <CompactLine label="Exam / Selection" value={examLine} /> : null}
          </div>

          {hasPostGroups ? (
            <div className={cn("space-y-2", !expanded && "hidden md:block")}>
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

          {/* Desktop / tablet: fuller action row */}
          <div className="hidden flex-wrap gap-2 pt-0.5 md:flex">
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className={cn(buttonVariants({ variant: "default", size: "sm" }), touchBtn)}
              aria-expanded={expanded}
              aria-controls={detailsId}
            >
              {expanded ? "Hide Details" : "Show Details"}
            </button>
            {showNotice && item.officialNoticeUrl ? (
              <a
                href={item.officialNoticeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVerifiedJobReview("vacancy-official-notice")}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), touchBtn)}
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
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), touchBtn)}
              >
                Official Source
              </a>
            ) : null}
            {primaryPrepLink ? <PreparationLinkButton href={primaryPrepLink} /> : null}
          </div>

          {expanded ? (
            <div
              id={detailsId}
              className="space-y-2 border-t border-[#E2E8F0] pt-2"
              role="region"
              aria-label={`Additional details for ${item.title}`}
            >
              <div className="space-y-1 md:hidden">
                <CompactLine label="Application Start" value={applicationStart} emphasize />
                {!hasPostGroups ? (
                  <CompactLine label="Eligibility" value={displayText(item.qualificationShort)} />
                ) : (
                  <p className="text-xs leading-snug text-[#64748B]">
                    Eligibility varies by post — expand post-wise details below.
                  </p>
                )}
                {noticeLine ? <CompactLine label="Notice" value={noticeLine} /> : null}
                {examLine ? <CompactLine label="Exam / Selection" value={examLine} /> : null}
              </div>
              {hasPostGroups ? (
                <div className="space-y-2 md:hidden">
                  <button
                    type="button"
                    id={`${postWisePanelId}-mobile-trigger`}
                    aria-controls={`${postWisePanelId}-mobile`}
                    aria-expanded={postWiseOpen}
                    onClick={() => setPostWiseOpen((open) => !open)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "min-h-11 w-full justify-between px-3 text-xs",
                    )}
                  >
                    <span>
                      {postWiseOpen ? "Hide post-wise details" : "View post-wise details"}
                    </span>
                    <span aria-hidden="true">{postWiseOpen ? "▲" : "▼"}</span>
                  </button>
                  {postWiseOpen ? (
                    <div
                      id={`${postWisePanelId}-mobile`}
                      role="region"
                      aria-labelledby={`${postWisePanelId}-mobile-trigger`}
                      className="grid gap-2"
                    >
                      {postGroups.map((group) => (
                        <PostGroupCard key={group.id} group={group} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="space-y-1">
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
                <CompactLine
                  label="Selection Process"
                  value={displayText(item.selectionProcessShort)}
                />
                <CompactLine
                  label="Exam / Selection Date"
                  value={displayText(item.examWindowText)}
                />
              </div>

              <p className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[11px] leading-relaxed text-[#475569]">
                <span className="font-medium text-[#0F172A]">Trust note: </span>
                {displayText(item.trustNote)}
              </p>

              <div className="flex flex-wrap gap-2">
                {showNotice && item.officialNoticeUrl ? (
                  <a
                    href={item.officialNoticeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVerifiedJobReview("vacancy-official-notice")}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), touchBtn)}
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
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), touchBtn)}
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
