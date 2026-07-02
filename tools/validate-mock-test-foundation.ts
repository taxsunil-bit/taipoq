#!/usr/bin/env node
/**
 * Validation for unified mock test foundation (Phase 3 + Phase 4 hub migration).
 * Run: npx tsx tools/validate-mock-test-foundation.ts
 */

import { getSubjectSlug } from "../src/content/tests/subjects.ts";
import { CHECKED_TEST_PAPER_PACK_01 } from "../src/content/tests/checkedTestPaperPack01.ts";
import { analyzeMockTestResult } from "../src/lib/mockTestAnalysis.ts";
import {
  adaptHubTestPaper,
  adaptShuffledSession,
  hubAnswersToSelections,
  scoreHubSessionViaMockEngine,
  toLegacyScoreSummary,
} from "../src/lib/mockTestAdapters.ts";
import {
  getHubPaperInventoryCount,
  getSharedFoundationPaperCount,
  getSharedMockFoundationPaperList,
  isSharedMockFoundationPaper,
  SHARED_MOCK_FOUNDATION_PAPERS,
} from "../src/lib/mockTestFoundationRegistry.ts";
import { scoreHubPaperAttempt } from "../src/lib/mockTestHubIntegration.ts";
import { scoreMockTest } from "../src/lib/mockTestScoring.ts";
import { hasValidationErrors, validateMockTestPaper } from "../src/lib/mockTestValidation.ts";
import { canAccessPaper, TESTS_ALL_FREE } from "../src/lib/tests/testAccess.ts";
import { shuffleQuestions } from "../src/lib/tests/questionShuffle.ts";
import { scoreTestAttempt } from "../src/lib/tests/testScoring.ts";
import type { MockTestPaper, SelectedAnswerMap } from "../src/types/mockTest.ts";
import { MOCK_TEST_PILOT_PAPER_ID } from "../src/types/mockTest.ts";

const errors: string[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) errors.push(message);
}

function assertEq<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) errors.push(`${message}: expected ${expected}, got ${actual}`);
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function seedForPaper(paperId: string): number {
  let hash = 0;
  for (let i = 0; i < paperId.length; i++) {
    hash = (hash * 31 + paperId.charCodeAt(i)) >>> 0;
  }
  return hash || 42;
}

function makeValidPaper(): MockTestPaper {
  return {
    id: "fixture-paper",
    subject: "Fixture",
    title: "Fixture Paper",
    durationMinutes: 10,
    defaultMarksPerQuestion: 1,
    defaultNegativeMarks: 0,
    questions: [
      {
        id: "q1",
        question: "2+2?",
        options: [
          { id: "q1-o0", text: "3" },
          { id: "q1-o1", text: "4" },
        ],
        correctOptionId: "q1-o1",
      },
      {
        id: "q2",
        question: "3+3?",
        options: [
          { id: "q2-o0", text: "5" },
          { id: "q2-o1", text: "6" },
        ],
        correctOptionId: "q2-o1",
        negativeMarks: 0.25,
        marks: 2,
      },
    ],
  };
}

function buildParityFixtures(shuffled: ReturnType<typeof shuffleQuestions>) {
  return [
    { name: "all-unanswered", answers: {} as Record<string, number> },
    { name: "first-correct", answers: { [shuffled[0].id]: shuffled[0].correctIndex } },
    {
      name: "first-wrong",
      answers: { [shuffled[0].id]: shuffled[0].correctIndex === 0 ? 1 : 0 },
    },
    {
      name: "alternating",
      answers: Object.fromEntries(
        shuffled.map((q, idx) => [
          q.id,
          idx % 2 === 0 ? q.correctIndex : q.correctIndex === 0 ? 1 : 0,
        ]),
      ),
    },
    {
      name: "all-correct",
      answers: Object.fromEntries(shuffled.map((q) => [q.id, q.correctIndex])),
    },
    {
      name: "all-wrong",
      answers: Object.fromEntries(
        shuffled.map((q) => [q.id, q.correctIndex === 0 ? 1 : 0]),
      ),
    },
  ];
}

console.log("TAIPOQ — Mock Test Foundation Validation");
console.log("=".repeat(48));

// Core validation tests (unchanged)
{
  const valid = makeValidPaper();
  assert(!hasValidationErrors(validateMockTestPaper(valid)), "valid paper passes");

  const empty = { ...valid, questions: [] };
  assert(hasValidationErrors(validateMockTestPaper(empty)), "empty paper fails");

  const dupQ = { ...valid, questions: [valid.questions[0], { ...valid.questions[0] }] };
  assert(hasValidationErrors(validateMockTestPaper(dupQ)), "duplicate question id fails");

  const dupOpt = {
    ...valid,
    questions: [
      {
        ...valid.questions[0],
        options: [
          { id: "same", text: "A" },
          { id: "same", text: "B" },
        ],
      },
    ],
  };
  assert(hasValidationErrors(validateMockTestPaper(dupOpt)), "duplicate option id fails");

  const badCorrect = {
    ...valid,
    questions: [{ ...valid.questions[0], correctOptionId: "missing" }],
  };
  assert(hasValidationErrors(validateMockTestPaper(badCorrect)), "missing correct option fails");

  const badDuration = { ...valid, durationMinutes: 0 };
  assert(hasValidationErrors(validateMockTestPaper(badDuration)), "invalid duration fails");

  const badNegative = {
    ...valid,
    questions: [{ ...valid.questions[0], negativeMarks: -1 }],
  };
  assert(hasValidationErrors(validateMockTestPaper(badNegative)), "negative marks below zero fail");

  const emptyText = {
    ...valid,
    questions: [{ ...valid.questions[0], question: "   " }],
  };
  assert(hasValidationErrors(validateMockTestPaper(emptyText)), "empty question text fails");
}

// Scoring tests
{
  const paper = makeValidPaper();
  const allCorrect: SelectedAnswerMap = { q1: "q1-o1", q2: "q2-o1" };
  const allWrong: SelectedAnswerMap = { q1: "q1-o0", q2: "q2-o0" };
  const allUnanswered: SelectedAnswerMap = {};
  const mixed: SelectedAnswerMap = { q1: "q1-o1", q2: "q2-o0" };

  const correctResult = scoreMockTest(paper, allCorrect);
  assertEq(correctResult.correct, 2, "all correct count");
  assertEq(correctResult.score, 3, "all correct score with custom marks");
  assertEq(correctResult.unanswered, 0, "all correct unanswered");

  const wrongResult = scoreMockTest(paper, allWrong);
  assertEq(wrongResult.incorrect, 2, "all incorrect count");
  assert(wrongResult.negativeMarks > 0, "negative marking applied");

  const unansweredResult = scoreMockTest(paper, allUnanswered);
  assertEq(unansweredResult.unanswered, 2, "all unanswered");
  assertEq(unansweredResult.score, 0, "all unanswered score");

  const mixedResult = scoreMockTest(paper, mixed);
  assertEq(mixedResult.correct, 1, "mixed correct");
  assertEq(mixedResult.incorrect, 1, "mixed incorrect");

  const passPaper: MockTestPaper = { ...paper, passMarks: 2 };
  const passResult = scoreMockTest(passPaper, allCorrect);
  assertEq(passResult.passed, true, "pass by marks");

  const failPaper: MockTestPaper = { ...paper, passPercentage: 90 };
  const failResult = scoreMockTest(failPaper, mixed);
  assertEq(failResult.passed, false, "fail by percentage");

  const unknownKey: SelectedAnswerMap = { q1: "q1-o1", q2: "q2-o1", extra: "x" };
  const unknownResult = scoreMockTest(paper, unknownKey);
  assertEq(unknownResult.correct, 2, "unknown keys ignored when not question ids");
}

// Inventory
const hubPapers = CHECKED_TEST_PAPER_PACK_01.papers;
assertEq(getHubPaperInventoryCount(), hubPapers.length, "hub inventory count");
assertEq(getSharedFoundationPaperCount(), hubPapers.length, "all hub papers in registry");
assert(isSharedMockFoundationPaper("model-papers", MOCK_TEST_PILOT_PAPER_ID), "pilot in registry");

const registryList = getSharedMockFoundationPaperList();
assertEq(registryList.length, hubPapers.length, "registry list length");

for (const paper of hubPapers) {
  const subjectSlug = getSubjectSlug(paper.subject);
  assert(isSharedMockFoundationPaper(subjectSlug, paper.paperId), `registry includes ${paper.paperId}`);
}

assert(!isSharedMockFoundationPaper("current-affairs", "current-affairs-pack-02"), "pack 02 excluded");
assert(!isSharedMockFoundationPaper("general-awareness", "model-test-01"), "GA JSON excluded");

// Per-paper validation + parity
let migratedCount = 0;
let legacyFallbackCount = 0;
let validationErrorCount = 0;

for (const paper of hubPapers) {
  const subjectSlug = getSubjectSlug(paper.subject);
  const label = `${subjectSlug}/${paper.paperId}`;
  const adapted = adaptHubTestPaper(paper);
  const issues = validateMockTestPaper(adapted);
  const hasErrors = hasValidationErrors(issues);

  if (hasErrors) {
    validationErrorCount += 1;
    legacyFallbackCount += 1;
    assert(false, `${label} validation failed: ${issues.map((i) => i.message).join("; ")}`);
    continue;
  }

  assertEq(adapted.questions.length, paper.questions.length, `${label} question count`);
  assertEq(adapted.durationMinutes, paper.durationMinutes, `${label} duration`);

  for (let i = 0; i < adapted.questions.length; i++) {
    assertEq(adapted.questions[i].id, paper.questions[i].id, `${label} question id ${i}`);
    assertEq(
      adapted.questions[i].correctOptionId,
      `${paper.questions[i].id}-o${paper.questions[i].answerIndex}`,
      `${label} correct option ${i}`,
    );
  }

  if (isSharedMockFoundationPaper(subjectSlug, paper.paperId)) {
    migratedCount += 1;
    const shuffled = shuffleQuestions(paper.questions, seededRandom(seedForPaper(paper.paperId)));

    for (const q of shuffled) {
      assert(
        q.shuffledOptions[q.correctIndex] === q.answer,
        `${label} shuffled correct option text matches answer for ${q.id}`,
      );
    }

    for (const fixture of buildParityFixtures(shuffled)) {
      const legacy = scoreTestAttempt(shuffled, fixture.answers);
      const shared = toLegacyScoreSummary(scoreHubSessionViaMockEngine(shuffled, fixture.answers));
      const integrated = scoreHubPaperAttempt(subjectSlug, paper.paperId, shuffled, fixture.answers);

      assertEq(integrated.score, legacy.score, `${label} ${fixture.name} integrated score`);
      assertEq(shared.score, legacy.score, `${label} ${fixture.name} score parity`);
      assertEq(shared.total, legacy.total, `${label} ${fixture.name} total parity`);
      assertEq(shared.percentage, legacy.percentage, `${label} ${fixture.name} percentage parity`);
      assertEq(
        shared.correctIds.sort().join(","),
        legacy.correctIds.sort().join(","),
        `${label} ${fixture.name} correctIds parity`,
      );
      assertEq(
        shared.wrongIds.sort().join(","),
        legacy.wrongIds.sort().join(","),
        `${label} ${fixture.name} wrongIds parity`,
      );
    }

    const shuffledSample = shuffleQuestions(paper.questions, seededRandom(seedForPaper(paper.paperId)));
    const sessionPaper = adaptShuffledSession(shuffledSample);
    const selections = hubAnswersToSelections(
      shuffledSample,
      buildParityFixtures(shuffledSample)[4].answers,
    );
    const mockScore = scoreMockTest(sessionPaper, selections);
    const analysis = analyzeMockTestResult(sessionPaper, mockScore);
    assert(analysis.recommendation.length > 0, `${label} analysis recommendation`);
  } else {
    legacyFallbackCount += 1;
  }
}

// Access rules unchanged
{
  const freePaper = hubPapers.find((p) => p.access === "free");
  const gatedPaper = hubPapers.find((p) => p.access === "exam_pass" || p.access === "practice_pass");
  assert(!!freePaper, "free paper exists");
  assert(canAccessPaper(freePaper!), "free paper accessible");
  if (gatedPaper) {
    assert(canAccessPaper(gatedPaper), "gated paper accessible under TESTS_ALL_FREE");
  }
  assert(TESTS_ALL_FREE === true, "TESTS_ALL_FREE flag unchanged");
}

// Registry uniqueness
assertEq(SHARED_MOCK_FOUNDATION_PAPERS.size, registryList.length, "no duplicate registry keys");

console.log("");
console.log(`Hub papers discovered: ${hubPapers.length}`);
console.log(`Shared foundation papers: ${migratedCount}`);
console.log(`Legacy fallback papers: ${legacyFallbackCount}`);
console.log(`Validation errors: ${validationErrorCount}`);
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("PASS");
process.exit(0);
