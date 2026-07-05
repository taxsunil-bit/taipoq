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

/**
 * Update Safety System (Phase 1) — additive lifecycle + verification model.
 * These are OPTIONAL on VacancyItem and never replace the legacy `status`
 * field. When absent, the values are derived from the legacy schema via the
 * compatibility mapping layer in `@/lib/vacancies`.
 */
export type VacancyLifecycleStatus =
  | "draft"
  | "review"
  | "published"
  | "expired"
  | "withdrawn";

export type VacancyVerificationStatus =
  | "pending"
  | "verified"
  | "manual_confirmation_required"
  | "rejected";

/**
 * Derived trust/publication classification (Update Safety System hardening).
 * This is derived at runtime — it is never stored in the data files and never
 * silently upgrades a legacy record to "verified".
 */
export type VacancyTrustClass =
  | "VERIFIED_PUBLISHED"
  | "LEGACY_PUBLIC_UNVERIFIED"
  | "REVIEW_REQUIRED"
  | "EXCLUDED_FROM_PUBLIC";

/** Source-registry source types (public/data/vacancy-sources.json). */
export type VacancyRegistrySourceType =
  | "official-notification"
  | "official-corrigendum"
  | "official-application"
  | "official-website"
  | "official-press-release"
  | "secondary-cross-check";

/** Category/reservation breakup for a post group (optional). */
export type VacancyPostGroupCategoryBreakdown = Record<string, number>;

/** Vacancy counts for one post group within a multi-post advertisement. */
export type VacancyPostGroupVacancies = {
  total: number;
  categoryBreakdown?: VacancyPostGroupCategoryBreakdown;
  /** Official note when vacancies are split across locations (e.g. ISTRAC vs MCF). */
  locationNote?: string;
  /** Set only when the official notice genuinely does not specify a count. */
  notSpecifiedInNotice?: boolean;
};

/**
 * Structured post group for multi-post government advertisements (Batch B3).
 * Optional on VacancyItem — legacy and single-post verified records omit this.
 */
export type VacancyPostGroup = {
  id: string;
  title: string;
  postCodes?: string[];
  vacancies: VacancyPostGroupVacancies;
  employmentType?: string;
  qualification: string;
  disciplines?: string[];
  ageMinimum?: number;
  ageMaximum?: number;
  ageCutoffDate?: string;
  /** Used when min/max pair is not published separately per group. */
  ageLimitText?: string;
  /** Official exemption when age criteria do not apply to this group. */
  ageNotApplicable?: boolean;
  fee?: string;
  payLevel?: string;
  salary?: string;
  /** Official exemption when pay/stipend is not published for this group. */
  payNotApplicable?: boolean;
  selectionProcess?: string[];
  applicationMode?: string;
  sourceIds: string[];
  verifiedFacts?: string[];
};

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
  /** Optional closing time for display, e.g. "23:59" or "17:00". */
  applicationEndTime?: string;
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

  /**
   * Update Safety System (Phase 1) — OPTIONAL additive fields.
   * Existing records omit these; behaviour is derived from legacy fields.
   * New records may set them to opt into the strict publication contract.
   */
  slug?: string;
  lifecycleStatus?: VacancyLifecycleStatus;
  verificationStatus?: VacancyVerificationStatus;
  lastVerifiedAt?: string;
  sourceIds?: string[];
  featured?: boolean;
  notes?: string;
  /** Optional richer official metadata (all optional; never destructive). */
  advertisementNumber?: string;
  notificationDate?: string | null;
  totalVacancies?: number | null;
  feePaymentLastDate?: string | null;
  officialNotificationUrl?: string;
  officialApplicationUrl?: string;
  officialWebsiteUrl?: string;
  /** Structured post-wise facts for multi-post advertisements (optional). */
  postGroups?: VacancyPostGroup[];
};

export type VacanciesPayload = {
  lastUpdated: string;
  source: string;
  items: VacancyItem[];
};

/** One official/secondary source record (public/data/vacancy-sources.json). */
export type VacancySourceRecord = {
  id: string;
  vacancyId: string;
  sourceType: VacancyRegistrySourceType;
  organisation: string;
  title: string;
  url: string;
  publicationDate?: string | null;
  checkedAt: string;
  verificationStatus: VacancyVerificationStatus;
  verifiedFacts?: string[];
  corrigendumChecked: boolean;
  notes?: string;
};

/** Lightweight content registry (public/data/content-registry.json). */
export type ContentRegistry = {
  schemaVersion: number;
  contentVersion: string;
  lastUpdated: string;
  vacancies: {
    liveSource: string;
    previewSource: string;
    sourceRegistry: string;
    lastReviewed: string;
  };
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

export const VACANCY_LIFECYCLE_STATUSES: VacancyLifecycleStatus[] = [
  "draft",
  "review",
  "published",
  "expired",
  "withdrawn",
];

export const VACANCY_VERIFICATION_STATUSES: VacancyVerificationStatus[] = [
  "pending",
  "verified",
  "manual_confirmation_required",
  "rejected",
];

export const VACANCY_REGISTRY_SOURCE_TYPES: VacancyRegistrySourceType[] = [
  "official-notification",
  "official-corrigendum",
  "official-application",
  "official-website",
  "official-press-release",
  "secondary-cross-check",
];

/** Registry source types that represent genuine official government sources. */
export const OFFICIAL_REGISTRY_SOURCE_TYPES: VacancyRegistrySourceType[] = [
  "official-notification",
  "official-corrigendum",
  "official-application",
  "official-website",
  "official-press-release",
];
