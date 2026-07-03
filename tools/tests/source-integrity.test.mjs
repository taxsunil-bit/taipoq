// Part F — source registry integrity tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { auditSourceRegistry, normalizeUrl } from "../../tools/vacancy-update-lib.mjs";

function vac(id, sourceIds = []) {
  return { id, slug: id, title: id, sourceIds, sourceUrl: "https://x.gov.in" };
}
function src(id, url, vacancyId, sourceType = "official-notification") {
  return { id, url, vacancyId, sourceType };
}

test("13: referenced source IDs resolve; missing ones are reported", () => {
  const okAudit = auditSourceRegistry([vac("v1", ["s1"])], [src("s1", "https://a.gov.in/n", "v1")]);
  assert.equal(okAudit.unresolvedSourceIds.length, 0);

  const badAudit = auditSourceRegistry([vac("v1", ["s-missing"])], [src("s1", "https://a.gov.in/n", "v1")]);
  assert.equal(badAudit.unresolvedSourceIds.length, 1);
  assert.equal(badAudit.unresolvedSourceIds[0].sourceId, "s-missing");
});

test("14: duplicate normalized URLs are detected (trailing slash + fragment)", () => {
  const audit = auditSourceRegistry(
    [vac("v1", ["s1", "s2"])],
    [src("s1", "https://a.gov.in/notice", "v1"), src("s2", "https://a.gov.in/notice/#top", "v1")],
  );
  assert.equal(audit.duplicateNormalizedUrls.length, 1);
  assert.equal(normalizeUrl("https://a.gov.in/notice"), normalizeUrl("https://a.gov.in/notice/#top"));
});

test("15: orphan sources (unresolved vacancy) are reported", () => {
  const audit = auditSourceRegistry([vac("v1", ["s1"])], [src("s1", "https://a.gov.in/n", "v-does-not-exist")]);
  assert.equal(audit.orphanSources.length, 1);
});

test("16: vacancies without any source mapping are reported", () => {
  const audit = auditSourceRegistry([vac("v1", []), vac("v2", ["s1"])], [src("s1", "https://a.gov.in/n", "v2")]);
  assert.ok(audit.vacanciesWithoutSource.includes("v1"));
  assert.ok(!audit.vacanciesWithoutSource.includes("v2"));
});

test("duplicate source IDs are detected", () => {
  const audit = auditSourceRegistry(
    [vac("v1", ["s1"])],
    [src("s1", "https://a.gov.in/n", "v1"), src("s1", "https://b.gov.in/n", "v1")],
  );
  assert.ok(audit.duplicateSourceIds.includes("s1"));
});
