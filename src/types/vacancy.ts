export type VacancyStatus =
  | "active"
  | "closing_soon"
  | "closed"
  | "correction_window"
  | "exam_process"
  | "departmental"
  | "archive"
  | "preparation_only"
  | "verification_pending";

export type VacancySourceType =
  | "official"
  | "official_pdf"
  | "employment_news"
  | "cross_check_only"
  | "internal_preparation";

export type VacancyItem = {
  id: string;
  title: string;
  organisation: string;
  category: string;
  status: VacancyStatus;
  statusLabel: string;
  isAllIndia: boolean;
  isDepartmental: boolean;
  isPreparationOnly: boolean;
  applicationStartDate?: string;
  applicationEndDate?: string;
  correctionStartDate?: string;
  correctionEndDate?: string;
  vacanciesText: string;
  qualificationShort: string;
  ageLimitShort: string;
  feeShort: string;
  selectionProcessShort: string;
  notificationWindowText: string;
  examWindowText: string;
  officialNoticeUrl?: string;
  applyUrl?: string;
  sourceType: VacancySourceType;
  sourceUrl: string;
  sourceLabel: string;
  sourceCheckedDate: string;
  trustNote: string;
  preparationLinks: string[];
  active: boolean;
};

export type VacanciesPayload = {
  lastUpdated: string;
  source: string;
  items: VacancyItem[];
};

export const VACANCY_STATUSES: VacancyStatus[] = [
  "active",
  "closing_soon",
  "closed",
  "correction_window",
  "exam_process",
  "departmental",
  "archive",
  "preparation_only",
  "verification_pending",
];

export const VACANCY_SOURCE_TYPES: VacancySourceType[] = [
  "official",
  "official_pdf",
  "employment_news",
  "cross_check_only",
  "internal_preparation",
];
