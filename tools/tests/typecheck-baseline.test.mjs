// Part C — baseline-aware TypeScript gate tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseErrors, compare, isVacancySystemFile } from "../../tools/typecheck-baseline-lib.mjs";

const ROOT = "E:/TAIPOQ";
const SAMPLE = [
  "src/routes/tests.$subject.$paperId.tsx(109,16): error TS18048: 'paper' is possibly 'undefined'.",
  "src/lib/google-analytics.ts(14,68): error TS2339: Property 'length' does not exist on type 'never'.",
].join("\n");

test("parser extracts normalized signatures", () => {
  const errs = parseErrors(SAMPLE, ROOT);
  assert.equal(errs.length, 2);
  assert.equal(errs[0].code, "TS18048");
  assert.equal(errs[0].file, "src/routes/tests.$subject.$paperId.tsx");
});

test("22: baseline passes when the known errors are unchanged", () => {
  const baseline = parseErrors(SAMPLE, ROOT);
  const current = parseErrors(SAMPLE, ROOT);
  const res = compare(baseline, current);
  assert.equal(res.pass, true);
  assert.equal(res.newErrors.length, 0);
});

test("23: baseline fails on a synthetic NEW error", () => {
  const baseline = parseErrors(SAMPLE, ROOT);
  const withNew =
    SAMPLE + "\nsrc/components/Something.tsx(3,3): error TS2551: Property 'foo' does not exist.";
  const res = compare(baseline, parseErrors(withNew, ROOT));
  assert.equal(res.pass, false);
  assert.equal(res.newErrors.length, 1);
  assert.equal(res.newErrors[0].file, "src/components/Something.tsx");
});

test("24: baseline fails on ANY new error in a vacancy-system file", () => {
  const baseline = parseErrors(SAMPLE, ROOT);
  const withVac =
    SAMPLE + "\nsrc/lib/vacancies.ts(10,5): error TS2322: Type 'string' is not assignable to type 'number'.";
  const res = compare(baseline, parseErrors(withVac, ROOT));
  assert.equal(res.pass, false);
  assert.equal(res.vacancyNewErrors.length, 1);
});

test("vacancy-system file matcher", () => {
  assert.ok(isVacancySystemFile("src/lib/vacancies.ts"));
  assert.ok(isVacancySystemFile("src/routes/upcoming-exams.tsx"));
  assert.ok(isVacancySystemFile("src/routes/vacancies-preview.tsx"));
  assert.ok(isVacancySystemFile("tools/publish-vacancy-update.mjs"));
  assert.ok(!isVacancySystemFile("src/lib/google-analytics.ts"));
});

test("resolved baseline errors are reported and do not fail the gate", () => {
  const baseline = parseErrors(SAMPLE, ROOT);
  const fewer = parseErrors(SAMPLE.split("\n")[0], ROOT); // one error resolved
  const res = compare(baseline, fewer);
  assert.equal(res.pass, true);
  assert.equal(res.resolved.length, 1);
});
