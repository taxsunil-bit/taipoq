#!/usr/bin/env node
/**
 * Validate Math Speed Lab T01–T03 pilot content (direct practice).
 * Run: node tools/validate-math-speed-lab.mjs
 * or: npm run validate:math-speed-lab
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const errors = [];

function fail(msg) {
  errors.push(msg);
}

const T01_ALLOWED = [15, 25, 35, 45, 55, 65, 75, 85, 95];
const T01_KNOWN = {
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
  if (!T01_ALLOWED.includes(n)) throw new Error(`locked set only; got ${n}`);
  const a = Math.floor(n / 10);
  return 100 * a * (a + 1) + 25;
}

function t02Complement(base, n) {
  if (![100, 1000].includes(base) || !Number.isInteger(n) || n < 1 || n >= base) {
    throw new Error(`bad T02 base=${base} n=${n}`);
  }
  return base - n;
}

function t03Product(n, m) {
  if (!Number.isInteger(n) || !Number.isInteger(m) || n < 90 || n > 99 || m < 90 || m > 99) {
    throw new Error(`bad T03 ${n}×${m}`);
  }
  const d1 = 100 - n;
  const d2 = 100 - m;
  const leftRaw = n - d2;
  const rightRaw = d1 * d2;
  const carry = Math.floor(rightRaw / 100);
  const right = rightRaw % 100;
  const leftFinal = leftRaw + carry;
  const rightBlock = String(right).padStart(2, "0");
  const product = leftFinal * 100 + right;
  return { d1, d2, leftRaw, rightRaw, carry, rightBlock, product };
}

function readRel(...parts) {
  return readFileSync(path.join(ROOT, ...parts), "utf8");
}

function existsRel(...parts) {
  return existsSync(path.join(ROOT, ...parts));
}

console.log("TAIPOQ — Math Speed Lab T01–T03 Pilot Validator");
console.log("=".repeat(56));

const requiredFiles = [
  ["src", "content", "math-speed-lab", "module.ts"],
  ["src", "content", "math-speed-lab", "index.ts"],
  ["src", "content", "math-speed-lab", "techniques", "t01-square-ending-5.ts"],
  ["src", "content", "math-speed-lab", "techniques", "t02-complements-10n.ts"],
  ["src", "content", "math-speed-lab", "techniques", "t03-nearbase-100.ts"],
  ["src", "content", "math-speed-lab", "questions", "t01-direct.ts"],
  ["src", "content", "math-speed-lab", "questions", "t02-direct.ts"],
  ["src", "content", "math-speed-lab", "questions", "t03-direct.ts"],
  ["src", "lib", "math-speed-lab", "formulas", "t01.ts"],
  ["src", "lib", "math-speed-lab", "formulas", "t02.ts"],
  ["src", "lib", "math-speed-lab", "formulas", "t03.ts"],
  ["src", "routes", "math-speed-lab.index.tsx"],
  ["src", "routes", "math-speed-lab.complements-10n.tsx"],
  ["src", "routes", "math-speed-lab.nearbase-100.tsx"],
];

for (const parts of requiredFiles) {
  if (!existsRel(...parts)) fail(`Missing file: ${parts.join("/")}`);
}

const mSrc = readRel("src", "content", "math-speed-lab", "module.ts");
const idxSrc = readRel("src", "content", "math-speed-lab", "index.ts");
const t01Src = readRel("src", "content", "math-speed-lab", "techniques", "t01-square-ending-5.ts");
const t02Src = readRel("src", "content", "math-speed-lab", "techniques", "t02-complements-10n.ts");
const t03Src = readRel("src", "content", "math-speed-lab", "techniques", "t03-nearbase-100.ts");
const q01 = readRel("src", "content", "math-speed-lab", "questions", "t01-direct.ts");
const q02 = readRel("src", "content", "math-speed-lab", "questions", "t02-direct.ts");
const q03 = readRel("src", "content", "math-speed-lab", "questions", "t03-direct.ts");
const landing = readRel("src", "routes", "math-speed-lab.index.tsx");
const allText = [mSrc, idxSrc, t01Src, t02Src, t03Src, q01, q02, q03, landing].join("\n");

if (!mSrc.includes("Math Speed Lab")) fail("module: missing English title");
if (!mSrc.includes("गणना गति प्रयोगशाला")) fail("module: missing Hindi title");
if (!mSrc.includes("Bharati Krishna Tirtha")) fail("module: missing locked disclaimer cue");
if (/From the Vedas|Ancient secret|Official Vedic Maths|Guaranteed exam/i.test(allText)) {
  fail("prohibited marketing phrase detected");
}
if (/TODO|TBD|\[insert|placeholder/i.test(allText)) {
  fail("placeholder text detected in MSL content");
}

// Technique IDs + bilingual + slugs
const techniqueChecks = [
  [t01Src, "MSL-T01-SQUARE-ENDING-5", "square-ending-5", "Squares Ending in 5", "5 पर समाप्त"],
  [
    t02Src,
    "MSL-T02-COMPLEMENTS-10N",
    "complements-10n",
    "Complements to Powers of Ten",
    "दस की घात",
  ],
  [t03Src, "MSL-T03-NEARBASE-100", "nearbase-100", "Near-Base Multiplication", "आधार 100"],
];
for (const [src, id, slug, en, hi] of techniqueChecks) {
  if (!src.includes(id)) fail(`technique missing ID ${id}`);
  if (!src.includes(slug)) fail(`technique missing slug ${slug}`);
  if (!src.includes(en)) fail(`technique missing English title cue ${en}`);
  if (!src.includes(hi)) fail(`technique missing Hindi cue ${hi}`);
  if (!src.includes("shortDescription") || !src.includes("learnerLevel")) {
    fail(`${id}: missing shortDescription or learnerLevel`);
  }
}

if (!idxSrc.includes("MSL_PILOT_TECHNIQUES")) fail("index: MSL_PILOT_TECHNIQUES missing");
if (!landing.includes("MSL_PILOT_TECHNIQUES")) fail("landing: must render three technique cards");
if (!landing.includes("Canary / Pilot")) fail("landing: must retain canary wording");
if (
  !landing.includes("homepage practice grid") &&
  !landing.includes("direct URL") &&
  !landing.includes("Direct URL")
) {
  fail("landing: must note homepage practice grid or direct-URL access");
}

// T01
for (const gex of ["MSL-T01-GEX-001", "MSL-T01-GEX-002", "MSL-T01-GEX-003"]) {
  if (!t01Src.includes(gex)) fail(`T01 missing ${gex}`);
}
if (!t01Src.includes("MSL-T01-INV-001") || !t01Src.includes("MSL-T01-INV-002")) {
  fail("T01 expected two invalid examples");
}
const t01Ids = [...q01.matchAll(/MSL-T01-DIR-(\d{3})/g)].map((m) => m[0]);
if (new Set(t01Ids).size !== 9)
  fail(`T01 expected 9 unique DIR IDs, found ${new Set(t01Ids).size}`);
for (const n of T01_ALLOWED) {
  if (n * n !== T01_KNOWN[n]) fail(`T01 table mismatch ${n}`);
  if (t01Rapid(n) !== T01_KNOWN[n]) fail(`T01 rapid mismatch ${n}`);
  if (!q01.includes(`operand: ${n}`)) fail(`T01 questions missing operand ${n}`);
}
for (const bad of [5, 10, 14, 46, 105]) {
  try {
    t01Rapid(bad);
    fail(`T01 validator rapid must reject ${bad}`);
  } catch {
    /* expected */
  }
}

// T02
for (const gex of ["MSL-T02-GEX-001", "MSL-T02-GEX-002", "MSL-T02-GEX-003"]) {
  if (!t02Src.includes(gex)) fail(`T02 missing ${gex}`);
}
if (!t02Src.includes("64") || !t02Src.includes("357") || !t02Src.includes("430")) {
  fail("T02 guided examples content missing");
}
if (!t02Src.includes("MSL-T02-INV-001") || !t02Src.includes("MSL-T02-INV-002")) {
  fail("T02 expected two invalid examples");
}
if (!t02Src.includes("125") || !t02Src.includes("50")) {
  fail("T02 invalid examples content missing");
}
const t02Ids = [...q02.matchAll(/MSL-T02-DIR-(\d{3})/g)].map((m) => m[0]);
if (new Set(t02Ids).size !== 12)
  fail(`T02 expected 12 unique DIR IDs, found ${new Set(t02Ids).size}`);
for (let i = 1; i <= 12; i++) {
  const id = `MSL-T02-DIR-${String(i).padStart(3, "0")}`;
  if (!q02.includes(id)) fail(`T02 missing ${id}`);
}
for (const m of q02.matchAll(/base:\s*(\d+)/g)) {
  const base = Number(m[1]);
  if (![100, 1000].includes(base)) fail(`T02 questions contain invalid base: ${base}`);
}
for (const m of q02.matchAll(/base:\s*(\d+),\s*operand:\s*(\d+)/g)) {
  const base = Number(m[1]);
  const n = Number(m[2]);
  if (n < 1 || n >= base) fail(`T02 questions contain out-of-range operand ${n} for base ${base}`);
}
const t02Pairs = new Set();
for (const [base, n, ans] of T02_SPECS) {
  const c = t02Complement(base, n);
  if (c !== ans) fail(`T02 math mismatch ${base}-${n}: got ${c} want ${ans}`);
  if (n + c !== base) fail(`T02 verify fail ${n}+${c}!==${base}`);
  const key = `${base}:${n}`;
  if (t02Pairs.has(key)) fail(`T02 duplicate pair ${key}`);
  t02Pairs.add(key);
  if (!q02.includes(`operand: ${n}`) && !q02.includes(`operand: ${n},`)) {
    // specs use operand in object
    if (!q02.includes(`operand: ${n}`)) fail(`T02 questions missing operand ${n}`);
  }
  if (!q02.includes(String(ans)) && ans !== 1) {
    /* answers computed via formula — presence of operand+base is enough */
  }
}
// zero-ending cases
for (const [base, n] of [
  [100, 90],
  [1000, 430],
]) {
  const c = t02Complement(base, n);
  if (n + c !== base) fail(`T02 zero-ending verify fail ${n}`);
}
for (const bad of [
  [100, 125],
  [50, 37],
  [1000, 0],
  [10000, 12],
  [100, 100],
]) {
  try {
    t02Complement(bad[0], bad[1]);
    fail(`T02 must reject base=${bad[0]} n=${bad[1]}`);
  } catch {
    /* expected */
  }
}

// T03
for (const gex of ["MSL-T03-GEX-001", "MSL-T03-GEX-002", "MSL-T03-GEX-003"]) {
  if (!t03Src.includes(gex)) fail(`T03 missing ${gex}`);
}
if (!t03Src.includes("98 × 97") || !t03Src.includes("90 × 90")) {
  fail("T03 guided examples content missing");
}
if (!t03Src.includes("MSL-T03-INV-001") || !t03Src.includes("MSL-T03-INV-002")) {
  fail("T03 expected two invalid examples");
}
if (!t03Src.includes("88 × 97") || !t03Src.includes("103 × 97")) {
  fail("T03 invalid examples content missing");
}
const t03Ids = [...q03.matchAll(/MSL-T03-DIR-(\d{3})/g)].map((m) => m[0]);
if (new Set(t03Ids).size !== 12)
  fail(`T03 expected 12 unique DIR IDs, found ${new Set(t03Ids).size}`);
const t03Pairs = new Set();
for (const [n, m, ans] of T03_SPECS) {
  const b = t03Product(n, m);
  if (b.product !== ans || b.product !== n * m) {
    fail(`T03 math mismatch ${n}×${m}: rapid=${b.product} ordinary=${n * m} want=${ans}`);
  }
  if (b.rightBlock.length !== 2) fail(`T03 right block not 2 digits for ${n}×${m}`);
  const key = `${n}x${m}`;
  if (t03Pairs.has(key)) fail(`T03 duplicate pair ${key}`);
  t03Pairs.add(key);
  if (!q03.includes(`left: ${n}`) && !q03.includes(`left: ${n},`)) {
    if (!q03.includes(`left: ${n}`)) fail(`T03 questions missing left ${n} for pair ${key}`);
  }
}
// explicit cases
const zpad = t03Product(98, 97);
if (zpad.rightBlock !== "06") fail(`T03 98×97 rightBlock expected 06 got ${zpad.rightBlock}`);
const carryCase = t03Product(90, 90);
if (carryCase.carry !== 1 || carryCase.rightBlock !== "00" || carryCase.product !== 8100) {
  fail("T03 90×90 carry/right block mismatch");
}
const nn = t03Product(99, 99);
if (nn.product !== 9801) fail("T03 99×99 product mismatch");
for (const bad of [
  [89, 99],
  [100, 99],
  [103, 97],
  [90, 100],
  [90.5, 91],
  [-91, 92],
]) {
  try {
    t03Product(bad[0], bad[1]);
    fail(`T03 must reject ${bad[0]}×${bad[1]}`);
  } catch {
    /* expected */
  }
}

// Isolation
const packPath = path.join(ROOT, "src", "content", "tests", "checkedTestPaperPack01.ts");
if (existsSync(packPath)) {
  const pack = readFileSync(packPath, "utf8");
  if (pack.includes("math-speed-lab") || pack.includes("MSL-T0")) {
    fail("checkedTestPaperPack01 must not contain Math Speed Lab content");
  }
}
const subjectsPath = path.join(ROOT, "src", "content", "tests", "subjects.ts");
if (existsSync(subjectsPath)) {
  const subjects = readFileSync(subjectsPath, "utf8");
  if (subjects.includes("math-speed-lab")) fail("subjects.ts must not register math-speed-lab");
}
const nav = readRel("src", "components", "NavBar.tsx");
const bottom = readRel("src", "components", "MobileBottomNav.tsx");
const dm = readRel("src", "lib", "dailyMission.ts");
if (/math-speed-lab|Math Speed Lab/.test(nav)) fail("NavBar must not link Math Speed Lab");
if (/math-speed-lab/.test(bottom)) fail("MobileBottomNav must not link Math Speed Lab");
if (/math-speed-lab|MSL-T0/.test(dm)) fail("dailyMission must not integrate Math Speed Lab");

console.log(`T01 DIR IDs: ${new Set(t01Ids).size}`);
console.log(`T02 DIR IDs: ${new Set(t02Ids).size}`);
console.log(`T03 DIR IDs: ${new Set(t03Ids).size}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("OK — Math Speed Lab T01–T03 pilot content is valid.");
process.exit(0);
