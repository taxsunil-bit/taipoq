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

export function getVerifiedPublicVacancies(items: VacancyItem[]): VacancyItem[] {
  const verified = items.filter((item) => {
    if (!item.active) return false;
    if (item.status === "verification_pending") return false;
    if (item.status === "archive" || item.status === "closed") return false;
    if (item.isPreparationOnly) return false;
    if (item.sourceType === "cross_check_only") return false;
    return item.status === "active" || item.status === "closing_soon";
  });

  const order = [
    "indian-navy-agniveer-apprentice-0127-0227-2026",
    "indian-navy-ssc-various-entries-jun-2027",
    "sbi-po-2026",
    "new-india-assurance-apprentice-2026-27",
    "upsc-advt-07-2026",
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
