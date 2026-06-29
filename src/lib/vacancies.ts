import type { VacanciesPayload, VacancyItem, VacancyStatus } from "@/types/vacancy";

const VACANCY_STATUS_LABELS: Record<VacancyStatus, string> = {
  closing_soon: "अंतिम तिथि निकट",
  active: "आवेदन चालू",
  correction_window: "संशोधन अवधि",
  archive: "पुरानी सूचना",
  verification_pending: "जाँच शेष",
  preparation_only: "तैयारी हेतु",
  closed: "आवेदन समाप्त",
  exam_process: "परीक्षा चरण",
  departmental: "विभागीय",
};

export function formatVacancyStatusLabel(status: VacancyStatus): string {
  return VACANCY_STATUS_LABELS[status] ?? status;
}

/** Jobs with closing date before this ISO day are excluded from the public live list. */
export const LIVE_LIST_REFERENCE_DATE = "2026-06-30";

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

export function isJudicialVacancyCategory(category: string | undefined): boolean {
  return (category ?? "").toLowerCase().includes("judicial jobs");
}

export function isBankSpecialistVacancyCategory(category: string | undefined): boolean {
  return (category ?? "").toLowerCase().includes("bank specialist");
}

export type VerifiedVacancySections = {
  general: VacancyItem[];
  judicial: VacancyItem[];
  bankSpecialist: VacancyItem[];
};

export function groupVerifiedPublicVacancies(items: VacancyItem[]): VerifiedVacancySections {
  const verified = getVerifiedPublicVacancies(items);
  const general: VacancyItem[] = [];
  const judicial: VacancyItem[] = [];
  const bankSpecialist: VacancyItem[] = [];

  for (const item of verified) {
    if (isJudicialVacancyCategory(item.category)) {
      judicial.push(item);
    } else if (isBankSpecialistVacancyCategory(item.category)) {
      bankSpecialist.push(item);
    } else {
      general.push(item);
    }
  }

  return { general, judicial, bankSpecialist };
}

export function getVerifiedPublicVacancies(items: VacancyItem[]): VacancyItem[] {
  const verified = items.filter((item) => {
    if (!item.active) return false;
    if (item.status === "verification_pending") return false;
    if (item.status === "archive" || item.status === "closed") return false;
    if (item.isPreparationOnly) return false;
    if (item.sourceType === "cross_check_only") return false;
    if (item.status !== "active" && item.status !== "closing_soon") return false;
    if (!isLiveVacancyByClosingDate(item.applicationEndDate)) return false;
    return true;
  });

  const order = [
    "indian-navy-agniveer-apprentice-0127-0227-2026",
    "indian-navy-ssc-various-entries-jun-2027",
    "sbi-po-2026",
    "new-india-assurance-apprentice-2026-27",
    "upsc-advt-07-2026",
    "bob-cic-regular-2026",
    "gujarat-hc-legal-assistant-2026",
    "ahc-pla-ghazipur-2026",
    "ahc-pla-sant-kabir-nagar-2026",
    "bob-cic-contractual-2026",
    "bob-it-fte-2026",
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

export function isVerifiedVacanciesEnabled(): boolean {
  return import.meta.env.VITE_SHOW_VERIFIED_VACANCIES === "true";
}
