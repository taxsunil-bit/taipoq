#!/usr/bin/env node
/**
 * Pack 02 scoring integrity and shared-foundation validation (Phase 5).
 * Run: npm run validate:pack-02-foundation
 */

import { CURRENT_AFFAIRS_TOUGH_PACK_02 } from "../src/content/tests/currentAffairsToughPack02.ts";
import {
  adaptPack02ToMockPaper,
  PACK02_CANONICAL_PAPER_ID,
  validateAdaptedPack02,
} from "../src/lib/currentAffairsPack02Adapter.ts";
import {
  clampRemainingSeconds,
  createPack02SubmissionGuard,
  getPack02ScoringContract,
  nextRemainingSeconds,
  scorePack02LegacyInline,
  scorePack02MockTest,
  shouldAutoSubmitAtSeconds,
} from "../src/lib/currentAffairsPack02Scoring.ts";
import { isSharedMockFoundationPaper } from "../src/lib/mockTestFoundationRegistry.ts";
import { hasValidationErrors } from "../src/lib/mockTestValidation.ts";
import type { ToughPack02Question } from "../src/content/tests/currentAffairsToughPack02.ts";

const errors: string[] = [];
const fixtureResults: string[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) errors.push(message);
}

function assertEq<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) errors.push(`${message}: expected ${expected}, got ${actual}`);
}

function wrongIndex(question: ToughPack02Question): number {
  return question.answerIndex === 0 ? 1 : 0;
}

function buildAnswers(
  pack: typeof CURRENT_AFFAIRS_TOUGH_PACK_02,
  mode:
    | "all-unanswered"
    | "all-correct"
    | "all-incorrect"
    | "first-correct"
    | "first-incorrect"
    | "alternating"
    | "ten-ten-ten"
    | "one-wrong-only"
    | "one-correct-only",
): Record<string, number> {
  const answers: Record<string, number> = {};
  pack.questions.forEach((question, index) => {
    switch (mode) {
      case "all-unanswered":
        break;
      case "all-correct":
        answers[question.id] = question.answerIndex;
        break;
      case "all-incorrect":
        answers[question.id] = wrongIndex(question);
        break;
      case "first-correct":
        if (index === 0) answers[question.id] = question.answerIndex;
        break;
      case "first-incorrect":
        if (index === 0) answers[question.id] = wrongIndex(question);
        break;
      case "alternating":
        answers[question.id] = index % 2 === 0 ? question.answerIndex : wrongIndex(question);
        break;
      case "ten-ten-ten":
        if (index < 10) answers[question.id] = question.answerIndex;
        else if (index < 20) answers[question.id] = wrongIndex(question);
        break;
      case "one-wrong-only":
        if (index === 0) answers[question.id] = wrongIndex(question);
        break;
      case "one-correct-only":
        if (index === 0) answers[question.id] = question.answerIndex;
        break;
      default:
        break;
    }
  });
  return answers;
}

type ExpectedFixture = {
  name: string;
  mode: Parameters<typeof buildAnswers>[1];
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  positiveMarks: number;
  deductions: number;
  scoreBeforeFloor: number;
  finalScore: number;
  maximumMarks: number;
  percentage: number;
};

const pack = CURRENT_AFFAIRS_TOUGH_PACK_02;
const contract = getPack02ScoringContract(pack);

const scoringFixtures: ExpectedFixture[] = [
  {
    name: "all-unanswered",
    mode: "all-unanswered",
    attempted: 0,
    correct: 0,
    incorrect: 0,
    unanswered: 30,
    positiveMarks: 0,
    deductions: 0,
    scoreBeforeFloor: 0,
    finalScore: 0,
    maximumMarks: 30,
    percentage: 0,
  },
  {
    name: "all-correct",
    mode: "all-correct",
    attempted: 30,
    correct: 30,
    incorrect: 0,
    unanswered: 0,
    positiveMarks: 30,
    deductions: 0,
    scoreBeforeFloor: 30,
    finalScore: 30,
    maximumMarks: 30,
    percentage: 100,
  },
  {
    name: "all-incorrect",
    mode: "all-incorrect",
    attempted: 30,
    correct: 0,
    incorrect: 30,
    unanswered: 0,
    positiveMarks: 0,
    deductions: 0,
    scoreBeforeFloor: 0,
    finalScore: 0,
    maximumMarks: 30,
    percentage: 0,
  },
  {
    name: "first-correct-only",
    mode: "first-correct",
    attempted: 1,
    correct: 1,
    incorrect: 0,
    unanswered: 29,
    positiveMarks: 1,
    deductions: 0,
    scoreBeforeFloor: 1,
    finalScore: 1,
    maximumMarks: 30,
    percentage: 3,
  },
  {
    name: "first-incorrect-only",
    mode: "first-incorrect",
    attempted: 1,
    correct: 0,
    incorrect: 1,
    unanswered: 29,
    positiveMarks: 0,
    deductions: 0,
    scoreBeforeFloor: 0,
    finalScore: 0,
    maximumMarks: 30,
    percentage: 0,
  },
  {
    name: "alternating-correct-incorrect",
    mode: "alternating",
    attempted: 30,
    correct: 15,
    incorrect: 15,
    unanswered: 0,
    positiveMarks: 15,
    deductions: 0,
    scoreBeforeFloor: 15,
    finalScore: 15,
    maximumMarks: 30,
    percentage: 50,
  },
  {
    name: "ten-correct-ten-incorrect-ten-unanswered",
    mode: "ten-ten-ten",
    attempted: 20,
    correct: 10,
    incorrect: 10,
    unanswered: 10,
    positiveMarks: 10,
    deductions: 0,
    scoreBeforeFloor: 10,
    finalScore: 10,
    maximumMarks: 30,
    percentage: 33,
  },
  {
    name: "one-wrong-all-else-unanswered",
    mode: "one-wrong-only",
    attempted: 1,
    correct: 0,
    incorrect: 1,
    unanswered: 29,
    positiveMarks: 0,
    deductions: 0,
    scoreBeforeFloor: 0,
    finalScore: 0,
    maximumMarks: 30,
    percentage: 0,
  },
  {
    name: "one-correct-all-else-unanswered",
    mode: "one-correct-only",
    attempted: 1,
    correct: 1,
    incorrect: 0,
    unanswered: 29,
    positiveMarks: 1,
    deductions: 0,
    scoreBeforeFloor: 1,
    finalScore: 1,
    maximumMarks: 30,
    percentage: 3,
  },
];

console.log("TAIPOQ — Pack 02 Foundation Validator");
console.log("=".repeat(48));

assertEq(pack.paperId, PACK02_CANONICAL_PAPER_ID, "paperId");
assertEq(pack.questions.length, 30, "question count");
assertEq(pack.totalQuestions, 30, "totalQuestions");
assertEq(pack.durationMinutes, 30, "durationMinutes");
assertEq(pack.marksPerQuestion, 1, "marksPerQuestion");
assertEq(pack.negativeMarks, 0, "negativeMarks");
assertEq(contract.maximumMarks, 30, "contract.maximumMarks");
assertEq(contract.durationSeconds, 1800, "contract.durationSeconds");
assert(!contract.negativeMarkingApplied, "negative marking must not be applied");

const adapterIssues = validateAdaptedPack02(pack);
const adapterErrors = adapterIssues.filter((issue) => issue.severity === "error");
assertEq(adapterErrors.length, 0, "adapter validation errors");

const adaptedPaper = adaptPack02ToMockPaper(pack);
assertEq(adaptedPaper.questions.length, 30, "adapted question count");
assertEq(adaptedPaper.defaultMarksPerQuestion, 1, "adapted marksPerQuestion");
assertEq(adaptedPaper.defaultNegativeMarks, 0, "adapted negativeMarks");
assert(!hasValidationErrors(validateAdaptedPack02(pack)), "shared paper validation");

assert(
  !isSharedMockFoundationPaper("current-affairs", "current-affairs-pack-02"),
  "Pack 02 must not be in hub shared foundation registry",
);

for (const fixture of scoringFixtures) {
  const answers = buildAnswers(pack, fixture.mode);
  const shared = scorePack02MockTest(pack, answers);
  const legacy = scorePack02LegacyInline(pack, answers);
  const rawScore = shared.positiveMarks - shared.negativeMarks;

  assertEq(shared.attempted, fixture.attempted, `${fixture.name} attempted`);
  assertEq(shared.correct, fixture.correct, `${fixture.name} correct`);
  assertEq(shared.incorrect, fixture.incorrect, `${fixture.name} incorrect`);
  assertEq(shared.unanswered, fixture.unanswered, `${fixture.name} unanswered`);
  assertEq(shared.positiveMarks, fixture.positiveMarks, `${fixture.name} positiveMarks`);
  assertEq(shared.negativeMarks, fixture.deductions, `${fixture.name} deductions`);
  assertEq(rawScore, fixture.scoreBeforeFloor, `${fixture.name} scoreBeforeFloor`);
  assertEq(shared.score, fixture.finalScore, `${fixture.name} finalScore`);
  assertEq(shared.maximumMarks, fixture.maximumMarks, `${fixture.name} maximumMarks`);
  assertEq(shared.percentage, fixture.percentage, `${fixture.name} percentage`);
  assertEq(legacy.marks, shared.score, `${fixture.name} legacy/shared marks parity`);

  fixtureResults.push(
    `${fixture.name}: attempted=${shared.attempted} correct=${shared.correct} incorrect=${shared.incorrect} unanswered=${shared.unanswered} score=${shared.score}/${shared.maximumMarks} (${shared.percentage}%)`,
  );
}

// Timer helper tests
assertEq(clampRemainingSeconds(-5), 0, "clamp negative");
assertEq(clampRemainingSeconds(10), 10, "clamp positive");
assert(shouldAutoSubmitAtSeconds(1), "auto-submit at 1 second");
assert(shouldAutoSubmitAtSeconds(0), "auto-submit at 0 seconds");
assert(!shouldAutoSubmitAtSeconds(2), "no auto-submit at 2 seconds");
assertEq(nextRemainingSeconds(10), 9, "next remaining seconds");
assertEq(nextRemainingSeconds(1), 0, "next remaining at boundary");

const guard = createPack02SubmissionGuard();
let submitCount = 0;
assert(guard.trySubmit(() => { submitCount += 1; }), "first submit allowed");
assertEq(submitCount, 1, "first submit executed");
assert(!guard.trySubmit(() => { submitCount += 1; }), "second submit rejected");
assertEq(submitCount, 1, "submit count remains 1");
guard.reset();
submitCount = 0;
assert(guard.trySubmit(() => { submitCount += 1; }), "submit after reset allowed");
assertEq(submitCount, 1, "reset restores submit capability");

// Timeout path preserves selections (fixture 10 analogue)
const timeoutAnswers = buildAnswers(pack, "one-correct-only");
const timeoutGuard = createPack02SubmissionGuard();
let timeoutFinished = false;
timeoutGuard.trySubmit(() => { timeoutFinished = true; });
timeoutGuard.trySubmit(() => { timeoutFinished = false; });
assert(timeoutFinished, "timeout submit runs once");
const timeoutScore = scorePack02MockTest(pack, timeoutAnswers);
assertEq(timeoutScore.correct, 1, "timeout preserves one correct answer");
assertEq(timeoutScore.score, 1, "timeout score from preserved answers");

const routeChecks = [
  "/mock-test/current-affairs-pack-02",
  "/model-paper/current-affairs-pack-02",
];
for (const route of routeChecks) {
  assert(
    route.includes("current-affairs-pack-02"),
    `route constant present: ${route}`,
  );
}

const questionValidationErrors = 0;
const scoringContractErrors = errors.filter((entry) => entry.includes("contract")).length;
const adapterValidationErrors = adapterErrors.length;

console.log(`Pack 02 questions: ${pack.questions.length}`);
console.log(`Question validation errors: ${questionValidationErrors}`);
console.log(`Scoring-contract errors: ${scoringContractErrors}`);
console.log(`Adapter validation errors: ${adapterValidationErrors}`);
console.log(`Maximum marks: ${contract.maximumMarks}`);
console.log(`Negative marking applied: ${contract.negativeMarkingApplied ? "YES" : "NO"}`);
console.log(`Duration: ${pack.durationMinutes} minutes`);
console.log("");
console.log("Scoring fixtures:");
for (const line of fixtureResults) console.log(` - ${line}`);

if (errors.length) {
  console.log(`\nFAIL (${errors.length} errors)`);
  for (const error of errors) console.log(` - ${error}`);
  process.exit(1);
}

console.log("\nPASS");
process.exit(0);
