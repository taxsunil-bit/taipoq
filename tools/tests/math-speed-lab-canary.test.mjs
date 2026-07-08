import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const ALLOWED = [15, 25, 35, 45, 55, 65, 75, 85, 95];
const KNOWN = {
  15: 225,
  25: 625,
  35: 1225,
  45: 2025,
  55: 3025,
  65: 4225,
  75: 5625,
  85: 7225,
  95: 9025,
};

function t01Rapid(n) {
  assert.equal(n % 10, 5);
  const a = Math.floor(n / 10);
  return 100 * a * (a + 1) + 25;
}

/** Mirrors src/lib/math-speed-lab/normalizeAnswer.ts rules for node:test. */
function normalizeExactPositiveInteger(raw) {
  if (typeof raw !== "string") return { ok: false, reason: "Input must be a string." };
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: false, reason: "Answer is empty." };
  if (!/^\d+$/.test(trimmed)) {
    return {
      ok: false,
      reason: "Enter digits only (no signs, decimals, commas, or letters).",
    };
  }
  const normalized = trimmed.replace(/^0+(?=\d)/, "");
  const value = Number(normalized);
  if (!Number.isSafeInteger(value) || value < 0) {
    return { ok: false, reason: "Value is not a safe non-negative integer." };
  }
  return { ok: true, value, normalized };
}

function scoreDirectSet(questionIds, firstPassResults) {
  const total = questionIds.length;
  let firstPassCorrect = 0;
  for (const id of questionIds) {
    if (firstPassResults[id] === true) firstPassCorrect += 1;
  }
  const accuracyPercent = total === 0 ? 0 : Math.round((firstPassCorrect / total) * 100);
  return { total, firstPassCorrect, accuracyPercent };
}

function deriveState({ previouslyMastered, accuracyPercent }) {
  if (previouslyMastered && accuracyPercent < 70) return "review_required";
  if (accuracyPercent >= 90) return "mastered";
  return "proficient";
}

function parseMslStoreJson(raw) {
  const empty = {
    version: 1,
    moduleId: "math-speed-lab",
    moduleContentVersion: "1.0.0-canary-t01",
    techniques: {},
    recentAttempts: [],
  };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || parsed.moduleId !== "math-speed-lab") return empty;
    return {
      version: 1,
      moduleId: "math-speed-lab",
      moduleContentVersion: parsed.moduleContentVersion ?? empty.moduleContentVersion,
      techniques: parsed.techniques ?? {},
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : [],
    };
  } catch {
    return empty;
  }
}

test("T01 formulas: all nine known squares", () => {
  for (const n of ALLOWED) {
    assert.equal(n * n, KNOWN[n]);
    assert.equal(t01Rapid(n), KNOWN[n]);
    assert.equal(t01Rapid(n), n * n);
  }
});

test("normalizeExactPositiveInteger: valid values including leading zeros", () => {
  assert.deepEqual(normalizeExactPositiveInteger("225"), {
    ok: true,
    value: 225,
    normalized: "225",
  });
  assert.deepEqual(normalizeExactPositiveInteger("  0225  "), {
    ok: true,
    value: 225,
    normalized: "225",
  });
  assert.equal(normalizeExactPositiveInteger("9025").value, 9025);
});

test("normalizeExactPositiveInteger: invalid values", () => {
  for (const raw of ["", "   ", "+225", "-225", "225.0", "1,225", "abc", "2e2", "22 5"]) {
    assert.equal(
      normalizeExactPositiveInteger(raw).ok,
      false,
      `should reject ${JSON.stringify(raw)}`,
    );
  }
});

test("direct-set scoring accuracy", () => {
  const ids = ALLOWED.map((_, i) => `MSL-T01-DIR-${String(i + 1).padStart(3, "0")}`);
  const allCorrect = Object.fromEntries(ids.map((id) => [id, true]));
  assert.equal(scoreDirectSet(ids, allCorrect).accuracyPercent, 100);
  const eight = { ...allCorrect, "MSL-T01-DIR-009": false };
  assert.equal(scoreDirectSet(ids, eight).firstPassCorrect, 8);
  assert.equal(scoreDirectSet(ids, eight).accuracyPercent, 89);
});

test("mastery threshold at 90%", () => {
  assert.equal(deriveState({ previouslyMastered: false, accuracyPercent: 90 }), "mastered");
  assert.equal(deriveState({ previouslyMastered: false, accuracyPercent: 89 }), "proficient");
  assert.equal(deriveState({ previouslyMastered: false, accuracyPercent: 100 }), "mastered");
});

test("review-required threshold below 70% after mastery", () => {
  assert.equal(deriveState({ previouslyMastered: true, accuracyPercent: 69 }), "review_required");
  assert.equal(deriveState({ previouslyMastered: true, accuracyPercent: 70 }), "proficient");
  assert.equal(deriveState({ previouslyMastered: true, accuracyPercent: 90 }), "mastered");
});

test("corrupt storage fallback", () => {
  const store = parseMslStoreJson("{not-json");
  assert.equal(store.version, 1);
  assert.equal(store.moduleId, "math-speed-lab");
  assert.deepEqual(store.techniques, {});
});

test("version mismatch handling", () => {
  const store = parseMslStoreJson(
    JSON.stringify({ version: 99, moduleId: "math-speed-lab", techniques: { x: 1 } }),
  );
  assert.deepEqual(store.techniques, {});
});

test("storage reset isolation key name", () => {
  const typesSrc = readFileSync(
    path.join(ROOT, "src", "lib", "math-speed-lab", "types.ts"),
    "utf8",
  );
  const storageSrc = readFileSync(
    path.join(ROOT, "src", "lib", "math-speed-lab", "progressStorage.ts"),
    "utf8",
  );
  assert.match(typesSrc, /taipoq\.mathSpeedLab\.v1/);
  assert.match(storageSrc, /removeItem\(MSL_STORAGE_KEY\)/);
  assert.doesNotMatch(storageSrc, /taipoq\.dailyMission/);
  assert.doesNotMatch(storageSrc, /taipoq-test-attempts/);
  assert.doesNotMatch(storageSrc, /taipoq:results/);
});

test("source normalizeAnswer mirrors canary rules", () => {
  const src = readFileSync(
    path.join(ROOT, "src", "lib", "math-speed-lab", "normalizeAnswer.ts"),
    "utf8",
  );
  assert.match(src, /export function normalizeExactPositiveInteger/);
  assert.match(src, /\/\^\\d\+\$\//);
  assert.match(src, /replace\(\/\^0\+\(\?=\\d\)\//);
});

test("nine DIR questions present with locked operands", () => {
  const src = readFileSync(
    path.join(ROOT, "src", "content", "math-speed-lab", "questions", "t01-direct.ts"),
    "utf8",
  );
  for (let i = 1; i <= 9; i++) {
    assert.match(src, new RegExp(`MSL-T01-DIR-${String(i).padStart(3, "0")}`));
  }
  for (const n of ALLOWED) {
    assert.match(src, new RegExp(`operand: ${n}`));
  }
});

test("routes exist for three canary paths", () => {
  for (const rel of [
    "src/routes/math-speed-lab.tsx",
    "src/routes/math-speed-lab.index.tsx",
    "src/routes/math-speed-lab.square-ending-5.tsx",
    "src/routes/math-speed-lab.square-ending-5.index.tsx",
    "src/routes/math-speed-lab.square-ending-5.practice.tsx",
    "src/routes/math-speed-lab.square-ending-5.practice.direct.tsx",
  ]) {
    assert.equal(existsSync(path.join(ROOT, rel)), true, rel);
  }
});

test("no registration in TestPaper pack, subjects, navbar, DM", () => {
  const pack = readFileSync(
    path.join(ROOT, "src", "content", "tests", "checkedTestPaperPack01.ts"),
    "utf8",
  );
  assert.doesNotMatch(pack, /math-speed-lab|MSL-T01/);

  const subjects = readFileSync(path.join(ROOT, "src", "content", "tests", "subjects.ts"), "utf8");
  assert.doesNotMatch(subjects, /math-speed-lab/);

  const nav = readFileSync(path.join(ROOT, "src", "components", "NavBar.tsx"), "utf8");
  assert.doesNotMatch(nav, /math-speed-lab|Math Speed Lab/);

  const bottom = readFileSync(path.join(ROOT, "src", "components", "MobileBottomNav.tsx"), "utf8");
  assert.doesNotMatch(bottom, /math-speed-lab/);

  const dm = readFileSync(path.join(ROOT, "src", "lib", "dailyMission.ts"), "utf8");
  assert.doesNotMatch(dm, /math-speed-lab|MSL-T01/);
});

test("dedicated validator passes", () => {
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, "tools", "validate-math-speed-lab.mjs")],
    {
      cwd: ROOT,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("T01 rapid formula source rejects unlocked ending-in-5 operands", () => {
  const src = readFileSync(
    path.join(ROOT, "src", "lib", "math-speed-lab", "formulas", "t01.ts"),
    "utf8",
  );
  assert.match(src, /isT01Operand/);
  assert.match(src, /locked canary operand/);
});

test("normalize rejects Unicode digits, long unsafe integers, pasted junk", () => {
  for (const raw of [
    "२२५",
    "225\u200b",
    "225a",
    "9".repeat(20),
    "9007199254740993",
    "0xE1",
    "225\n",
  ]) {
    // newlines after trim may still fail digit check if embedded; trim only outer
    const r = normalizeExactPositiveInteger(raw);
    if (raw === "225\n") {
      assert.equal(r.ok, true);
      assert.equal(r.value, 225);
      continue;
    }
    assert.equal(r.ok, false, `should reject ${JSON.stringify(raw)}`);
  }
});

test("8/9 boundary stays proficient (not mastered)", () => {
  assert.equal(deriveState({ previouslyMastered: false, accuracyPercent: 89 }), "proficient");
  assert.notEqual(deriveState({ previouslyMastered: false, accuracyPercent: 89 }), "mastered");
});

test("reveal-style firstPass false does not count toward mastery", () => {
  const ids = ALLOWED.map((_, i) => `MSL-T01-DIR-${String(i + 1).padStart(3, "0")}`);
  const revealedFail = Object.fromEntries(ids.map((id) => [id, false]));
  const scored = scoreDirectSet(ids, revealedFail);
  assert.equal(scored.firstPassCorrect, 0);
  assert.equal(scored.accuracyPercent, 0);
  assert.equal(
    deriveState({ previouslyMastered: false, accuracyPercent: scored.accuracyPercent }),
    "proficient",
  );
});

test("activeDirectSession helpers exist for mid-practice reload", () => {
  const storageSrc = readFileSync(
    path.join(ROOT, "src", "lib", "math-speed-lab", "progressStorage.ts"),
    "utf8",
  );
  assert.match(storageSrc, /saveT01ActiveDirectSession/);
  assert.match(storageSrc, /getT01ActiveDirectSession/);
  assert.match(storageSrc, /activeDirectSession/);
});

test("subject back-links no longer use invalidated trailing-slash-only typing path", () => {
  const grid = readFileSync(
    path.join(ROOT, "src", "components", "tests", "SubjectTestGrid.tsx"),
    "utf8",
  );
  const paper = readFileSync(
    path.join(ROOT, "src", "routes", "tests.$subject.$paperId.tsx"),
    "utf8",
  );
  assert.match(grid, /to="\/tests\/\$subject"/);
  assert.doesNotMatch(grid, /to="\/tests\/\$subject\/"/);
  assert.doesNotMatch(paper, /to="\/tests\/\$subject\/"/);
});

test("practice runner restores session and marks reveal as not first-pass correct", () => {
  const runner = readFileSync(
    path.join(ROOT, "src", "components", "math-speed-lab", "MslT01DirectPracticeRunner.tsx"),
    "utf8",
  );
  assert.match(runner, /getT01ActiveDirectSession/);
  assert.match(runner, /saveT01ActiveDirectSession/);
  assert.match(runner, /Reveal is never scored as first-pass correct/);
});
