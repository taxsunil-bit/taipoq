// @ts-check
/**
 * Pure vacancy public-list logic (deadlines, sectors, counts).
 * Imported by src/lib/vacancies.ts and node --test suites.
 */

import { classifyVacancyTrust } from "./vacanciesSource.mjs";

/** Jobs with closing date before this ISO day are excluded from legacy reference checks. */
export const LIVE_LIST_REFERENCE_DATE = "2026-07-01";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || !ISO_DATE_RE.test(trimmed)) return null;
  const [year, month, day] = trimmed.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return trimmed;
}

const defaultVacancyClock = { now: () => new Date() };

export function getVacancyClockNow(clock = defaultVacancyClock) {
  return clock.now();
}

/** Indian recruitment deadlines default to Asia/Kolkata (UTC+5:30). */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * When official data provides only applicationEndDate (YYYY-MM-DD), the window
 * closes at 23:59:59 IST on that date unless applicationEndTime is set.
 */
export const VACANCY_DATE_ONLY_CLOSING_TIME = "23:59:59";

function parseApplicationEndTimeParts(time) {
  const raw = String(time ?? "").trim();
  if (!raw) return { hours: 23, minutes: 59, seconds: 59 };
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(raw);
  if (!match) return { hours: 23, minutes: 59, seconds: 59 };
  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
    seconds: Number(match[3] ?? 0),
  };
}

function istWallTimeToUtcMs(year, month, day, hours, minutes, seconds) {
  return Date.UTC(year, month - 1, day, hours, minutes, seconds) - IST_OFFSET_MS;
}

function istDateStartMs(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return istWallTimeToUtcMs(year, month, day, 0, 0, 0);
}

/** Exact application closing instant in UTC ms (IST wall clock). */
export function getApplicationDeadlineMs(applicationEndDate, applicationEndTime) {
  const end = parseIsoDate(applicationEndDate);
  if (!end) return null;
  const [year, month, day] = end.split("-").map(Number);
  const { hours, minutes, seconds } = parseApplicationEndTimeParts(applicationEndTime);
  return istWallTimeToUtcMs(year, month, day, hours, minutes, seconds);
}

/**
 * Canonical application-window state derived from verified dates + clock.
 * Timezone: Asia/Kolkata (IST, UTC+5:30). Date-only closing dates end at 23:59:59 IST.
 * Closing instant is inclusive (`now === deadline` → OPEN).
 *
 * @returns {"UPCOMING"|"OPEN"|"CLOSED"|"UNKNOWN"}
 */
export function computeVacancyApplicationState(item, at) {
  if (!item) return "UNKNOWN";
  if (item.isPreparationOnly) return "CLOSED";
  if (item.status === "archive" || item.status === "closed") return "CLOSED";
  if (item.active === false) return "CLOSED";

  const start = parseIsoDate(item.applicationStartDate);
  const deadlineMs = getApplicationDeadlineMs(item.applicationEndDate, item.applicationEndTime);
  if (!start || deadlineMs === null) return "UNKNOWN";

  const nowMs = at.getTime();
  if (nowMs < istDateStartMs(start)) return "UPCOMING";
  if (nowMs <= deadlineMs) return "OPEN";
  return "CLOSED";
}

export function formatVacancyApplicationStateLabel(state) {
  switch (state) {
    case "UPCOMING":
      return "Upcoming";
    case "OPEN":
      return "Applications Open";
    case "CLOSED":
      return "Applications Closed";
    case "UNKNOWN":
    default:
      return "Date Unverified";
  }
}

/**
 * Public status pill text — never trusts static `status === "active"` alone.
 * While OPEN, preserves Closing Soon when the stored enum says so.
 */
export function resolveVacancyPublicStatusLabel(item, at) {
  const state = computeVacancyApplicationState(item, at);
  if (state === "OPEN" && item?.status === "closing_soon") return "Closing Soon";
  if (state === "OPEN" && item?.status === "correction_window") return "Correction Window";
  return formatVacancyApplicationStateLabel(state);
}

/** True while the application window is open (IST deadline, inclusive end instant). */
export function isVacancyApplicationWindowOpen(item, at) {
  return computeVacancyApplicationState(item, at) === "OPEN";
}

export function isLiveVacancyByClosingDate(applicationEndDate, referenceDate = LIVE_LIST_REFERENCE_DATE) {
  const end = parseIsoDate(applicationEndDate);
  const ref = parseIsoDate(referenceDate);
  if (!end || !ref) return false;
  return end >= ref;
}

export function isHttpsUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return false;
  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

export function isJudicialLocalVacancyCategory(category) {
  const value = String(category ?? "").toLowerCase();
  return value.includes("judiciary local") || value.includes("pla member") || value.includes("pla / contract");
}

export function isJudicialVacancyCategory(category) {
  if (isJudicialLocalVacancyCategory(category)) return false;
  return String(category ?? "").toLowerCase().includes("judicial");
}

function vacancySearchText(item) {
  return `${item.title} ${item.organisation} ${item.category}`.toLowerCase();
}

export function isApprenticeshipVacancy(item) {
  const text = vacancySearchText(item);
  return text.includes("apprentice") || text.includes("agniveer apprentice");
}

export function isLawLegalVacancy(item) {
  const text = vacancySearchText(item);
  if (text.includes("legal assistant") || text.includes("law officer")) return true;
  if (text.includes("hjs") || text.includes("judicial service examination")) return false;
  return text.includes("legal") && !text.includes("pla");
}

export function isSpecialistExperiencedVacancy(item) {
  const text = vacancySearchText(item);
  if (isLawLegalVacancy(item) || isApprenticeshipVacancy(item)) return false;
  return (
    text.includes("specialist") ||
    text.includes(" sco") ||
    text.includes("medical officer") ||
    text.includes("banking advisor") ||
    text.includes("contractual") ||
    text.includes("fte") ||
    text.includes("cic")
  );
}

export function isContractLocalVacancy(item) {
  return isJudicialLocalVacancyCategory(item.category) || vacancySearchText(item).includes("pla ");
}

export function getVerifiedVacancySector(item) {
  if (isContractLocalVacancy(item)) return "contract_local";
  if (isApprenticeshipVacancy(item)) return "apprenticeships";
  if (isLawLegalVacancy(item)) return "law_legal";
  if (isSpecialistExperiencedVacancy(item)) return "specialist_experienced";

  const category = String(item.category ?? "").toLowerCase();

  if (isJudicialVacancyCategory(item.category)) return "judicial";
  if (category.includes("state psc") || category.includes("/ pcs")) return "state_psc";
  if (category.includes("medical / central") || category.includes("aiims")) return "medical";
  if (category.includes("railway") || category.includes("rrb")) return "railway";
  if (category.includes("dsssb") || category.includes("delhi govt")) return "dsssb";
  if (category.includes("isro") || category.includes("space / research")) return "technical_research";
  if (category.includes("drdo") || category.includes("r&d") || category.includes("jrf")) {
    return "technical_research";
  }
  if (category.includes("upsc")) return "upsc";
  if (category.includes("insurance")) return "insurance";
  if (category.includes("defence") || category.includes("navy")) return "defence";
  if (category.includes("banking") || category.includes("ibps")) return "banking";

  return null;
}

const DISPLAY_ORDER = [
  "delhi-hjs-examination-2026",
  "aiims-cre-5-2026",
  "indian-navy-agniveer-apprentice-0127-0227-2026",
  "sbi-po-2026",
  "ibps-po-mt-xvi-2026",
  "dsssb-advt-03-2026",
  "rrb-technician-cen-02-2026",
  "uppsc-pcs-2026",
  "indian-navy-ssc-various-entries-jun-2027",
  "gujarat-hc-legal-assistant-2026",
  "upsc-advt-07-2026",
  "isro-istrac-02-2026",
  "sbi-law-officer-sco-2026",
  "sbi-bank-medical-officer-sco-2026",
  "sbi-defence-banking-advisor-sco-2026",
  "new-india-assurance-apprentice-2026-27",
  "bob-cic-regular-2026",
  "bob-cic-contractual-2026",
  "bob-it-fte-2026",
  "drdo-deal-apprentice-2026-27",
  "drdo-dysl-qt-jrf-2026",
  "ahc-pla-ghazipur-2026",
  "ahc-pla-baghpat-2026",
  "ahc-pla-sonbhadra-2026",
  "ahc-pla-sant-kabir-nagar-2026",
];

export function getVerifiedPublicVacancies(items, clock) {
  const at = getVacancyClockNow(clock);
  const verified = items.filter((item) => {
    if (!isVacancyApplicationWindowOpen(item, at)) return false;
    if (item.status === "verification_pending") return false;
    if (item.sourceType === "cross_check_only") return false;
    if (item.status !== "active" && item.status !== "closing_soon") return false;
    if (!isHttpsUrl(item.sourceUrl)) return false;
    // "Latest Verified" / public verified list: strict publication only.
    // Legacy open listings must not appear under a verified heading.
    if (classifyVacancyTrust(item) !== "VERIFIED_PUBLISHED") return false;
    return true;
  });

  return verified.sort((a, b) => {
    const ai = DISPLAY_ORDER.indexOf(a.id);
    const bi = DISPLAY_ORDER.indexOf(b.id);
    if (ai === -1 && bi === -1) return a.id.localeCompare(b.id);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function filterVerifiedPublicVacanciesBySector(items, sector, clock) {
  const verified = getVerifiedPublicVacancies(items, clock);
  if (sector === "all") return verified;
  return verified.filter((item) => getVerifiedVacancySector(item) === sector);
}

function deriveVacancyVerificationStatus(item) {
  if (item.verificationStatus) return item.verificationStatus;
  if (item.status === "verification_pending") return "pending";
  if (item.sourceType === "cross_check_only") return "manual_confirmation_required";
  return isVacancyPubliclyVerified(item) ? "verified" : "pending";
}

export function isVacancyPubliclyVerified(item, clock) {
  const at = getVacancyClockNow(clock);
  if (!isVacancyApplicationWindowOpen(item, at)) return false;
  if (item.status === "verification_pending") return false;
  if (item.sourceType === "cross_check_only") return false;
  if (item.status !== "active" && item.status !== "closing_soon") return false;
  if (!isHttpsUrl(item.sourceUrl)) return false;
  return classifyVacancyTrust(item) === "VERIFIED_PUBLISHED";
}

export function computePublicVacancySummary(items, clock) {
  const at = getVacancyClockNow(clock);
  const displayed = getVerifiedPublicVacancies(items, clock);

  const openListings = items.filter((item) => isVacancyApplicationWindowOpen(item, at)).length;

  let fullyVerified = 0;
  let reviewPendingOnDisplay = 0;
  for (const item of displayed) {
    const trust = classifyVacancyTrust(item);
    if (trust === "VERIFIED_PUBLISHED") fullyVerified += 1;
    else reviewPendingOnDisplay += 1;
  }

  const reviewPendingNotShown = items
    .filter((item) => {
      if (!isVacancyApplicationWindowOpen(item, at)) return false;
      if (item.status === "verification_pending") return true;
      if (item.sourceType === "cross_check_only") return true;
      if (item.isPreparationOnly) return false;
      return deriveVacancyVerificationStatus(item) !== "verified";
    })
    .filter((item) => !displayed.some((row) => row.id === item.id)).length;

  return {
    openListings,
    fullyVerified,
    reviewPending: reviewPendingOnDisplay + reviewPendingNotShown,
    displayed,
  };
}

export function resolveVacancyDataUpdatedIso(payload) {
  const dataset = parseIsoDate(payload.lastUpdated);
  if (dataset) return dataset;

  let latest = "";
  for (const item of payload.items ?? []) {
    for (const candidate of [item.lastVerifiedAt, item.sourceCheckedDate]) {
      const iso = parseIsoDate(candidate);
      if (iso && iso > latest) latest = iso;
    }
  }
  return latest || null;
}
