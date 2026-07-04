import type {
  VacanciesPayload,
  VacancyItem,
  VacancyLifecycleStatus,
  VacancyStatus,
  VacancyVerificationStatus,
} from "@/types/vacancy";
import { formatDateDDMMYYYY } from "@/lib/upcomingExams";

const VACANCY_STATUS_LABELS: Record<VacancyStatus, string> = {
  closing_soon: "Closing Soon",
  active: "Applications Open",
  correction_window: "Correction Window",
  archive: "Archived",
  verification_pending: "Verification Pending",
  preparation_only: "Preparation Only",
  closed: "Closed",
  exam_process: "Exam Stage",
  departmental: "Departmental",
};

export function formatVacancyStatusLabel(status: VacancyStatus): string {
  return VACANCY_STATUS_LABELS[status] ?? status;
}

const VACANCY_DISPLAY_TEXT_REPLACEMENTS: readonly { pattern: RegExp; replacement: string }[] = [
  { pattern: /Official CEN देखें/gi, replacement: "View Official CEN" },
  { pattern: /official PDF देखें/gi, replacement: "view official PDF" },
  { pattern: /Official advertisement देखें/gi, replacement: "View official advertisement" },
  { pattern: /official advertisement देखें/gi, replacement: "view official advertisement" },
  { pattern: /Official notice देखें/gi, replacement: "View official notice" },
  { pattern: /official notice देखें/gi, replacement: "view official notice" },
  { pattern: /Official notification देखें/gi, replacement: "View official notification" },
  { pattern: /Official calendar देखें/gi, replacement: "View official calendar" },
  { pattern: /official calendar देखें/gi, replacement: "view official calendar" },
  { pattern: /PDF देखें/gi, replacement: "View PDF" },
  { pattern: /final दिनांक official website पर देखें/gi, replacement: "see official website for final dates" },
  { pattern: /Official website पर CBT \/ written exam schedule देखें/gi, replacement: "See CBT / written exam schedule on official website" },
  { pattern: /Official website पर CBT schedule देखें/gi, replacement: "See CBT schedule on official website" },
  { pattern: /Official website पर/gi, replacement: "On official website" },
  { pattern: /Exam schedule घोषित नहीं/gi, replacement: "Exam schedule not announced" },
  { pattern: /घोषित नहीं/g, replacement: "Not announced" },
  { pattern: /तिथि घोषित नहीं/g, replacement: "Date not announced" },
  { pattern: /देखें/g, replacement: "View" },
];

/** Normalize legacy Hindi fragments in vacancy field text shown on cards. */
export function normalizeVacancyDisplayText(value: string | undefined): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  let text = trimmed;
  for (const { pattern, replacement } of VACANCY_DISPLAY_TEXT_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

const VAGUE_VACANCY_TEXT_FRAGMENTS = [
  "view official notice",
  "view official advertisement",
  "view official calendar",
  "not announced",
  "date not announced",
] as const;

export function isMeaningfulVacancyDetailText(value: string | undefined): boolean {
  const normalized = normalizeVacancyDisplayText(value);
  if (!normalized) return false;
  const lower = normalized.toLowerCase();
  return !VAGUE_VACANCY_TEXT_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

/** Highlight strip when both application dates exist. */
export function formatVacancyApplyWindowStrip(
  applicationStartDate: string | undefined,
  applicationEndDate: string | undefined,
): string | null {
  const start = formatDateDDMMYYYY(applicationStartDate);
  const end = formatDateDDMMYYYY(applicationEndDate);
  if (start && end) return `Apply Window: ${start} → ${end}`;
  if (end && !start) return `Last Date: ${end}`;
  return null;
}

export function formatVacancyApplicationEndDisplay(
  applicationEndDate: string | undefined,
  applicationEndTime: string | undefined,
): string {
  const end = formatDateDDMMYYYY(applicationEndDate);
  if (!end) return "";
  const time = applicationEndTime?.trim();
  return time ? `${end}, ${time}` : end;
}

export function formatVacancyApplicationStartDisplay(applicationStartDate: string | undefined): string {
  const start = formatDateDDMMYYYY(applicationStartDate);
  return start || "Not announced";
}

/** Jobs with closing date before this ISO day are excluded from the public live list. */
export { LIVE_LIST_REFERENCE_DATE } from "./vacancyPublicCore.mjs";

import {
  computePublicVacancySummary as computePublicVacancySummaryCore,
  filterVerifiedPublicVacanciesBySector as filterVerifiedPublicVacanciesBySectorCore,
  getApplicationDeadlineMs as getApplicationDeadlineMsCore,
  getVerifiedPublicVacancies as getVerifiedPublicVacanciesCore,
  getVerifiedVacancySector as getVerifiedVacancySectorCore,
  getVacancyClockNow as getVacancyClockNowCore,
  isApprenticeshipVacancy as isApprenticeshipVacancyCore,
  isContractLocalVacancy as isContractLocalVacancyCore,
  isJudicialLocalVacancyCategory as isJudicialLocalVacancyCategoryCore,
  isJudicialVacancyCategory as isJudicialVacancyCategoryCore,
  isLawLegalVacancy as isLawLegalVacancyCore,
  isLiveVacancyByClosingDate as isLiveVacancyByClosingDateCore,
  isSpecialistExperiencedVacancy as isSpecialistExperiencedVacancyCore,
  isVacancyApplicationWindowOpen as isVacancyApplicationWindowOpenCore,
  isVacancyPubliclyVerified as isVacancyPubliclyVerifiedCore,
  parseIsoDate as parseIsoDateCore,
  resolveVacancyDataUpdatedIso as resolveVacancyDataUpdatedIsoCore,
  VACANCY_DATE_ONLY_CLOSING_TIME as VACANCY_DATE_ONLY_CLOSING_TIME_CORE,
} from "./vacancyPublicCore.mjs";
import { classifyVacancyTrust } from "./vacanciesSource.mjs";

export const VACANCY_DATE_ONLY_CLOSING_TIME = VACANCY_DATE_ONLY_CLOSING_TIME_CORE;

export function parseIsoDate(value: string | undefined): string | null {
  return parseIsoDateCore(value);
}

/** Injectable clock for tests (fixed dates). Production uses system time. */
export type VacancyClock = { now: () => Date };

export function getVacancyClockNow(clock?: VacancyClock): Date {
  return getVacancyClockNowCore(clock);
}

export function getApplicationDeadlineMs(
  applicationEndDate: string | undefined,
  applicationEndTime: string | undefined,
): number | null {
  return getApplicationDeadlineMsCore(applicationEndDate, applicationEndTime);
}

export function isVacancyApplicationWindowOpen(item: VacancyItem, at: Date): boolean {
  return isVacancyApplicationWindowOpenCore(item, at);
}

export function isLiveVacancyByClosingDate(
  applicationEndDate: string | undefined,
  referenceDate?: string,
): boolean {
  return isLiveVacancyByClosingDateCore(applicationEndDate, referenceDate);
}

// Vacancy data loaders live in a pure, framework-free core module so their
// URL routing can be proven at runtime by the preview-leak sentinel test.
// This is the SINGLE loader implementation — re-exported, never duplicated.
export {
  LIVE_DATA_URL,
  PREVIEW_DATA_URL,
  loadVacanciesLive,
  loadVacanciesPreview,
  normalizeVacanciesPayload,
  classifyVacancyTrust,
  getVacancyTrustLabel,
  strictPublicationContractPasses,
} from "./vacanciesSource.mjs";
export type { VacanciesLoadResult } from "./vacanciesSource.mjs";

/** @deprecated Use VacanciesLoadResult. Retained for backward compatibility. */
export type VacanciesPreviewLoadResult = {
  payload: VacanciesPayload;
  error?: string;
};

export function countVacanciesByStatus(items: VacancyItem[]) {
  const counts: Record<string, number> = {
    total: items.length,
    active: 0,
    verification_pending: 0,
    correction_window: 0,
    archive: 0,
    preparation_only: 0,
    withApplyUrl: 0,
  };

  for (const item of items) {
    if (item.active) counts.active += 1;
    if (item.status in counts) {
      counts[item.status] = (counts[item.status] ?? 0) + 1;
    }
    if (item.isPreparationOnly || item.status === "preparation_only") {
      counts.preparation_only += 1;
    }
    if (item.applyUrl?.trim()) counts.withApplyUrl += 1;
  }

  return counts;
}

export function canShowApplyButton(item: VacancyItem): boolean {
  const applyUrl = item.applyUrl?.trim();
  if (!applyUrl) return false;
  if (item.isPreparationOnly) return false;
  if (item.status === "verification_pending") return false;
  if (item.status === "archive" || item.status === "closed") return false;
  if (item.sourceType === "cross_check_only") return false;
  return item.status === "active" || item.status === "closing_soon";
}

export function isHttpsUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    return new URL(url.trim()).protocol === "https:";
  } catch {
    return false;
  }
}

export function isJudicialLocalVacancyCategory(category: string | undefined): boolean {
  return isJudicialLocalVacancyCategoryCore(category);
}

export function isJudicialVacancyCategory(category: string | undefined): boolean {
  return isJudicialVacancyCategoryCore(category);
}

export function isBankSpecialistVacancyCategory(category: string | undefined): boolean {
  return (category ?? "").toLowerCase().includes("bank specialist");
}

export type VerifiedJobSector =
  | "all"
  | "graduate_exams"
  | "railway"
  | "banking"
  | "upsc"
  | "state_psc"
  | "judicial"
  | "law_legal"
  | "defence"
  | "technical_research"
  | "medical"
  | "insurance"
  | "dsssb"
  | "apprenticeships"
  | "specialist_experienced"
  | "contract_local";

export function isApprenticeshipVacancy(item: VacancyItem): boolean {
  return isApprenticeshipVacancyCore(item);
}

export function isLawLegalVacancy(item: VacancyItem): boolean {
  return isLawLegalVacancyCore(item);
}

export function isSpecialistExperiencedVacancy(item: VacancyItem): boolean {
  return isSpecialistExperiencedVacancyCore(item);
}

export function isContractLocalVacancy(item: VacancyItem): boolean {
  return isContractLocalVacancyCore(item);
}

export function getVerifiedVacancySector(
  item: VacancyItem,
): Exclude<VerifiedJobSector, "all"> | null {
  return getVerifiedVacancySectorCore(item);
}

export function filterVerifiedPublicVacanciesBySector(
  items: VacancyItem[],
  sector: VerifiedJobSector,
  clock?: VacancyClock,
): VacancyItem[] {
  return filterVerifiedPublicVacanciesBySectorCore(items, sector, clock);
}

export function getVerifiedPublicVacancies(
  items: VacancyItem[],
  clock?: VacancyClock,
): VacancyItem[] {
  return getVerifiedPublicVacanciesCore(items, clock);
}

export type PublicVacancySummary = {
  openListings: number;
  fullyVerified: number;
  reviewPending: number;
  displayed: VacancyItem[];
};

export function computePublicVacancySummary(
  items: VacancyItem[],
  clock?: VacancyClock,
): PublicVacancySummary {
  return computePublicVacancySummaryCore(items, clock);
}

export function resolveVacancyDataUpdatedIso(payload: VacanciesPayload): string | null {
  return resolveVacancyDataUpdatedIsoCore(payload);
}

/**
 * Compatibility mapping layer — Update Safety System (Phase 1).
 *
 * Existing records use the legacy `status` enum + `active` flag and do not
 * carry `lifecycleStatus` / `verificationStatus`. These helpers derive the new
 * model from the legacy schema when the explicit fields are absent, so both
 * models can coexist without a destructive migration.
 */
export function deriveVacancyLifecycleStatus(item: VacancyItem): VacancyLifecycleStatus {
  if (item.lifecycleStatus) return item.lifecycleStatus;
  switch (item.status) {
    case "archive":
    case "closed":
      return "expired";
    case "verification_pending":
      return "review";
    case "preparation_only":
    case "departmental":
    case "exam_process":
      return "review";
    case "active":
    case "closing_soon":
    case "correction_window":
      // Only treat as published when it clears the live public gate.
      return isVacancyPubliclyVerified(item) ? "published" : "review";
    default:
      return "review";
  }
}

export function deriveVacancyVerificationStatus(item: VacancyItem): VacancyVerificationStatus {
  if (item.verificationStatus) return item.verificationStatus;
  if (item.status === "verification_pending") return "pending";
  if (item.sourceType === "cross_check_only") return "manual_confirmation_required";
  return isVacancyPubliclyVerified(item) ? "verified" : "pending";
}

export function isVacancyPubliclyVerified(item: VacancyItem, clock?: VacancyClock): boolean {
  return isVacancyPubliclyVerifiedCore(item, clock);
}
