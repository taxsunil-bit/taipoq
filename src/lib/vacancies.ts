import type { VacanciesPayload, VacancyItem, VacancyStatus } from "@/types/vacancy";

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

/** Jobs with closing date before this ISO day are excluded from the public live list. */
export const LIVE_LIST_REFERENCE_DATE = "2026-07-01";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(value: string | undefined): string | null {
  const trimmed = value?.trim();
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

/** Live on reference day when exact closing date exists and closing date >= reference date. */
export function isLiveVacancyByClosingDate(
  applicationEndDate: string | undefined,
  referenceDate: string = LIVE_LIST_REFERENCE_DATE,
): boolean {
  const end = parseIsoDate(applicationEndDate);
  const ref = parseIsoDate(referenceDate);
  if (!end || !ref) return false;
  return end >= ref;
}

const PREVIEW_DATA_URL = "/data/vacancies.preview.json";

const EMPTY_PAYLOAD: VacanciesPayload = {
  lastUpdated: "",
  source: "Preview unavailable",
  items: [],
};

export type VacanciesPreviewLoadResult = {
  payload: VacanciesPayload;
  error?: string;
};

function isVacancyItem(value: unknown): value is VacancyItem {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.status === "string" &&
    Array.isArray(row.preparationLinks)
  );
}

function normalizePayload(raw: unknown): VacanciesPayload {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return EMPTY_PAYLOAD;
  }

  const obj = raw as Record<string, unknown>;
  const list = Array.isArray(obj.items) ? obj.items : [];
  const items = list.filter(isVacancyItem);

  return {
    lastUpdated: typeof obj.lastUpdated === "string" ? obj.lastUpdated : "",
    source: typeof obj.source === "string" ? obj.source : "Preview unavailable",
    items,
  };
}

export async function loadVacanciesPreview(): Promise<VacanciesPreviewLoadResult> {
  try {
    const response = await fetch(PREVIEW_DATA_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        payload: EMPTY_PAYLOAD,
        error: `HTTP ${response.status}`,
      };
    }

    const raw = (await response.json()) as unknown;
    const payload = normalizePayload(raw);

    return { payload };
  } catch (error) {
    return {
      payload: EMPTY_PAYLOAD,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

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
  const value = (category ?? "").toLowerCase();
  return value.includes("judiciary local") || value.includes("pla member") || value.includes("pla / contract");
}

export function isJudicialVacancyCategory(category: string | undefined): boolean {
  if (isJudicialLocalVacancyCategory(category)) return false;
  return (category ?? "").toLowerCase().includes("judicial");
}

export function isBankSpecialistVacancyCategory(category: string | undefined): boolean {
  return (category ?? "").toLowerCase().includes("bank specialist");
}

export type VerifiedJobSector =
  | "all"
  | "railway"
  | "banking"
  | "bank_specialist"
  | "insurance"
  | "defence"
  | "drdo"
  | "space_research"
  | "upsc"
  | "dsssb"
  | "judicial"
  | "judiciary_local";

export function getVerifiedVacancySector(
  item: VacancyItem,
): Exclude<VerifiedJobSector, "all"> | null {
  const category = (item.category ?? "").toLowerCase();

  if (isJudicialLocalVacancyCategory(item.category)) return "judiciary_local";
  if (isJudicialVacancyCategory(item.category)) return "judicial";
  if (isBankSpecialistVacancyCategory(item.category)) return "bank_specialist";
  if (category.includes("railway") || category.includes("rrb")) return "railway";
  if (category.includes("dsssb") || category.includes("delhi govt")) return "dsssb";
  if (category.includes("isro") || category.includes("space / research")) return "space_research";
  if (category.includes("drdo") || category.includes("r&d")) return "drdo";
  if (category.includes("upsc")) return "upsc";
  if (category.includes("insurance")) return "insurance";
  if (category.includes("defence") || category.includes("navy")) return "defence";
  if (category.includes("banking")) return "banking";

  return null;
}

export function filterVerifiedPublicVacanciesBySector(
  items: VacancyItem[],
  sector: VerifiedJobSector,
): VacancyItem[] {
  const verified = getVerifiedPublicVacancies(items);
  if (sector === "all") return verified;
  return verified.filter((item) => getVerifiedVacancySector(item) === sector);
}

export function getVerifiedPublicVacancies(items: VacancyItem[]): VacancyItem[] {
  const verified = items.filter((item) => {
    if (!item.active) return false;
    if (item.status === "verification_pending") return false;
    if (item.status === "archive" || item.status === "closed") return false;
    if (item.isPreparationOnly) return false;
    if (item.sourceType === "cross_check_only") return false;
    if (item.status !== "active" && item.status !== "closing_soon") return false;
    if (!parseIsoDate(item.applicationStartDate)) return false;
    if (!isLiveVacancyByClosingDate(item.applicationEndDate)) return false;
    if (!isHttpsUrl(item.sourceUrl)) return false;
    return true;
  });

  const order = [
    "rrb-technician-cen-02-2026",
    "dsssb-advt-03-2026",
    "isro-istrac-02-2026",
    "sbi-po-2026",
    "sbi-law-officer-sco-2026",
    "sbi-bank-medical-officer-sco-2026",
    "sbi-defence-banking-advisor-sco-2026",
    "new-india-assurance-apprentice-2026-27",
    "bob-cic-regular-2026",
    "bob-cic-contractual-2026",
    "bob-it-fte-2026",
    "upsc-advt-07-2026",
    "indian-navy-ssc-various-entries-jun-2027",
    "indian-navy-agniveer-apprentice-0127-0227-2026",
    "drdo-deal-apprentice-2026-27",
    "drdo-dysl-qt-jrf-2026",
    "gujarat-hc-legal-assistant-2026",
    "ahc-pla-ghazipur-2026",
    "ahc-pla-baghpat-2026",
    "ahc-pla-sonbhadra-2026",
    "ahc-pla-sant-kabir-nagar-2026",
  ];

  return verified.sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
