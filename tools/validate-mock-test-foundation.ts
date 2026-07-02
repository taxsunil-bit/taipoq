#!/usr/bin/env node
/**
 * Validation for unified mock test foundation (Phase 3).
 * Run: npx tsx tools/validate-mock-test-foundation.ts
 */

import { CHECKED_TEST_PAPER_PACK_01 } from "../src/content/tests/checkedTestPaperPack01.ts";
import { analyzeMockTestResult } from "../src/lib/mockTestAnalysis.ts";
import {
  adaptHubTestPaper,
  adaptShuffledSession,
  hubAnswersToSelections,
  scoreHubSessionViaMockEngine,
  toLegacyScoreSummary,
} from "../src/lib/mockTestAdapters.ts";
import { scoreMockTest } from "../src/lib/mockTestScoring.ts";
import { hasValidationErrors, validateMockTestPaper } from "../src/lib/mockTestValidation.ts";
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

console.log("TAIPOQ — Mock Test Foundation Validation");
console.log("=".repeat(48));

// Validation tests
{
  const valid = makeValidPaper();
  assert(!hasValidationErrors(validateMockTestPaper(valid)), "valid paper passes");

  const empty = { ...valid, questions: [] };
  assert(hasValidationErrors(validateMockTestPaper(empty)), "empty paper fails");

  const dupQ = {
    ...valid,
    questions: [
      valid.questions[0],
      { ...valid.questions[0] },
    ],
  };
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

// Pilot adapter tests
const pilotHub = CHECKED_TEST_PAPER_PACK_01.papers.find((p) => p.paperId === MOCK_TEST_PILOT_PAPER_ID);
assert(!!pilotHub, "pilot hub paper exists");

if (pilotHub) {
  const adapted = adaptHubTestPaper(pilotHub);
  assertEq(adapted.id, "model-paper-01", "pilot paper id");
  assertEq(adapted.questions.length, pilotHub.questions.length, "pilot question count");
  assertEq(adapted.durationMinutes, pilotHub.durationMinutes, "pilot duration");
  assert(!hasValidationErrors(validateMockTestPaper(adapted)), "adapted pilot validates");

  for (let i = 0; i < adapted.questions.length; i++) {
    assertEq(adapted.questions[i].id, pilotHub.questions[i].id, `question id order ${i}`);
    assertEq(
      adapted.questions[i].correctOptionId,
      `${pilotHub.questions[i].id}-o${pilotHub.questions[i].answerIndex}`,
      `correct answer ${i}`,
    );
  }

  const shuffled = shuffleQuestions(pilotHub.questions, seededRandom(42));
  assertEq(shuffled.length, pilotHub.questions.length, "shuffled count");

  const fixtures: Array<{ name: string; answers: Record<string, number> }> = [
    { name: "all-unanswered", answers: {} },
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

  for (const fixture of fixtures) {
    const legacy = scoreTestAttempt(shuffled, fixture.answers);
    const shared = toLegacyScoreSummary(scoreHubSessionViaMockEngine(shuffled, fixture.answers));
    assertEq(shared.score, legacy.score, `${fixture.name} score parity`);
    assertEq(shared.total, legacy.total, `${fixture.name} total parity`);
    assertEq(shared.percentage, legacy.percentage, `${fixture.name} percentage parity`);
    assertEq(
      shared.correctIds.sort().join(","),
      legacy.correctIds.sort().join(","),
      `${fixture.name} correctIds parity`,
    );
    assertEq(
      shared.wrongIds.sort().join(","),
      legacy.wrongIds.sort().join(","),
      `${fixture.name} wrongIds parity`,
    );
  }

  const sessionPaper = adaptShuffledSession(shuffled);
  const selections = hubAnswersToSelections(
    shuffled,
    fixtures[4].answers,
  );
  const mockScore = scoreMockTest(sessionPaper, selections);
  const analysis = analyzeMockTestResult(sessionPaper, mockScore);
  assert(analysis.recommendation.length > 0, "analysis recommendation present");
  assert(analysis.topicBreakdown && Object.keys(analysis.topicBreakdown).length > 0, "topic breakdown from metadata");
}

console.log(`Errors: ${errors.length}`);
if (errors.length) {
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("PASS");
process.exit(0);
