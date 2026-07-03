// @ts-check
/**
 * Pure, framework-free vacancy data loader core.
 *
 * This is the single source of truth for WHICH url each surface loads:
 *   - loadVacanciesLive()    -> /data/vacancies.json      (public production)
 *   - loadVacanciesPreview() -> /data/vacancies.preview.json (internal review)
 *
 * It has no React, router, or path-alias dependencies so it can be executed
 * directly in `node --test` with a mocked `fetch` (see the preview-leak
 * sentinel test). `src/lib/vacancies.ts` re-exports these loaders; there is
 * intentionally no second/parallel loader.
 */

export const LIVE_DATA_URL = "/data/vacancies.json";
export const PREVIEW_DATA_URL = "/data/vacancies.preview.json";

/** @type {import("./vacanciesSource.mjs").VacanciesLoadResult["payload"]} */
export const EMPTY_VACANCIES_PAYLOAD = {
  lastUpdated: "",
  source: "Vacancy data unavailable",
  items: [],
};

function isVacancyItem(value) {
  if (!value || typeof value !== "object") return false;
  const row = /** @type {Record<string, unknown>} */ (value);
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.status === "string" &&
    Array.isArray(row.preparationLinks)
  );
}

export function normalizeVacanciesPayload(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...EMPTY_VACANCIES_PAYLOAD };
  }
  const obj = /** @type {Record<string, unknown>} */ (raw);
  const list = Array.isArray(obj.items) ? obj.items : [];
  const items = list.filter(isVacancyItem);
  return {
    lastUpdated: typeof obj.lastUpdated === "string" ? obj.lastUpdated : "",
    source: typeof obj.source === "string" ? obj.source : "Vacancy data unavailable",
    items,
  };
}

export async function loadVacanciesFrom(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return { payload: { ...EMPTY_VACANCIES_PAYLOAD }, error: `HTTP ${response.status}` };
    }
    const raw = await response.json();
    return { payload: normalizeVacanciesPayload(raw) };
  } catch (error) {
    return {
      payload: { ...EMPTY_VACANCIES_PAYLOAD },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Load PUBLISHED live vacancy data. This is the ONLY data source used by the
 * public `/upcoming-exams` page, in every environment. There is no query
 * parameter, env var, or fallback that redirects it to preview data.
 */
export async function loadVacanciesLive() {
  return loadVacanciesFrom(LIVE_DATA_URL);
}

/**
 * Load PREVIEW (proposed) vacancy data. Only for the internal
 * `/vacancies-preview` review surface — never rendered on the public page.
 */
export async function loadVacanciesPreview() {
  return loadVacanciesFrom(PREVIEW_DATA_URL);
}

// ---------------------------------------------------------------------------
// Trust / publication classification (Update Safety System hardening).
// Single source of truth used by both the UI (re-exported via vacancies.ts)
// and the vacancy tools (imported from tools/vacancy-update-lib.mjs).
// ---------------------------------------------------------------------------

export const LIVE_LIST_REFERENCE_DATE = "2026-07-01";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseIso(value) {
  const t = String(value ?? "").trim();
  return ISO_DATE_RE.test(t) ? t : null;
}

function isHttps(url) {
  const t = String(url ?? "").trim();
  if (!t) return false;
  try {
    return new URL(t).protocol === "https:";
  } catch {
    return false;
  }
}

/** Legacy predicate: is this record part of the currently-public verified list? */
export function isVacancyPublicLegacy(item, referenceDate = LIVE_LIST_REFERENCE_DATE) {
  if (!item || item.active !== true) return false;
  if (item.status === "verification_pending") return false;
  if (item.status === "archive" || item.status === "closed") return false;
  if (item.isPreparationOnly === true) return false;
  if (item.sourceType === "cross_check_only") return false;
  if (item.status !== "active" && item.status !== "closing_soon") return false;
  if (!parseIso(item.applicationStartDate)) return false;
  const end = parseIso(item.applicationEndDate);
  const ref = parseIso(referenceDate);
  if (!end || !ref || end < ref) return false;
  if (!isHttps(item.sourceUrl)) return false;
  return true;
}

/** Does the record satisfy the STRICT new-model publication contract? */
export function strictPublicationContractPasses(item) {
  if (!item) return false;
  if (item.lifecycleStatus !== "published") return false;
  if (item.verificationStatus !== "verified") return false;
  if (!String(item.organisation ?? "").trim()) return false;
  if (!String(item.title ?? "").trim()) return false;
  if (!parseIso(item.applicationEndDate)) return false;
  if (!isHttps(item.officialNotificationUrl || item.officialNoticeUrl)) return false;
  if (!isHttps(item.officialApplicationUrl || item.applyUrl)) return false;
  if (!String(item.lastVerifiedAt ?? "").trim()) return false;
  if (!Array.isArray(item.sourceIds) || item.sourceIds.length === 0) return false;
  return true;
}

/**
 * Derive an explicit, truthful trust classification. Legacy public records are
 * never silently upgraded to "verified"; they are LEGACY_PUBLIC_UNVERIFIED.
 * @returns {"VERIFIED_PUBLISHED"|"LEGACY_PUBLIC_UNVERIFIED"|"REVIEW_REQUIRED"|"EXCLUDED_FROM_PUBLIC"}
 */
export function classifyVacancyTrust(item) {
  if (!item) return "EXCLUDED_FROM_PUBLIC";

  // Explicit exclusions first.
  if (item.lifecycleStatus === "draft" || item.lifecycleStatus === "withdrawn" || item.lifecycleStatus === "expired") {
    return "EXCLUDED_FROM_PUBLIC";
  }
  if (item.verificationStatus === "rejected") return "EXCLUDED_FROM_PUBLIC";
  if (
    item.status === "archive" ||
    item.status === "closed" ||
    item.status === "preparation_only" ||
    item.status === "departmental" ||
    item.status === "exam_process" ||
    item.isPreparationOnly === true
  ) {
    return "EXCLUDED_FROM_PUBLIC";
  }

  // Fully verified via the new model.
  if (strictPublicationContractPasses(item)) return "VERIFIED_PUBLISHED";

  // Opted into "published" but incomplete → must not go public as verified.
  if (item.lifecycleStatus === "published") return "REVIEW_REQUIRED";

  // Preserved legacy public record (truthfully NOT fully verified).
  if (isVacancyPublicLegacy(item)) return "LEGACY_PUBLIC_UNVERIFIED";

  return "REVIEW_REQUIRED";
}

/** Concise, non-alarming public/reviewer label for a trust class. */
export function getVacancyTrustLabel(trustClass) {
  switch (trustClass) {
    case "VERIFIED_PUBLISHED":
      return "Verified Open Job";
    case "LEGACY_PUBLIC_UNVERIFIED":
      return "Open listing — verification review pending";
    case "REVIEW_REQUIRED":
      return "Review required — not published";
    case "EXCLUDED_FROM_PUBLIC":
      return "Not shown publicly";
    default:
      return "Unknown";
  }
}
