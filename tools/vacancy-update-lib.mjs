/**
 * Shared helpers for the TAIPOQ vacancy Update Safety System tools
 * (prepare / publish / rollback). Pure file + comparison utilities — this
 * module never touches Git and never performs network requests.
 *
 * Data/backup/report locations honour env overrides so tests can operate in an
 * isolated temporary sandbox instead of the real project data:
 *   VACANCY_DATA_DIR, VACANCY_BACKUP_DIR, VACANCY_REPORT_DIR
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  classifyVacancyTrust,
  isVacancyPublicLegacy,
  strictPublicationContractPasses,
} from "../src/lib/vacanciesSource.mjs";
import { collectVacancySourceIds, diffPostGroups } from "../src/lib/vacancyMultipost.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const DATA_DIR = process.env.VACANCY_DATA_DIR
  ? path.resolve(process.env.VACANCY_DATA_DIR)
  : path.join(ROOT, "public", "data");

export const LIVE_PATH = path.join(DATA_DIR, "vacancies.json");
export const PREVIEW_PATH = path.join(DATA_DIR, "vacancies.preview.json");
export const SOURCES_PATH = path.join(DATA_DIR, "vacancy-sources.json");
export const REGISTRY_PATH = path.join(DATA_DIR, "content-registry.json");

export const BACKUP_DIR = process.env.VACANCY_BACKUP_DIR
  ? path.resolve(process.env.VACANCY_BACKUP_DIR)
  : path.join(ROOT, "backups", "content");
export const REPORT_DIR = process.env.VACANCY_REPORT_DIR
  ? path.resolve(process.env.VACANCY_REPORT_DIR)
  : path.join(ROOT, "reports", "vacancy-updates");

export { classifyVacancyTrust, isVacancyPublicLegacy, strictPublicationContractPasses };

/** Files backed up before every publish (Update Safety System scope). */
export const BACKED_UP_FILES = [
  { key: "vacancies.json", path: LIVE_PATH },
  { key: "vacancy-sources.json", path: SOURCES_PATH },
  { key: "content-registry.json", path: REGISTRY_PATH },
];

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function readJsonSafe(filePath, fallback = null) {
  try {
    if (!existsSync(filePath)) return fallback;
    return readJson(filePath);
  } catch {
    return fallback;
  }
}

export function writeJson(filePath, value) {
  writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

export function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

export function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function timestamp(date = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}_` +
    `${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
  );
}

export function istTimestampIso(date = new Date()) {
  // Express the instant with the +05:30 India Standard Time offset.
  const ist = new Date(date.getTime() + (330 + date.getTimezoneOffset()) * 60000);
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${ist.getFullYear()}-${p(ist.getMonth() + 1)}-${p(ist.getDate())}T` +
    `${p(ist.getHours())}:${p(ist.getMinutes())}:${p(ist.getSeconds())}+05:30`
  );
}

export function istDateOnly(date = new Date()) {
  return istTimestampIso(date).slice(0, 10);
}

export function formatDDMMYYYY(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? "").trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

function itemsById(payload) {
  const map = new Map();
  for (const item of payload?.items ?? []) {
    if (item?.id) map.set(item.id, item);
  }
  return map;
}

const DATE_FIELDS = [
  "applicationStartDate",
  "applicationEndDate",
  "feePaymentLastDate",
  "correctionStartDate",
  "correctionEndDate",
  "notificationDate",
];
const SOURCE_FIELDS = [
  "sourceUrl",
  "officialNoticeUrl",
  "officialNotificationUrl",
  "officialApplicationUrl",
  "applyUrl",
  "sourceType",
];

function changedFields(a, b, fields) {
  const out = [];
  for (const f of fields) {
    const av = JSON.stringify(a?.[f] ?? null);
    const bv = JSON.stringify(b?.[f] ?? null);
    if (av !== bv) out.push({ field: f, from: a?.[f] ?? null, to: b?.[f] ?? null });
  }
  return out;
}

/**
 * Classify differences between live and preview datasets.
 * Categories: added, corrected, unchanged, expired, withdrawn, removed.
 */
export function classifyChanges(livePayload, previewPayload) {
  const live = itemsById(livePayload);
  const preview = itemsById(previewPayload);

  const added = [];
  const corrected = [];
  const unchanged = [];
  const expired = [];
  const withdrawn = [];
  const removed = [];
  const statusChanges = [];
  const sourceChanges = [];
  const dateChanges = [];

  for (const [id, prev] of preview) {
    const cur = live.get(id);
    if (!cur) {
      added.push(prev);
      continue;
    }
    const same = JSON.stringify(cur) === JSON.stringify(prev);
    const prevLifecycle = prev.lifecycleStatus;
    const wasOpen = cur.status === "active" || cur.status === "closing_soon";

    if (prevLifecycle === "withdrawn" || prev.status === "withdrawn") {
      withdrawn.push({ id, from: cur.status, to: prev.status });
    } else if (
      prevLifecycle === "expired" ||
      (wasOpen && (prev.status === "closed" || prev.status === "archive"))
    ) {
      expired.push({ id, from: cur.status, to: prev.status });
    } else if (same) {
      unchanged.push(prev);
    } else {
      corrected.push(prev);
    }

    if (cur.status !== prev.status || cur.lifecycleStatus !== prev.lifecycleStatus) {
      statusChanges.push({
        id,
        from: `${cur.status}${cur.lifecycleStatus ? "/" + cur.lifecycleStatus : ""}`,
        to: `${prev.status}${prev.lifecycleStatus ? "/" + prev.lifecycleStatus : ""}`,
      });
    }
    const sc = changedFields(cur, prev, SOURCE_FIELDS);
    if (sc.length) sourceChanges.push({ id, changes: sc });
    const dc = changedFields(cur, prev, DATE_FIELDS);
    if (dc.length) dateChanges.push({ id, changes: dc });
  }

  for (const [id, cur] of live) {
    if (!preview.has(id)) removed.push(cur);
  }

  return {
    added,
    corrected,
    unchanged,
    expired,
    withdrawn,
    removed,
    statusChanges,
    sourceChanges,
    dateChanges,
    liveCount: live.size,
    previewCount: preview.size,
  };
}

/** A removed record that was publicly verified/published is a destructive change. */
export function destructiveRemovals(removed) {
  return removed.filter((item) => {
    if (item.lifecycleStatus === "published") return true;
    const openLegacy =
      item.active === true && (item.status === "active" || item.status === "closing_soon");
    return openLegacy;
  });
}

export function bumpContentVersion(current, date = new Date()) {
  const today = istDateOnly(date).replace(/-/g, ".");
  if (typeof current === "string") {
    const m = /^(\d{4}\.\d{2}\.\d{2})\.(\d+)$/.exec(current);
    if (m && m[1] === today) return `${today}.${Number(m[2]) + 1}`;
  }
  return `${today}.1`;
}

// ---------------------------------------------------------------------------
// URL normalization + stable identity (Part F / Part G)
// ---------------------------------------------------------------------------

/** Normalize a URL for equality comparison: drop fragment + trailing slash. */
export function normalizeUrl(url) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    u.hash = "";
    let pathname = u.pathname.replace(/\/+$/, "");
    if (pathname === "") pathname = "/";
    return `${u.protocol}//${u.host.toLowerCase()}${pathname}${u.search}`;
  } catch {
    return raw.replace(/#.*$/, "").replace(/\/+$/, "");
  }
}

export function domainOf(url) {
  try {
    return new URL(String(url).trim()).host.toLowerCase();
  } catch {
    return "";
  }
}

/** Heuristic: does the host look like an official Indian government domain? */
export function looksOfficialDomain(host) {
  const h = String(host ?? "").toLowerCase();
  if (!h) return false;
  return (
    h.endsWith(".gov.in") ||
    h.endsWith(".nic.in") ||
    h.endsWith(".gov") ||
    h.endsWith(".ac.in") ||
    h === "bank.sbi" ||
    h.endsWith(".sbi") ||
    /(^|\.)(ibps|rbi|upsc|ssc|drdo|isro|aiims|joinindiannavy|indianairforce|joinindianarmy)\./.test(h)
  );
}

/**
 * Stable identity strategy for a vacancy record. Prefers slug, then id, then
 * organisation + advertisement number + post, then a documented fallback.
 */
export function vacancyIdentity(item) {
  const slug = String(item?.slug ?? "").trim();
  if (slug) return { key: `slug:${slug}`, strategy: "slug", ambiguous: false };
  const id = String(item?.id ?? "").trim();
  if (id) return { key: `id:${id}`, strategy: "id", ambiguous: false };
  const org = String(item?.organisation ?? "").trim().toLowerCase();
  const adv = String(item?.advertisementNumber ?? "").trim().toLowerCase();
  const post = String(item?.postName ?? item?.title ?? "").trim().toLowerCase();
  if (org && adv) {
    return {
      key: `orgadv:${org}::${adv}::${post}`,
      strategy: "organisation+advertisementNumber+post",
      ambiguous: false,
    };
  }
  return { key: `fallback:${org}::${post}`, strategy: "fallback:organisation+title", ambiguous: true };
}

// ---------------------------------------------------------------------------
// Source registry integrity audit (Part F)
// ---------------------------------------------------------------------------

export function auditSourceRegistry(vacancies, sources) {
  const vacancyIds = new Set();
  const slugToId = new Map();
  const referencedSourceIds = new Map(); // sourceId -> [vacancyId]
  for (const v of vacancies) {
    if (v?.id) vacancyIds.add(v.id);
    if (v?.slug) slugToId.set(String(v.slug), v.id);
    for (const sid of collectVacancySourceIds(v)) {
      const list = referencedSourceIds.get(sid) ?? [];
      list.push(v.id);
      referencedSourceIds.set(sid, list);
    }
  }

  const sourceIds = new Set();
  const duplicateSourceIds = [];
  const missingType = [];
  const byNormalizedUrl = new Map(); // normUrl -> [{id, sourceType}]
  const vacancyToSources = new Map(); // vacancyId -> [sourceId]
  const orphanSources = []; // vacancyId does not resolve
  const nonOfficialButOfficialTyped = [];
  const domains = new Set();

  for (const s of sources) {
    if (!s || typeof s !== "object") continue;
    const sid = String(s.id ?? "").trim();
    if (!sid) {
      missingType.push({ id: "(missing id)", issue: "missing id" });
    } else if (sourceIds.has(sid)) {
      duplicateSourceIds.push(sid);
    } else {
      sourceIds.add(sid);
    }
    if (!String(s.sourceType ?? "").trim()) missingType.push({ id: sid, issue: "missing sourceType" });

    const norm = normalizeUrl(s.url);
    if (norm) {
      const list = byNormalizedUrl.get(norm) ?? [];
      list.push({ id: sid, sourceType: s.sourceType });
      byNormalizedUrl.set(norm, list);
    }
    const host = domainOf(s.url);
    if (host) domains.add(host);

    const isOfficialType = String(s.sourceType ?? "").startsWith("official-");
    if (isOfficialType && host && !looksOfficialDomain(host)) {
      nonOfficialButOfficialTyped.push({ id: sid, host, sourceType: s.sourceType });
    }

    // Resolve linked vacancy.
    const vid = String(s.vacancyId ?? "").trim();
    let resolvedId = vacancyIds.has(vid) ? vid : null;
    if (!resolvedId && Array.isArray(s.linkedVacancySlugs)) {
      for (const slug of s.linkedVacancySlugs) {
        if (slugToId.has(String(slug))) {
          resolvedId = slugToId.get(String(slug));
          break;
        }
      }
    }
    if (!resolvedId) {
      orphanSources.push({ id: sid, vacancyId: vid });
    } else {
      const list = vacancyToSources.get(resolvedId) ?? [];
      list.push(sid);
      vacancyToSources.set(resolvedId, list);
    }
  }

  const duplicateNormalizedUrls = [];
  for (const [norm, list] of byNormalizedUrl) {
    const distinctIds = [...new Set(list.map((x) => x.id))];
    if (distinctIds.length > 1) duplicateNormalizedUrls.push({ normalizedUrl: norm, sourceIds: distinctIds });
  }

  const sharedSources = [];
  for (const [norm, list] of byNormalizedUrl) {
    // A URL used by sources linked to more than one vacancy.
    const vids = new Set();
    for (const entry of list) {
      const vs = referencedSourceIds.get(entry.id) ?? [];
      vs.forEach((v) => vids.add(v));
    }
    if (vids.size > 1) sharedSources.push({ normalizedUrl: norm, vacancyIds: [...vids] });
  }

  const vacanciesWithoutSource = [];
  for (const v of vacancies) {
    if (!v?.id) continue;
    const hasRegistrySource = vacancyToSources.has(v.id);
    const hasRefIds = Array.isArray(v.sourceIds) && v.sourceIds.length > 0;
    if (!hasRegistrySource && !hasRefIds) vacanciesWithoutSource.push(v.id);
  }

  const unresolvedSourceIds = [];
  for (const [sid, vids] of referencedSourceIds) {
    if (!sourceIds.has(sid)) unresolvedSourceIds.push({ sourceId: sid, referencedBy: vids });
  }

  return {
    totalSources: sources.length,
    totalVacancies: vacancies.length,
    duplicateSourceIds,
    missingType,
    duplicateNormalizedUrls,
    sharedSources,
    orphanSources,
    vacanciesWithoutSource,
    unresolvedSourceIds,
    nonOfficialButOfficialTyped,
    distinctDomains: [...domains].sort(),
  };
}

// ---------------------------------------------------------------------------
// Semantic live-vs-preview diff (Part G)
// ---------------------------------------------------------------------------

function indexByIdentity(items) {
  const map = new Map();
  const strategies = new Map();
  for (const item of items ?? []) {
    const { key, strategy, ambiguous } = vacancyIdentity(item);
    map.set(key, item);
    strategies.set(key, { strategy, ambiguous });
  }
  return { map, strategies };
}

function collisions(items, field, normalize = (v) => String(v ?? "").trim()) {
  const seen = new Map();
  const found = [];
  for (const item of items ?? []) {
    const raw = item?.[field];
    const val = normalize(raw);
    if (!val) continue;
    if (seen.has(val)) found.push({ value: raw, ids: [seen.get(val), item.id] });
    else seen.set(val, item.id);
  }
  return found;
}

/** Official national portals that multiple unrelated employers may legitimately share. */
const SHARED_APPLICATION_PORTAL_URLS = new Set([normalizeUrl("https://nats.education.gov.in/")]);

function applicationUrlCollisionsFor(items) {
  const byId = new Map((items ?? []).map((i) => [i.id, i]));
  return collisions(items, "applyUrl", (v) => normalizeUrl(v)).filter((c) => {
    const norm = normalizeUrl(c.value);
    if (!SHARED_APPLICATION_PORTAL_URLS.has(norm)) return true;
    const orgs = c.ids.map((id) => String(byId.get(id)?.organisation ?? "").trim().toLowerCase());
    return new Set(orgs).size < orgs.length;
  });
}

export function semanticDiff(livePayload, previewPayload, opts = {}) {
  const base = classifyChanges(livePayload, previewPayload);
  const liveItems = livePayload?.items ?? [];
  const previewItems = previewPayload?.items ?? [];
  const live = indexByIdentity(liveItems);
  const preview = indexByIdentity(previewItems);

  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];
  const trustChanges = [];
  const eligibilityChanges = [];
  const postGroupChanges = [];
  const identityStrategies = [];

  for (const [key, prev] of preview.map) {
    const info = preview.strategies.get(key);
    if (info?.ambiguous) {
      identityStrategies.push({ id: prev.id, strategy: info.strategy, ambiguous: true });
    }
    const cur = live.map.get(key);
    if (!cur) {
      added.push(prev.id);
      continue;
    }
    if (JSON.stringify(cur) === JSON.stringify(prev)) unchanged.push(prev.id);
    else modified.push(prev.id);

    const curTrust = classifyVacancyTrust(cur);
    const prevTrust = classifyVacancyTrust(prev);
    if (curTrust !== prevTrust) trustChanges.push({ id: prev.id, from: curTrust, to: prevTrust });

    const curElig = strictPublicationContractPasses(cur);
    const prevElig = strictPublicationContractPasses(prev);
    if (curElig !== prevElig) eligibilityChanges.push({ id: prev.id, from: curElig, to: prevElig });

    const pgDiff = diffPostGroups(cur, prev);
    if (
      pgDiff.added.length ||
      pgDiff.removed.length ||
      pgDiff.modified.length ||
      pgDiff.vacancyCountChanges.length
    ) {
      postGroupChanges.push({ id: prev.id, ...pgDiff });
    }
  }
  for (const [key, cur] of live.map) {
    if (!preview.map.has(key)) removed.push(cur.id);
  }

  const publicBefore = liveItems.filter((i) => {
    const t = classifyVacancyTrust(i);
    return t === "VERIFIED_PUBLISHED" || t === "LEGACY_PUBLIC_UNVERIFIED";
  }).length;
  const publicAfter = previewItems.filter((i) => {
    const t = classifyVacancyTrust(i);
    return t === "VERIFIED_PUBLISHED" || t === "LEGACY_PUBLIC_UNVERIFIED";
  }).length;

  // Source-mapping deltas (by referenced sourceIds, including nested post groups).
  const liveSrc = new Map(liveItems.map((i) => [i.id, collectVacancySourceIds(i)]));
  const sourceMappingsAdded = [];
  const sourceMappingsRemoved = [];
  for (const p of previewItems) {
    const before = liveSrc.get(p.id) ?? new Set();
    const after = collectVacancySourceIds(p);
    for (const s of after) if (!before.has(s)) sourceMappingsAdded.push({ id: p.id, sourceId: s });
    for (const s of before) if (!after.has(s)) sourceMappingsRemoved.push({ id: p.id, sourceId: s });
  }

  return {
    ...base,
    identityStrategyUsed: "slug > id > organisation+advertisementNumber+post > fallback(organisation+title)",
    ambiguousIdentities: identityStrategies,
    semantic: { added, removed, modified, unchanged },
    duplicateIdentities: collisions(previewItems, "id"),
    slugCollisions: collisions(previewItems, "slug"),
    notificationNumberCollisions: collisions(
      previewItems,
      "advertisementNumber",
      (v) => String(v ?? "").trim().toLowerCase(),
    ),
    applicationUrlCollisions: applicationUrlCollisionsFor(previewItems),
    sourceMappingsAdded,
    sourceMappingsRemoved,
    trustChanges,
    eligibilityChanges,
    postGroupChanges,
    publicVisibleBefore: publicBefore,
    publicVisibleAfter: publicAfter,
    publicVisibleDelta: publicAfter - publicBefore,
    ...(opts.extra ?? {}),
  };
}

// ---------------------------------------------------------------------------
// Transaction journal + publish lock + atomic swap (Part H)
// ---------------------------------------------------------------------------

const STATE_DIR = path.dirname(BACKUP_DIR);
export const LOCK_PATH = path.join(STATE_DIR, "publish.lock");
export const TX_DIR = path.join(STATE_DIR, "transaction");
export const TX_STATES = {
  PREPARED: "PREPARED",
  BACKED_UP: "BACKED_UP",
  SWAPPING: "SWAPPING",
  VALIDATING: "VALIDATING",
  COMMITTED: "COMMITTED",
  ROLLED_BACK: "ROLLED_BACK",
};

export function acquireLock(meta = {}) {
  ensureDir(STATE_DIR);
  if (existsSync(LOCK_PATH)) return { acquired: false, holder: readJsonSafe(LOCK_PATH, {}) };
  writeJson(LOCK_PATH, { pid: process.pid, acquiredAt: istTimestampIso(), ...meta });
  return { acquired: true };
}

export function releaseLock() {
  if (existsSync(LOCK_PATH)) rmSync(LOCK_PATH, { force: true });
}

export function journalFile(txDir = TX_DIR) {
  return path.join(txDir, "journal.json");
}

export function writeJournal(state, extra = {}, txDir = TX_DIR) {
  ensureDir(txDir);
  const prev = readJsonSafe(journalFile(txDir), { history: [] });
  const history = Array.isArray(prev.history) ? prev.history : [];
  history.push({ state, at: istTimestampIso() });
  writeJson(journalFile(txDir), { state, updatedAt: istTimestampIso(), history, ...extra });
}

export function readJournal(txDir = TX_DIR) {
  return readJsonSafe(journalFile(txDir), null);
}

export function clearTransaction(txDir = TX_DIR) {
  if (existsSync(txDir)) rmSync(txDir, { recursive: true, force: true });
}

/**
 * Replace a target file with the contents of a source file using a same-dir
 * temp file + rename. rename() is atomic per file on the same volume, so a
 * crash leaves the target either fully old or fully new (never truncated).
 * NOTE: atomicity is per-file; multi-file consistency is provided by the
 * journal + verified backup restore, not by a single atomic operation.
 */
export function atomicReplaceFrom(srcFile, targetFile) {
  ensureDir(path.dirname(targetFile));
  const tmp = `${targetFile}.tmp-${process.pid}-${Date.now()}`;
  copyFileSync(srcFile, tmp);
  renameSync(tmp, targetFile);
}

export { copyFileSync, renameSync, rmSync };
