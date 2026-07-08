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

const T02_SPECS = [
  [100, 23, 77],
  [100, 37, 63],
  [100, 46, 54],
  [100, 64, 36],
  [100, 75, 25],
  [100, 90, 10],
  [1000, 128, 872],
  [1000, 246, 754],
  [1000, 357, 643],
  [1000, 430, 570],
  [1000, 608, 392],
  [1000, 999, 1],
];

const T03_SPECS = [
  [99, 98, 9702],
  [98, 97, 9506],
  [97, 96, 9312],
  [96, 94, 9024],
  [95, 93, 8835],
  [94, 92, 8648],
  [93, 91, 8463],
  [92, 90, 8280],
  [99, 90, 8910],
  [95, 95, 9025],
  [91, 91, 8281],
  [90, 90, 8100],
];

function t01Rapid(n) {
  assert.equal(n % 10, 5);
  const a = Math.floor(n / 10);
  return 100 * a * (a + 1) + 25;
}

function t02Complement(base, n) {
  if (![100, 1000].includes(base) || !Number.isInteger(n) || n < 1 || n >= base) {
    throw new Error("invalid T02");
  }
  return base - n;
}

function t03NearBase(n, m) {
  if (!Number.isInteger(n) || !Number.isInteger(m) || n < 90 || n > 99 || m < 90 || m > 99) {
    throw new Error("invalid T03");
  }
  const deficit1 = 100 - n;
  const deficit2 = 100 - m;
  const leftRaw = n - deficit2;
  const rightRaw = deficit1 * deficit2;
  const carry = Math.floor(rightRaw / 100);
  const right = rightRaw % 100;
  const leftFinal = leftRaw + carry;
  const rightBlock = String(right).padStart(2, "0");
  return {
    deficit1,
    deficit2,
    leftRaw,
    rightRaw,
    carry,
    leftFinal,
    rightBlock,
    product: leftFinal * 100 + right,
  };
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
    moduleContentVersion: "1.1.0-canary-t01-t02-t03",
    techniques: {},
    recentAttempts: [],
    activeDirectSessions: {},
  };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || parsed.moduleId !== "math-speed-lab") return empty;
    const sessions = { ...(parsed.activeDirectSessions ?? {}) };
    if (
      parsed.activeDirectSession?.techniqueId &&
      !sessions[parsed.activeDirectSession.techniqueId]
    ) {
      sessions[parsed.activeDirectSession.techniqueId] = parsed.activeDirectSession;
    }
    return {
      version: 1,
      moduleId: "math-speed-lab",
      moduleContentVersion: parsed.moduleContentVersion ?? empty.moduleContentVersion,
      techniques: parsed.techniques ?? {},
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : [],
      activeDirectSessions: sessions,
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
  assert.match(storageSrc, /activeDirectSessions/);
  assert.match(storageSrc, /saveActiveDirectSession/);
  assert.match(storageSrc, /resetDirectPracticeScores/);
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
    path.join(ROOT, "src", "components", "math-speed-lab", "MslDirectPracticeRunner.tsx"),
    "utf8",
  );
  assert.match(runner, /getActiveDirectSession/);
  assert.match(runner, /saveActiveDirectSession/);
  assert.match(runner, /Reveal is never scored as first-pass correct/);
});

// --- T02 ---

test("T02 complements: all twelve answers and identity", () => {
  for (const [base, n, ans] of T02_SPECS) {
    assert.equal(t02Complement(base, n), ans);
    assert.equal(n + ans, base);
  }
});

test("T02 zero-ending operands validate algebraically", () => {
  assert.equal(t02Complement(100, 90), 10);
  assert.equal(90 + 10, 100);
  assert.equal(t02Complement(1000, 430), 570);
  assert.equal(430 + 570, 1000);
  assert.equal(t02Complement(1000, 500), 500);
  assert.equal(t02Complement(100, 10), 90);
  assert.equal(t02Complement(1000, 900), 100);
});

test("T02 rapid steps avoid misleading digit-10 on zero-containing operands", () => {
  const t02Src = readFileSync(
    path.join(ROOT, "src", "lib", "math-speed-lab", "formulas", "t02.ts"),
    "utf8",
  );
  assert.match(t02Src, /hasZeroDigit/);
  assert.match(t02Src, /algebraic source of truth/);
  assert.doesNotMatch(t02Src, /Final digit 0: subtract from 10 → 10/);
  const qSrc = readFileSync(
    path.join(ROOT, "src", "content", "math-speed-lab", "questions", "t02-direct.ts"),
    "utf8",
  );
  assert.match(qSrc, /operand: 90/);
  assert.match(qSrc, /operand: 430/);
  assert.match(qSrc, /algebraic verification/);
});

test("T02 boundary operands 1 and base-1 accepted; base and 0 rejected", () => {
  assert.equal(t02Complement(100, 1), 99);
  assert.equal(t02Complement(100, 99), 1);
  assert.equal(t02Complement(1000, 1), 999);
  assert.equal(t02Complement(1000, 999), 1);
  assert.throws(() => t02Complement(100, 0));
  assert.throws(() => t02Complement(100, 100));
  assert.throws(() => t02Complement(1000, 1000));
});

test("T02 rejects invalid base/operand", () => {
  for (const [base, n] of [
    [100, 125],
    [50, 37],
    [1000, 0],
    [10000, 12],
    [100, 100],
    [100, 1.5],
  ]) {
    assert.throws(() => t02Complement(base, n));
  }
});

test("T02 twelve unique DIR IDs and no duplicate pairs", () => {
  const src = readFileSync(
    path.join(ROOT, "src", "content", "math-speed-lab", "questions", "t02-direct.ts"),
    "utf8",
  );
  for (let i = 1; i <= 12; i++) {
    assert.match(src, new RegExp(`MSL-T02-DIR-${String(i).padStart(3, "0")}`));
  }
  const pairs = new Set();
  for (const [base, n] of T02_SPECS) {
    const key = `${base}:${n}`;
    assert.equal(pairs.has(key), false);
    pairs.add(key);
    assert.match(src, new RegExp(`operand: ${n}`));
    assert.match(src, new RegExp(`base: ${base}`));
  }
});

test("T02 scoring: 11/12 masters; 10/12 stays proficient", () => {
  const ids = Array.from({ length: 12 }, (_, i) => `MSL-T02-DIR-${String(i + 1).padStart(3, "0")}`);
  const eleven = Object.fromEntries(ids.map((id, i) => [id, i !== 11]));
  const scored = scoreDirectSet(ids, eleven);
  assert.equal(scored.firstPassCorrect, 11);
  assert.equal(scored.accuracyPercent, 92);
  assert.equal(deriveState({ previouslyMastered: false, accuracyPercent: 92 }), "mastered");
  const ten = Object.fromEntries(ids.map((id, i) => [id, i < 10]));
  assert.equal(scoreDirectSet(ids, ten).accuracyPercent, 83);
  assert.equal(deriveState({ previouslyMastered: false, accuracyPercent: 83 }), "proficient");
});

// --- T03 ---

test("T03 products: all twelve and carry/pad cases", () => {
  for (const [n, m, ans] of T03_SPECS) {
    const b = t03NearBase(n, m);
    assert.equal(b.product, ans);
    assert.equal(b.product, n * m);
    assert.equal(b.rightBlock.length, 2);
  }
  const pad = t03NearBase(98, 97);
  assert.equal(pad.rightBlock, "06");
  assert.equal(pad.carry, 0);
  const carry = t03NearBase(90, 90);
  assert.equal(carry.rightRaw, 100);
  assert.equal(carry.carry, 1);
  assert.equal(carry.rightBlock, "00");
  assert.equal(carry.product, 8100);
  assert.equal(t03NearBase(99, 99).product, 9801);
});

test("T03 rejects unsupported operands", () => {
  for (const [n, m] of [
    [89, 99],
    [100, 99],
    [103, 97],
    [90, 100],
    [90.5, 91],
    [-91, 92],
  ]) {
    assert.throws(() => t03NearBase(n, m));
  }
});

test("T03 twelve unique DIR IDs and unique ordered pairs", () => {
  const src = readFileSync(
    path.join(ROOT, "src", "content", "math-speed-lab", "questions", "t03-direct.ts"),
    "utf8",
  );
  for (let i = 1; i <= 12; i++) {
    assert.match(src, new RegExp(`MSL-T03-DIR-${String(i).padStart(3, "0")}`));
  }
  const pairs = new Set();
  for (const [n, m] of T03_SPECS) {
    const key = `${n}x${m}`;
    assert.equal(pairs.has(key), false);
    pairs.add(key);
  }
});

test("T03 scoring boundaries", () => {
  const ids = Array.from({ length: 12 }, (_, i) => `MSL-T03-DIR-${String(i + 1).padStart(3, "0")}`);
  assert.equal(
    deriveState({
      previouslyMastered: false,
      accuracyPercent: scoreDirectSet(ids, Object.fromEntries(ids.map((id) => [id, true])))
        .accuracyPercent,
    }),
    "mastered",
  );
  const eleven = Object.fromEntries(ids.map((id, i) => [id, i !== 11]));
  assert.equal(scoreDirectSet(ids, eleven).accuracyPercent, 92);
  const ten = Object.fromEntries(ids.map((id, i) => [id, i < 10]));
  assert.equal(scoreDirectSet(ids, ten).accuracyPercent, 83);
  assert.equal(
    deriveState({ previouslyMastered: true, accuracyPercent: Math.round((8 / 12) * 100) }),
    "review_required",
  );
  assert.equal(
    deriveState({ previouslyMastered: true, accuracyPercent: Math.round((9 / 12) * 100) }),
    "proficient",
  );
});

test("T03 right blocks and product are not unsafe string-concat bugs", () => {
  for (const [n, m, rb, product] of [
    [98, 97, "06", 9506],
    [99, 98, "02", 9702],
    [99, 99, "01", 9801],
    [95, 93, "35", 8835],
    [90, 90, "00", 8100],
  ]) {
    const b = t03NearBase(n, m);
    assert.equal(b.rightBlock, rb);
    assert.equal(b.product, product);
    assert.equal(b.product, n * m);
    const concatTrap = Number(String(b.leftFinal) + b.rightBlock);
    assert.equal(concatTrap, b.product);
  }
});

test("three simultaneous technique sessions parse independently", () => {
  const store = parseMslStoreJson(
    JSON.stringify({
      version: 1,
      moduleId: "math-speed-lab",
      techniques: {
        "MSL-T01-SQUARE-ENDING-5": { techniqueId: "MSL-T01-SQUARE-ENDING-5", state: "mastered" },
        "MSL-T02-COMPLEMENTS-10N": { techniqueId: "MSL-T02-COMPLEMENTS-10N", state: "practising" },
        "MSL-T03-NEARBASE-100": { techniqueId: "MSL-T03-NEARBASE-100", state: "learning" },
      },
      recentAttempts: [],
      activeDirectSessions: {
        "MSL-T01-SQUARE-ENDING-5": {
          techniqueId: "MSL-T01-SQUARE-ENDING-5",
          questionIndex: 1,
          firstPassResults: { "MSL-T01-DIR-001": true },
          updatedAt: "2026-07-08T00:00:00.000Z",
        },
        "MSL-T02-COMPLEMENTS-10N": {
          techniqueId: "MSL-T02-COMPLEMENTS-10N",
          questionIndex: 4,
          firstPassResults: { "MSL-T02-DIR-001": true, "MSL-T02-DIR-002": false },
          updatedAt: "2026-07-08T00:00:01.000Z",
        },
        "MSL-T03-NEARBASE-100": {
          techniqueId: "MSL-T03-NEARBASE-100",
          questionIndex: 0,
          firstPassResults: {},
          updatedAt: "2026-07-08T00:00:02.000Z",
        },
      },
    }),
  );
  assert.equal(store.techniques["MSL-T01-SQUARE-ENDING-5"].state, "mastered");
  assert.equal(store.activeDirectSessions["MSL-T02-COMPLEMENTS-10N"].questionIndex, 4);
  assert.equal(store.activeDirectSessions["MSL-T03-NEARBASE-100"].questionIndex, 0);
  assert.equal(
    store.activeDirectSessions["MSL-T02-COMPLEMENTS-10N"].firstPassResults["MSL-T02-DIR-002"],
    false,
  );
});

test("corrupt session entry does not wipe unrelated technique progress", () => {
  const store = parseMslStoreJson(
    JSON.stringify({
      version: 1,
      moduleId: "math-speed-lab",
      techniques: {
        "MSL-T01-SQUARE-ENDING-5": { techniqueId: "MSL-T01-SQUARE-ENDING-5", state: "mastered" },
        "MSL-T02-COMPLEMENTS-10N": { techniqueId: "MSL-T02-COMPLEMENTS-10N", state: "proficient" },
      },
      recentAttempts: [],
      activeDirectSessions: {
        "MSL-T03-NEARBASE-100": "not-an-object",
      },
    }),
  );
  assert.equal(store.techniques["MSL-T01-SQUARE-ENDING-5"].state, "mastered");
  assert.equal(store.techniques["MSL-T02-COMPLEMENTS-10N"].state, "proficient");
});

// --- Shared engine / isolation ---

test("T02 and T03 routes exist", () => {
  for (const rel of [
    "src/routes/math-speed-lab.complements-10n.tsx",
    "src/routes/math-speed-lab.complements-10n.index.tsx",
    "src/routes/math-speed-lab.complements-10n.practice.tsx",
    "src/routes/math-speed-lab.complements-10n.practice.direct.tsx",
    "src/routes/math-speed-lab.nearbase-100.tsx",
    "src/routes/math-speed-lab.nearbase-100.index.tsx",
    "src/routes/math-speed-lab.nearbase-100.practice.tsx",
    "src/routes/math-speed-lab.nearbase-100.practice.direct.tsx",
  ]) {
    assert.equal(existsSync(path.join(ROOT, rel)), true, rel);
  }
});

test("landing shows three pilot techniques", () => {
  const landing = readFileSync(
    path.join(ROOT, "src", "routes", "math-speed-lab.index.tsx"),
    "utf8",
  );
  assert.match(landing, /MSL_PILOT_TECHNIQUES/);
  assert.match(landing, /Canary \/ Pilot/);
  assert.doesNotMatch(landing, /T04|T05|T10/);
});

test("shared lesson and practice runners exist", () => {
  assert.equal(
    existsSync(path.join(ROOT, "src/components/math-speed-lab/MslLessonView.tsx")),
    true,
  );
  assert.equal(
    existsSync(path.join(ROOT, "src/components/math-speed-lab/MslDirectPracticeRunner.tsx")),
    true,
  );
  const storage = readFileSync(
    path.join(ROOT, "src/lib/math-speed-lab/progressStorage.ts"),
    "utf8",
  );
  assert.match(storage, /getTechniqueProgress/);
  assert.match(storage, /completeDirectSet/);
  assert.match(storage, /MSL-T02-COMPLEMENTS-10N/);
  assert.match(storage, /MSL-T03-NEARBASE-100/);
});

test("technique-scoped session migration from legacy singular session", () => {
  const store = parseMslStoreJson(
    JSON.stringify({
      version: 1,
      moduleId: "math-speed-lab",
      techniques: {
        "MSL-T01-SQUARE-ENDING-5": { techniqueId: "MSL-T01-SQUARE-ENDING-5", state: "mastered" },
      },
      recentAttempts: [],
      activeDirectSession: {
        techniqueId: "MSL-T01-SQUARE-ENDING-5",
        questionIndex: 2,
        firstPassResults: { "MSL-T01-DIR-001": true },
        updatedAt: "2026-07-08T00:00:00.000Z",
      },
    }),
  );
  assert.equal(store.techniques["MSL-T01-SQUARE-ENDING-5"].state, "mastered");
  assert.equal(store.activeDirectSessions["MSL-T01-SQUARE-ENDING-5"].questionIndex, 2);
});

test("reset isolation is technique-scoped in API", () => {
  const storage = readFileSync(
    path.join(ROOT, "src/lib/math-speed-lab/progressStorage.ts"),
    "utf8",
  );
  assert.match(storage, /delete sessions\[techniqueId\]/);
  assert.match(storage, /Restart one technique/);
});

test("shared runner keeps technique-specific T03 block display only for T03", () => {
  const runner = readFileSync(
    path.join(ROOT, "src", "components", "math-speed-lab", "MslDirectPracticeRunner.tsx"),
    "utf8",
  );
  assert.match(runner, /MSL-T03-NEARBASE-100/);
  assert.match(runner, /sr-only/);
  assert.match(runner, /Right block digits are/);
});

test("T01 wrappers delegate to shared lesson and practice runners", () => {
  const lesson = readFileSync(
    path.join(ROOT, "src", "components", "math-speed-lab", "MslT01LessonView.tsx"),
    "utf8",
  );
  const practice = readFileSync(
    path.join(ROOT, "src", "components", "math-speed-lab", "MslT01DirectPracticeRunner.tsx"),
    "utf8",
  );
  assert.match(lesson, /MslLessonView/);
  assert.match(practice, /MslDirectPracticeRunner/);
});

test("homepage includes Math Speed Lab in primary practice grid only", () => {
  const home = readFileSync(path.join(ROOT, "src/routes/index.tsx"), "utf8");
  assert.equal((home.match(/title: "Math Speed Lab"/g) ?? []).length, 1);
  assert.equal((home.match(/to: "\/math-speed-lab"/g) ?? []).length, 1);
  assert.doesNotMatch(
    readFileSync(path.join(ROOT, "src/components/NavBar.tsx"), "utf8"),
    /math-speed-lab|Math Speed Lab/,
  );
});
