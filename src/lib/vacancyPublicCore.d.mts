import type { VacanciesPayload, VacancyItem } from "@/types/vacancy";

export type PublicVacancySector =
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

export type VacancyClock = { now: () => Date };

export declare const LIVE_LIST_REFERENCE_DATE: string;
export declare const VACANCY_DATE_ONLY_CLOSING_TIME: string;

export declare function parseIsoDate(value: string | undefined): string | null;
export declare function getVacancyClockNow(clock?: VacancyClock): Date;
export declare function getApplicationDeadlineMs(
  applicationEndDate: string | undefined,
  applicationEndTime: string | undefined,
): number | null;

export type VacancyApplicationState = "UPCOMING" | "OPEN" | "CLOSED" | "UNKNOWN";

export declare function computeVacancyApplicationState(
  item: VacancyItem,
  at: Date,
): VacancyApplicationState;
export declare function formatVacancyApplicationStateLabel(state: VacancyApplicationState): string;
export declare function resolveVacancyPublicStatusLabel(item: VacancyItem, at: Date): string;
export declare function isVacancyApplicationWindowOpen(item: VacancyItem, at: Date): boolean;
export declare function isLiveVacancyByClosingDate(
  applicationEndDate: string | undefined,
  referenceDate?: string,
): boolean;
export declare function isHttpsUrl(url: string | undefined): boolean;
export declare function isJudicialLocalVacancyCategory(category: string | undefined): boolean;
export declare function isJudicialVacancyCategory(category: string | undefined): boolean;
export declare function isApprenticeshipVacancy(item: VacancyItem): boolean;
export declare function isLawLegalVacancy(item: VacancyItem): boolean;
export declare function isSpecialistExperiencedVacancy(item: VacancyItem): boolean;
export declare function isContractLocalVacancy(item: VacancyItem): boolean;
export declare function getVerifiedVacancySector(
  item: VacancyItem,
): Exclude<PublicVacancySector, "all"> | null;
export declare function getVerifiedPublicVacancies(
  items: VacancyItem[],
  clock?: VacancyClock,
): VacancyItem[];
export declare function filterVerifiedPublicVacanciesBySector(
  items: VacancyItem[],
  sector: PublicVacancySector,
  clock?: VacancyClock,
): VacancyItem[];
export declare function isVacancyPubliclyVerified(item: VacancyItem, clock?: VacancyClock): boolean;
export declare function computePublicVacancySummary(
  items: VacancyItem[],
  clock?: VacancyClock,
): {
  openListings: number;
  fullyVerified: number;
  reviewPending: number;
  displayed: VacancyItem[];
};
export declare function resolveVacancyDataUpdatedIso(payload: VacanciesPayload): string | null;
