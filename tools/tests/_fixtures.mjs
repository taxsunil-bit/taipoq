// Shared synthetic fixtures for vacancy safety tests.
// These are NOT real vacancy records — they exist only in memory for tests and
// are never written into project data.

export function baseItem(overrides = {}) {
  return {
    id: "fixture-1",
    title: "Fixture Post 2026",
    organisation: "Fixture Board",
    status: "active",
    active: true,
    applicationStartDate: "2026-06-01",
    applicationEndDate: "2026-12-31",
    sourceUrl: "https://example.gov.in/notice",
    preparationLinks: [],
    ...overrides,
  };
}

export const VERIFIED_PUBLISHED = baseItem({
  id: "verified-1",
  slug: "verified-1",
  lifecycleStatus: "published",
  verificationStatus: "verified",
  lastVerifiedAt: "2026-06-15",
  officialNotificationUrl: "https://example.gov.in/notification.pdf",
  officialApplicationUrl: "https://example.gov.in/apply",
  applyUrl: "https://example.gov.in/apply",
  sourceIds: ["src-verified-1"],
});

export const LEGACY_PUBLIC = baseItem({
  id: "legacy-1",
  // no lifecycleStatus / verificationStatus — a preserved legacy public record
});

export const REVIEW_PENDING = baseItem({
  id: "review-1",
  status: "verification_pending",
});

// Opted into the new "published" model but INCOMPLETE (missing sourceIds +
// lastVerifiedAt) — must NOT become publicly verified.
export const REVIEW_PUBLISHED_INCOMPLETE = baseItem({
  id: "review-2",
  lifecycleStatus: "published",
  verificationStatus: "verified",
  officialNotificationUrl: "https://example.gov.in/notification.pdf",
  officialApplicationUrl: "https://example.gov.in/apply",
  // no lastVerifiedAt, no sourceIds
});

export const EXCLUDED_DRAFT = baseItem({
  id: "excluded-1",
  lifecycleStatus: "draft",
});

export const EXCLUDED_ARCHIVE = baseItem({
  id: "excluded-2",
  status: "archive",
});

export function payload(items, source = "fixture") {
  return { lastUpdated: "2026-07-01", source, items };
}
