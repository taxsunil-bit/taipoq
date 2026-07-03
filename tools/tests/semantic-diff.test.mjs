// Part G — semantic data comparison tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { semanticDiff, destructiveRemovals } from "../../tools/vacancy-update-lib.mjs";
import { baseItem, payload } from "./_fixtures.mjs";

test("20: added / removed / modified / unchanged are classified by stable identity", () => {
  const live = payload([
    baseItem({ id: "keep", slug: "keep" }),
    baseItem({ id: "change", slug: "change", title: "Old title" }),
    baseItem({ id: "gone", slug: "gone" }),
  ]);
  const preview = payload([
    baseItem({ id: "keep", slug: "keep" }),
    baseItem({ id: "change", slug: "change", title: "New title" }),
    baseItem({ id: "new", slug: "new" }),
  ]);
  const diff = semanticDiff(live, preview);
  assert.deepEqual(diff.semantic.added.sort(), ["new"]);
  assert.deepEqual(diff.semantic.removed.sort(), ["gone"]);
  assert.deepEqual(diff.semantic.modified.sort(), ["change"]);
  assert.deepEqual(diff.semantic.unchanged.sort(), ["keep"]);
});

test("17: duplicate slug collisions are detected", () => {
  const preview = payload([
    baseItem({ id: "a", slug: "dup" }),
    baseItem({ id: "b", slug: "dup" }),
  ]);
  const diff = semanticDiff(payload([]), preview);
  assert.equal(diff.slugCollisions.length, 1);
});

test("18: notification-number collisions are detected", () => {
  const preview = payload([
    baseItem({ id: "a", slug: "a", advertisementNumber: "ADV/2026/01" }),
    baseItem({ id: "b", slug: "b", advertisementNumber: "adv/2026/01" }),
  ]);
  const diff = semanticDiff(payload([]), preview);
  assert.equal(diff.notificationNumberCollisions.length, 1);
});

test("19: application-URL collisions are detected after normalization", () => {
  const preview = payload([
    baseItem({ id: "a", slug: "a", applyUrl: "https://apply.gov.in/x" }),
    baseItem({ id: "b", slug: "b", applyUrl: "https://apply.gov.in/x/" }),
  ]);
  const diff = semanticDiff(payload([]), preview);
  assert.equal(diff.applicationUrlCollisions.length, 1);
});

test("ambiguous identity is reported with the strategy used", () => {
  const preview = payload([
    { title: "No id no slug", organisation: "Org", status: "active", preparationLinks: [] },
  ]);
  const diff = semanticDiff(payload([]), preview);
  assert.equal(diff.ambiguousIdentities.length, 1);
  assert.match(diff.ambiguousIdentities[0].strategy, /fallback/);
});

test("21: destructive removals (publicly-visible) are detected for --allow-destructive gating", () => {
  const removedPublic = [baseItem({ id: "pub", status: "active", active: true })];
  assert.equal(destructiveRemovals(removedPublic).length, 1);
  const removedDraft = [baseItem({ id: "draft", status: "archive", active: false })];
  assert.equal(destructiveRemovals(removedDraft).length, 0);
});

test("publicly-visible delta is computed", () => {
  const live = payload([baseItem({ id: "a", slug: "a" })]);
  const preview = payload([baseItem({ id: "a", slug: "a" }), baseItem({ id: "b", slug: "b" })]);
  const diff = semanticDiff(live, preview);
  assert.equal(diff.publicVisibleDelta, diff.publicVisibleAfter - diff.publicVisibleBefore);
});
