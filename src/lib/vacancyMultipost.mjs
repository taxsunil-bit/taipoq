/**
 * Multi-post vacancy support (Batch B3).
 * Shared validation, strict-contract checks, placeholder detection and diff helpers.
 */

/** @typedef {import("../types/vacancy").VacancyItem} VacancyItem */
/** @typedef {import("../types/vacancy").VacancyPostGroup} VacancyPostGroup */

export const MULTIPOST_ERROR_CODES = {
  EMPTY: "MULTIPOST_EMPTY",
  DUPLICATE_ID: "MULTIPOST_DUPLICATE_ID",
  DUPLICATE_CODE: "MULTIPOST_DUPLICATE_CODE",
  PLACEHOLDER: "MULTIPOST_PLACEHOLDER",
  SOURCE_UNRESOLVED: "MULTIPOST_SOURCE_UNRESOLVED",
  FACTS_MISSING: "MULTIPOST_FACTS_MISSING",
  TOTAL_MISMATCH: "MULTIPOST_TOTAL_MISMATCH",
  AGE_INVALID: "MULTIPOST_AGE_INVALID",
  VACANCY_INVALID: "MULTIPOST_VACANCY_INVALID",
};

const PLACEHOLDER_PATTERNS = [
  /^post-?wise\b/i,
  /\bas per (the )?notification\b/i,
  /\bas per (the )?advertisement\b/i,
  /\bsee pdf\b/i,
  /\bview official notice\b/i,
  /\bview official advertisement\b/i,
  /\bvarious posts?\b/i,
  /\beligibility as per\b/i,
  /^post-wise;/i,
  /^not specified$/i,
  /^tbd$/i,
  /^n\/a$/i,
];

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function isHttpsUrl(url) {
  const t = String(url ?? "").trim();
  if (!t) return false;
  try {
    return new URL(t).protocol === "https:";
  } catch {
    return false;
  }
}

function parseIsoDate(value) {
  const t = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const d = new Date(`${t}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : t;
}

export function isMultipostPlaceholderText(value) {
  const text = String(value ?? "").trim();
  if (!text) return true;
  const lower = text.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((re) => re.test(lower));
}

export function hasVerifiedPostGroupAge(group) {
  if (!group) return false;
  const min = group.ageMinimum;
  const max = group.ageMaximum;
  const cutoff = parseIsoDate(group.ageCutoffDate);
  if (Number.isInteger(min) && Number.isInteger(max) && min > 0 && max >= min && cutoff) {
    return true;
  }
  const text = String(group.ageLimitText ?? "").trim();
  if (text && !isMultipostPlaceholderText(text)) return true;
  return group.ageNotApplicable === true;
}

export function hasVerifiedPostGroupPay(group) {
  if (!group) return false;
  const pay = String(group.payLevel ?? group.salary ?? "").trim();
  if (pay && !isMultipostPlaceholderText(pay)) return true;
  return group.payNotApplicable === true;
}

export function sumPostGroupVacancies(item) {
  let sum = 0;
  let complete = true;
  for (const group of item?.postGroups ?? []) {
    const total = group?.vacancies?.total;
    if (!Number.isInteger(total) || total < 0) {
      complete = false;
      break;
    }
    sum += total;
  }
  return { sum, complete };
}

/**
 * Validate postGroups on a record (dataset validator).
 * @param {VacancyItem} item
 * @param {{ errors: string[], warnings: string[], rowLabel: string, knownSourceIds?: Set<string> }} ctx
 */
export function validateMultipostRecord(item, ctx) {
  const groups = item?.postGroups;
  if (!Array.isArray(groups) || groups.length === 0) return;

  const { errors, rowLabel } = ctx;
  const knownSourceIds = ctx.knownSourceIds ?? new Set();
  const seenIds = new Set();
  const seenCodes = new Set();

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const glabel = `${rowLabel} postGroups[${i}]`;
    if (!group || typeof group !== "object") {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.EMPTY} — invalid post group object`);
      continue;
    }
    const gid = String(group.id ?? "").trim();
    if (!gid) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.EMPTY} — missing id`);
    } else if (seenIds.has(gid)) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.DUPLICATE_ID} — duplicate id "${gid}"`);
    } else {
      seenIds.add(gid);
    }

    if (isBlank(group.title)) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.EMPTY} — missing title`);
    }

    const vacTotal = group.vacancies?.total;
    if (vacTotal === undefined || vacTotal === null) {
      if (group.vacancies?.notSpecifiedInNotice !== true) {
        errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.VACANCY_INVALID} — missing vacancy total`);
      }
    } else if (!Number.isInteger(vacTotal) || vacTotal < 0) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.VACANCY_INVALID} — invalid vacancy total`);
    }

    if (isBlank(group.qualification) || isMultipostPlaceholderText(group.qualification)) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.PLACEHOLDER} — qualification missing or placeholder`);
    }

    if (!hasVerifiedPostGroupAge(group)) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.AGE_INVALID} — age not verified`);
    }

    if (Array.isArray(group.postCodes)) {
      for (const code of group.postCodes) {
        const c = String(code ?? "").trim();
        if (!c) continue;
        if (seenCodes.has(c)) {
          errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.DUPLICATE_CODE} — duplicate post code "${c}"`);
        } else {
          seenCodes.add(c);
        }
      }
    }

    if (!Array.isArray(group.sourceIds) || group.sourceIds.length === 0) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.SOURCE_UNRESOLVED} — missing sourceIds`);
    } else {
      for (const sid of group.sourceIds) {
        if (knownSourceIds.size > 0 && !knownSourceIds.has(String(sid).trim())) {
          errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.SOURCE_UNRESOLVED} — unresolved sourceId "${sid}"`);
        }
      }
    }

    if (
      item.lifecycleStatus === "published" &&
      item.verificationStatus === "verified" &&
      (!Array.isArray(group.verifiedFacts) || group.verifiedFacts.length === 0)
    ) {
      errors.push(`${glabel}: ${MULTIPOST_ERROR_CODES.FACTS_MISSING} — verifiedFacts required for published post group`);
    }
  }

  const { sum, complete } = sumPostGroupVacancies(item);
  if (
    complete &&
    Number.isInteger(item.totalVacancies) &&
    item.totalVacancies >= 0 &&
    sum !== item.totalVacancies
  ) {
    errors.push(
      `${rowLabel}: ${MULTIPOST_ERROR_CODES.TOTAL_MISMATCH} — totalVacancies ${item.totalVacancies} != postGroups sum ${sum}`,
    );
  }
}

/** Strict publication contract extension for records with postGroups. */
export function multipostStrictContractPasses(item) {
  if (!item || !Array.isArray(item.postGroups) || item.postGroups.length === 0) return true;

  if (!String(item.advertisementNumber ?? "").trim()) return false;

  const seenIds = new Set();
  const seenCodes = new Set();

  for (const group of item.postGroups) {
    const gid = String(group?.id ?? "").trim();
    if (!gid || seenIds.has(gid)) return false;
    seenIds.add(gid);

    if (isBlank(group.title)) return false;

    const vacTotal = group.vacancies?.total;
    if (vacTotal === undefined || vacTotal === null) {
      if (group.vacancies?.notSpecifiedInNotice !== true) return false;
    } else if (!Number.isInteger(vacTotal) || vacTotal < 0) {
      return false;
    }

    if (isBlank(group.qualification) || isMultipostPlaceholderText(group.qualification)) return false;
    if (!hasVerifiedPostGroupAge(group)) return false;
    if (!hasVerifiedPostGroupPay(group)) return false;

    if (!Array.isArray(group.sourceIds) || group.sourceIds.length === 0) return false;
    if (!Array.isArray(group.verifiedFacts) || group.verifiedFacts.length === 0) return false;

    for (const code of group.postCodes ?? []) {
      const c = String(code ?? "").trim();
      if (!c) continue;
      if (seenCodes.has(c)) return false;
      seenCodes.add(c);
    }
  }

  const { sum, complete } = sumPostGroupVacancies(item);
  if (complete && Number.isInteger(item.totalVacancies) && sum !== item.totalVacancies) return false;

  return true;
}

/** Collect all sourceIds referenced on a vacancy (top-level + nested post groups). */
export function collectVacancySourceIds(item) {
  const ids = new Set();
  for (const sid of item?.sourceIds ?? []) {
    const s = String(sid ?? "").trim();
    if (s) ids.add(s);
  }
  for (const group of item?.postGroups ?? []) {
    for (const sid of group?.sourceIds ?? []) {
      const s = String(sid ?? "").trim();
      if (s) ids.add(s);
    }
  }
  return ids;
}

/**
 * Semantic diff for nested post groups between two record versions.
 * @returns {{ added: string[], removed: string[], modified: string[], vacancyCountChanges: { id: string, from: number, to: number }[] }}
 */
export function diffPostGroups(beforeItem, afterItem) {
  const before = new Map((beforeItem?.postGroups ?? []).map((g) => [String(g.id), g]));
  const after = new Map((afterItem?.postGroups ?? []).map((g) => [String(g.id), g]));
  const added = [];
  const removed = [];
  const modified = [];
  const vacancyCountChanges = [];

  for (const [id, group] of after) {
    if (!before.has(id)) added.push(id);
    else {
      const prev = before.get(id);
      if (JSON.stringify(prev) !== JSON.stringify(group)) modified.push(id);
      const from = prev?.vacancies?.total;
      const to = group?.vacancies?.total;
      if (from !== to) vacancyCountChanges.push({ id, from, to });
    }
  }
  for (const id of before.keys()) {
    if (!after.has(id)) removed.push(id);
  }

  return { added, removed, modified, vacancyCountChanges };
}

export { isHttpsUrl, parseIsoDate, isBlank };
