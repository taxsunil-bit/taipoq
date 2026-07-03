import type { VacanciesPayload, VacancyItem, VacancyTrustClass } from "@/types/vacancy";

export type VacanciesLoadResult = {
  payload: VacanciesPayload;
  error?: string;
};

export declare const LIVE_DATA_URL: string;
export declare const PREVIEW_DATA_URL: string;
export declare const EMPTY_VACANCIES_PAYLOAD: VacanciesPayload;
export declare const LIVE_LIST_REFERENCE_DATE: string;

export declare function normalizeVacanciesPayload(raw: unknown): VacanciesPayload;
export declare function loadVacanciesFrom(url: string): Promise<VacanciesLoadResult>;
export declare function loadVacanciesLive(): Promise<VacanciesLoadResult>;
export declare function loadVacanciesPreview(): Promise<VacanciesLoadResult>;

export declare function isVacancyPublicLegacy(item: VacancyItem, referenceDate?: string): boolean;
export declare function strictPublicationContractPasses(item: VacancyItem): boolean;
export declare function classifyVacancyTrust(item: VacancyItem): VacancyTrustClass;
export declare function getVacancyTrustLabel(trustClass: VacancyTrustClass): string;
