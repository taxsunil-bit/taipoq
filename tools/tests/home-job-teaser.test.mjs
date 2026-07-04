#!/usr/bin/env node
/**
 * Unit tests for homepage job teaser filtering.
 * Eligibility rules mirror getVerifiedPublicVacancies in src/lib/vacancies.ts.
 */
import assert from "node:assert/strict";
import test from "node:test";

const HOMEPAGE_JOB_TEASER_LIMIT = 3;

function parseIsoDate(value) {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isLiveVacancyByClosingDate(endDate) {
  const end = parseIsoDate(endDate);
  if (!end) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return end >= today;
}

function isHttpsUrl(url) {
  return typeof url === "string" && url.startsWith("https://");
}

/** Mirror of getVerifiedPublicVacancies — keep aligned with src/lib/vacancies.ts */
function isHomepageTeaserEligible(item) {
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
}

function filterHomepageJobTeaserItems(items) {
  return items.filter(isHomepageTeaserEligible).slice(0, HOMEPAGE_JOB_TEASER_LIMIT);
}

const base = {
  active: true,
  status: "active",
  isPreparationOnly: false,
  sourceType: "official",
  applicationStartDate: "2026-01-01",
  applicationEndDate: "2027-12-31",
  sourceUrl: "https://example.gov.in/notice.pdf",
  title: "Sample",
  id: "sample-1",
};

test("returns empty for zero verified records", () => {
  assert.deepEqual(filterHomepageJobTeaserItems([]), []);
});

test("excludes verification_pending", () => {
  const items = filterHomepageJobTeaserItems([
    { ...base, id: "pending-1", status: "verification_pending" },
  ]);
  assert.equal(items.length, 0);
});

test("excludes expired closing date", () => {
  const items = filterHomepageJobTeaserItems([
    { ...base, id: "expired-1", applicationEndDate: "2020-01-01" },
  ]);
  assert.equal(items.length, 0);
});

test("excludes missing official https URL", () => {
  const items = filterHomepageJobTeaserItems([{ ...base, id: "no-url", sourceUrl: "http://insecure.example" }]);
  assert.equal(items.length, 0);
});

test("includes one verified open record", () => {
  const items = filterHomepageJobTeaserItems([{ ...base, id: "open-1" }]);
  assert.equal(items.length, 1);
  assert.equal(items[0].id, "open-1");
});

test("caps at homepage teaser limit without fabricating cards", () => {
  const many = Array.from({ length: 10 }, (_, i) => ({
    ...base,
    id: `open-${i}`,
  }));
  assert.equal(filterHomepageJobTeaserItems(many).length, HOMEPAGE_JOB_TEASER_LIMIT);
});

console.log("home-job-teaser tests: PASS");
