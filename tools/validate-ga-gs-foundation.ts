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
import {
  getTestProgressStorageKey,
  sanitizeGAProgressState,
} from "../src/types/generalAwarenessTest.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const errors: string[] = [];
const gaParityLines: string[] = [];
const gsParityLines: string[] = [];

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
    engine: "shared-foundation",
    pilotEligible: "YES — migrated Phase 7",
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

function comparePilotParity(
  data: GATestData,
  subjectSlug: string,
  mode: Parameters<typeof buildAnswers>[1],
  labelPrefix: "GA" | "GS",
) {
  const answers = buildAnswers(data, mode);
  const legacy = scoreGaGsLegacyInline(data, answers);
  const shared = scoreGaGsMockTest(data, answers, subjectSlug);
  const mapped = mapSharedScoreToGAScoreResult(data, shared);
  const rawScore = shared.positiveMarks - shared.negativeMarks;
  const outputLines = labelPrefix === "GA" ? gaParityLines : gsParityLines;

  assertEq(mapped.correct, legacy.correct, `${labelPrefix} ${mode} correct`);
  assertEq(mapped.wrong, legacy.wrong, `${labelPrefix} ${mode} wrong`);
  assertEq(mapped.notAttempted, legacy.notAttempted, `${labelPrefix} ${mode} notAttempted`);
  assertEq(mapped.score, legacy.score, `${labelPrefix} ${mode} score`);
  assertEq(mapped.percentage, legacy.percentage, `${labelPrefix} ${mode} percentage`);
  assertEq(shared.attempted, legacy.correct + legacy.wrong, `${labelPrefix} ${mode} attempted`);
  assertEq(shared.incorrect, legacy.wrong, `${labelPrefix} ${mode} incorrect`);
  assertEq(shared.unanswered, legacy.notAttempted, `${labelPrefix} ${mode} unanswered`);
  assertEq(shared.negativeMarks, 0, `${labelPrefix} ${mode} deductions`);
  assertEq(shared.score, rawScore >= 0 ? rawScore : 0, `${labelPrefix} ${mode} score before floor`);

  for (const [topic, stats] of Object.entries(legacy.byTopic)) {
    assertEq(mapped.byTopic[topic]?.correct ?? 0, stats.correct, `${labelPrefix} ${mode} topic ${topic} correct`);
    assertEq(mapped.byTopic[topic]?.total ?? 0, stats.total, `${labelPrefix} ${mode} topic ${topic} total`);
  }

  outputLines.push(
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
assert(isGaGsSharedFoundationPaper("general-awareness", "model-test-01"), "registry includes GA model-test-01");
assert(isGaGsSharedFoundationPaper("general-science", "model-test-01"), "registry includes GS model-test-01");
assertEq(GA_GS_SHARED_FOUNDATION_PAPERS.size, 2, "shared foundation paper count");
assert(!isSharedMockFoundationPaper("general-awareness", "model-test-01"), "GA not in hub registry");
assert(!isSharedMockFoundationPaper("general-science", "model-test-01"), "GS not in hub registry");

assertEq(gaData.id, "ga-model-test-01", "GA paper ID");
assertEq(gsData.id, "general-science-model-test-01", "GS paper ID");
assertEq(gsData.totalQuestions, 25, "GS question count");
assertEq(gsData.totalMarks, 25, "GS total marks");
assertEq(gsData.marksPerQuestion, 1, "GS marks per question");
assertEq(gsData.durationMinutes, 20, "GS duration");
assertEq(gsData.negativeMarking, false, "GS negative marking flag");

const gsTopics = new Set(gsData.questions.map((question) => question.topic));
assertEq(gsTopics.size, 5, "GS topic count");

const gaContract = getGaGsScoringContract(gaData);
assertEq(gaContract.marksPerCorrect, 2, "GA marksPerCorrect");
assertEq(gaContract.maximumMarks, 100, "GA maximumMarks");
assertEq(gaContract.durationSeconds, 2400, "GA durationSeconds");
assert(!gaContract.negativeMarkingApplied, "GA negative marking not applied");

const adaptedGa = adaptGaGsJsonPaper(gaData, "general-awareness");
assertEq(adaptedGa.questions.length, 50, "adapted GA question count");
assert(!hasValidationErrors(validateGaGsJsonPaper(gaData, "general-awareness")), "canonical GA validation");

const gsContract = getGaGsScoringContract(gsData);
assertEq(gsContract.marksPerCorrect, 1, "GS marksPerCorrect");
assertEq(gsContract.maximumMarks, 25, "GS maximumMarks");
assertEq(gsContract.durationSeconds, 1200, "GS durationSeconds");
assert(!gsContract.negativeMarkingApplied, "GS negative marking not applied");

const adaptedGs = adaptGaGsJsonPaper(gsData, "general-science");
assertEq(adaptedGs.questions.length, 25, "adapted GS question count");
assert(!hasValidationErrors(validateGaGsJsonPaper(gsData, "general-science")), "canonical GS validation");

const legacyGsProgress = sanitizeGAProgressState({
  startedAt: "2026-01-01T00:00:00.000Z",
  currentQuestionIndex: 2,
  answers: { "gs-q-01": 1 },
  remainingSeconds: 900,
  submitted: false,
});
assert(legacyGsProgress !== null, "legacy GS progress record remains readable");
assertEq(legacyGsProgress?.answers["gs-q-01"], 1, "legacy GS answer preserved");

const parityFixtures = [
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

for (const fixture of parityFixtures) {
  comparePilotParity(gaData, "general-awareness", fixture, "GA");
}
for (const fixture of parityFixtures) {
  comparePilotParity(gsData, "general-science", fixture, "GS");
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

const timeoutAnswers = buildAnswers(gsData, "timeout-one-correct");
const timeoutGuard = createGaGsSubmissionGuard();
let timeoutFinished = false;
timeoutGuard.trySubmit(() => { timeoutFinished = true; });
timeoutGuard.trySubmit(() => { timeoutFinished = false; });
assert(timeoutFinished, "GS timeout submit once");
const timeoutScore = scoreGaGsMockTest(gsData, timeoutAnswers, "general-science");
assertEq(timeoutScore.correct, 1, "GS timeout preserves answer");

const gaPaperCount = 1;
const gsPaperCount = 1;
const sharedCount = GA_GS_SHARED_FOUNDATION_PAPERS.size;
const legacyCount = gaPaperCount + gsPaperCount - sharedCount;
const parityFailures = errors.filter((entry) => entry.startsWith("GA ") || entry.startsWith("GS ")).length;

console.log("");
console.log(`GA/GS JSON papers discovered: ${gaPaperCount + gsPaperCount}`);
console.log(`GA papers: ${gaPaperCount}`);
console.log(`GS papers: ${gsPaperCount}`);
console.log(`Shared foundation papers: ${sharedCount}`);
console.log(`Legacy fallback papers: ${legacyCount}`);
console.log(`GA parity fixtures: ${parityFixtures.length}`);
console.log(`GS parity fixtures: ${parityFixtures.length}`);
console.log(`Total parity fixtures: ${parityFixtures.length * 2}`);
console.log(`Parity failures: ${parityFailures}`);
console.log(`JSON validation errors: ${jsonErrors}`);
console.log(`Adapter validation errors: ${adapterErrors}`);
console.log("");
console.log("GA parity results:");
for (const line of gaParityLines) console.log(` - ${line}`);
console.log("");
console.log("GS parity results:");
for (const line of gsParityLines) console.log(` - ${line}`);

if (errors.length) {
  console.log(`\nFAIL (${errors.length} errors)`);
  for (const error of errors) console.log(` - ${error}`);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
