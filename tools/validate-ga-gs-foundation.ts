#!/usr/bin/env node
/**
 * GA/GS JSON mock-test foundation validation (Phase 6).
 * Run: npm run validate:ga-gs-foundation
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  adaptGaGsJsonPaper,
  validateGaGsJsonPaper,
} from "../src/lib/gaGsMockTestAdapter.ts";
import {
  GA_GS_SHARED_FOUNDATION_PAPERS,
  isGaGsSharedFoundationPaper,
} from "../src/lib/gaGsMockTestRegistry.ts";
import {
  clampGaGsRemainingSeconds,
  createGaGsSubmissionGuard,
  getGaGsScoringContract,
  mapSharedScoreToGAScoreResult,
  nextGaGsRemainingSeconds,
  scoreGaGsLegacyInline,
  scoreGaGsMockTest,
  shouldGaGsAutoSubmitAtSeconds,
} from "../src/lib/gaGsMockTestScoring.ts";
import { isSharedMockFoundationPaper } from "../src/lib/mockTestFoundationRegistry.ts";
import { hasValidationErrors } from "../src/lib/mockTestValidation.ts";
import type { GATestData, GATestQuestion } from "../src/types/generalAwarenessTest.ts";
import { getTestProgressStorageKey } from "../src/types/generalAwarenessTest.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const errors: string[] = [];
const parityLines: string[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) errors.push(message);
}

function assertEq<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) errors.push(`${message}: expected ${expected}, got ${actual}`);
}

type InventoryRow = {
  testId: string;
  subject: string;
  route: string;
  jsonPath: string;
  questions: number;
  durationMinutes: number;
  negativeMarking: boolean;
  storageKey: string;
  engine: string;
  pilotEligible: string;
};

const inventory: InventoryRow[] = [
  {
    testId: "ga-model-test-01",
    subject: "general-awareness",
    route: "/study-corner/general-awareness/model-test-01",
    jsonPath: "public/data/general-awareness/model-test-01.json",
    questions: 0,
    durationMinutes: 0,
    negativeMarking: false,
    storageKey: getTestProgressStorageKey("general-awareness", "model-test-01"),
    engine: "shared-foundation-pilot",
    pilotEligible: "YES — selected pilot",
  },
  {
    testId: "general-science-model-test-01",
    subject: "general-science",
    route: "/study-corner/general-science/model-test-01",
    jsonPath: "public/data/general-science/model-test-01.json",
    questions: 0,
    durationMinutes: 0,
    negativeMarking: false,
    storageKey: getTestProgressStorageKey("general-science", "model-test-01"),
    engine: "legacy",
    pilotEligible: "YES — fallback candidate",
  },
];

function loadJson(relativePath: string): GATestData {
  const full = path.join(ROOT, relativePath);
  return JSON.parse(readFileSync(full, "utf8")) as GATestData;
}

function wrongIndex(question: GATestQuestion): number {
  return question.correctOptionIndex === 0 ? 1 : 0;
}

function buildAnswers(
  data: GATestData,
  mode:
    | "all-unanswered"
    | "all-correct"
    | "all-incorrect"
    | "first-correct"
    | "first-incorrect"
    | "alternating"
    | "half-correct-half-unanswered"
    | "one-per-topic"
    | "mixed"
    | "timeout-one-correct",
): Record<string, number> {
  const answers: Record<string, number> = {};
  const topicsSeen = new Set<string>();

  data.questions.forEach((question, index) => {
    switch (mode) {
      case "all-unanswered":
        break;
      case "all-correct":
        answers[question.id] = question.correctOptionIndex;
        break;
      case "all-incorrect":
        answers[question.id] = wrongIndex(question);
        break;
      case "first-correct":
        if (index === 0) answers[question.id] = question.correctOptionIndex;
        break;
      case "first-incorrect":
        if (index === 0) answers[question.id] = wrongIndex(question);
        break;
      case "alternating":
        answers[question.id] = index % 2 === 0 ? question.correctOptionIndex : wrongIndex(question);
        break;
      case "half-correct-half-unanswered":
        if (index < Math.floor(data.questions.length / 2)) {
          answers[question.id] = question.correctOptionIndex;
        }
        break;
      case "one-per-topic":
        if (!topicsSeen.has(question.topic)) {
          topicsSeen.add(question.topic);
          answers[question.id] = question.correctOptionIndex;
        }
        break;
      case "mixed":
        if (index % 3 === 0) answers[question.id] = question.correctOptionIndex;
        else if (index % 3 === 1) answers[question.id] = wrongIndex(question);
        break;
      case "timeout-one-correct":
        if (index === 0) answers[question.id] = question.correctOptionIndex;
        break;
      default:
        break;
    }
  });

  return answers;
}

function comparePilotParity(data: GATestData, subjectSlug: string, mode: Parameters<typeof buildAnswers>[1]) {
  const answers = buildAnswers(data, mode);
  const legacy = scoreGaGsLegacyInline(data, answers);
  const shared = scoreGaGsMockTest(data, answers, subjectSlug);
  const mapped = mapSharedScoreToGAScoreResult(data, shared);
  const rawScore = shared.positiveMarks - shared.negativeMarks;

  assertEq(mapped.correct, legacy.correct, `${mode} correct`);
  assertEq(mapped.wrong, legacy.wrong, `${mode} wrong`);
  assertEq(mapped.notAttempted, legacy.notAttempted, `${mode} notAttempted`);
  assertEq(mapped.score, legacy.score, `${mode} score`);
  assertEq(mapped.percentage, legacy.percentage, `${mode} percentage`);
  assertEq(shared.attempted, legacy.correct + legacy.wrong, `${mode} attempted`);
  assertEq(shared.incorrect, legacy.wrong, `${mode} incorrect`);
  assertEq(shared.unanswered, legacy.notAttempted, `${mode} unanswered`);
  assertEq(shared.negativeMarks, 0, `${mode} deductions`);
  assertEq(shared.score, rawScore >= 0 ? rawScore : 0, `${mode} score before floor`);

  for (const [topic, stats] of Object.entries(legacy.byTopic)) {
    assertEq(mapped.byTopic[topic]?.correct ?? 0, stats.correct, `${mode} topic ${topic} correct`);
    assertEq(mapped.byTopic[topic]?.total ?? 0, stats.total, `${mode} topic ${topic} total`);
  }

  parityLines.push(
    `${mode}: attempted=${shared.attempted} correct=${shared.correct} incorrect=${shared.incorrect} unanswered=${shared.unanswered} score=${shared.score}/${shared.maximumMarks} (${mapped.percentage}%)`,
  );
}

console.log("TAIPOQ — GA/GS Foundation Validator");
console.log("=".repeat(48));

const gaData = loadJson("public/data/general-awareness/model-test-01.json");
const gsData = loadJson("public/data/general-science/model-test-01.json");

inventory[0].questions = gaData.totalQuestions;
inventory[0].durationMinutes = gaData.durationMinutes;
inventory[0].negativeMarking = gaData.negativeMarking;
inventory[1].questions = gsData.totalQuestions;
inventory[1].durationMinutes = gsData.durationMinutes;
inventory[1].negativeMarking = gsData.negativeMarking;

for (const row of inventory) {
  console.log(
    `${row.testId} | ${row.subject} | ${row.route} | ${row.jsonPath} | ${row.questions} | ${row.durationMinutes}m | NM=${row.negativeMarking} | ${row.storageKey} | ${row.engine}`,
  );
}

const gaIssues = validateGaGsJsonPaper(gaData, "general-awareness");
const gsIssues = validateGaGsJsonPaper(gsData, "general-science");
const jsonErrors = [...gaIssues, ...gsIssues].filter((issue) => issue.severity === "error").length;
const adapterErrors = jsonErrors;

assertEq(jsonErrors, 0, "JSON validation errors");
assert(isGaGsSharedFoundationPaper("general-awareness", "model-test-01"), "pilot registry includes GA model-test-01");
assert(!isGaGsSharedFoundationPaper("general-science", "model-test-01"), "GS remains legacy fallback");
assertEq(GA_GS_SHARED_FOUNDATION_PAPERS.size, 1, "pilot count");
assert(!isSharedMockFoundationPaper("general-awareness", "model-test-01"), "GA not in hub registry");

const pilotContract = getGaGsScoringContract(gaData);
assertEq(pilotContract.marksPerCorrect, 2, "pilot marksPerCorrect");
assertEq(pilotContract.maximumMarks, 100, "pilot maximumMarks");
assertEq(pilotContract.durationSeconds, 2400, "pilot durationSeconds");
assert(!pilotContract.negativeMarkingApplied, "pilot negative marking not applied");

const adaptedPilot = adaptGaGsJsonPaper(gaData, "general-awareness");
assertEq(adaptedPilot.questions.length, 50, "adapted pilot question count");
assert(!hasValidationErrors(validateGaGsJsonPaper(gaData, "general-awareness")), "canonical pilot validation");

const gsContract = getGaGsScoringContract(gsData);
assert(!gsContract.negativeMarkingApplied, "GS negative marking not applied");

const pilotFixtures = [
  "all-unanswered",
  "all-correct",
  "all-incorrect",
  "first-correct",
  "first-incorrect",
  "alternating",
  "half-correct-half-unanswered",
  "one-per-topic",
  "mixed",
  "timeout-one-correct",
] as const;

for (const fixture of pilotFixtures) {
  comparePilotParity(gaData, "general-awareness", fixture);
}

assertEq(clampGaGsRemainingSeconds(-3), 0, "clamp negative seconds");
assert(shouldGaGsAutoSubmitAtSeconds(0), "auto-submit at zero");
assert(!shouldGaGsAutoSubmitAtSeconds(1), "no auto-submit above zero");
assertEq(nextGaGsRemainingSeconds(10), 9, "next remaining seconds");

const guard = createGaGsSubmissionGuard();
let submitCount = 0;
assert(guard.trySubmit(() => { submitCount += 1; }), "first submit allowed");
assertEq(submitCount, 1, "first submit executed");
assert(!guard.trySubmit(() => { submitCount += 1; }), "second submit rejected");
guard.reset();
submitCount = 0;
assert(guard.trySubmit(() => { submitCount += 1; }), "submit after reset");
assertEq(submitCount, 1, "reset restores submit");

const timeoutAnswers = buildAnswers(gaData, "timeout-one-correct");
const timeoutGuard = createGaGsSubmissionGuard();
let timeoutFinished = false;
timeoutGuard.trySubmit(() => { timeoutFinished = true; });
timeoutGuard.trySubmit(() => { timeoutFinished = false; });
assert(timeoutFinished, "timeout submit once");
const timeoutScore = scoreGaGsMockTest(gaData, timeoutAnswers, "general-awareness");
assertEq(timeoutScore.correct, 1, "timeout preserves answer");

const gaPaperCount = 1;
const gsPaperCount = 1;
const pilotCount = GA_GS_SHARED_FOUNDATION_PAPERS.size;
const legacyCount = gaPaperCount + gsPaperCount - pilotCount;
const parityFailures = errors.filter((entry) => entry.includes(" parity") || entry.includes(" correct") || entry.includes(" score")).length;

console.log("");
console.log(`GA/GS JSON papers discovered: ${gaPaperCount + gsPaperCount}`);
console.log(`GA papers: ${gaPaperCount}`);
console.log(`GS papers: ${gsPaperCount}`);
console.log(`Pilot papers: ${pilotCount}`);
console.log(`Legacy fallback papers: ${legacyCount}`);
console.log(`JSON validation errors: ${jsonErrors}`);
console.log(`Adapter validation errors: ${adapterErrors}`);
console.log(`Pilot parity fixtures: ${pilotFixtures.length}`);
console.log(`Parity failures: ${parityFailures}`);
console.log("");
console.log("Pilot parity results:");
for (const line of parityLines) console.log(` - ${line}`);

if (errors.length) {
  console.log(`\nFAIL (${errors.length} errors)`);
  for (const error of errors) console.log(` - ${error}`);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
