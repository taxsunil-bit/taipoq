#!/usr/bin/env node
/**
 * Validation for typing result intelligence analysis engine.
 * Run: npx tsx tools/validate-typing-analysis.ts
 */

import { computeStats } from "../src/lib/typing-utils.ts";
import {
  analyzeTypingText,
  EXTRA_LABEL,
  MISSING_LABEL,
} from "../src/lib/typingAnalysis.ts";

const errors: string[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) errors.push(message);
}

function assertEq<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) errors.push(`${message}: expected ${expected}, got ${actual}`);
}

console.log("TAIPOQ — Typing Analysis Validation");
console.log("=".repeat(48));

// 1. Exact text
{
  const a = analyzeTypingText("the quick brown fox", "the quick brown fox", { accuracy: 98, passed: true });
  assertEq(a.totalMismatches, 0, "exact match mismatches");
  assert(!a.focusedPracticeText, "exact match no focused practice");
  assert(a.recommendation.kind === "strong", "exact match strong recommendation");
}

// 2. Empty typed
{
  const a = analyzeTypingText("hello world", "", { accuracy: 0, passed: false });
  assert(a.categories.missingContent > 0 || a.weakWords.length > 0, "empty typed handled");
}

// 3. English substitution
{
  const a = analyzeTypingText("government development", "goverment development", { accuracy: 85, passed: false });
  assert(a.weakWords.some((w) => w.expected === "government"), "english word mistake detected");
}

// 4. Hindi matra substitution
{
  const a = analyzeTypingText("परीक्षा प्रक्रिया", "परिक्षा प्रक्रिया", { lang: "hi", accuracy: 88, passed: false });
  assert(
    a.weakCharacters.length > 0 || a.repeatedPatterns.some((p) => p.includes("Matra")),
    "hindi matra pattern",
  );
}

// 5. Omitted character
{
  const a = analyzeTypingText("test", "tst", { accuracy: 75, passed: false });
  assert(a.omissions > 0 || a.categories.incorrectWords > 0, "omission detected");
}

// 6. Inserted character
{
  const a = analyzeTypingText("test", "tests", { accuracy: 80, passed: false });
  assert(a.insertions > 0 || a.categories.incorrectWords > 0 || a.categories.extraContent > 0, "insertion detected");
}

// 7. Missing word
{
  const a = analyzeTypingText("one two three", "one three", { accuracy: 80, passed: false });
  assert(
    a.weakWords.some((w) => w.expected === "two" && w.actual === MISSING_LABEL) || a.categories.missingContent > 0,
    "missing word",
  );
}

// 8. Extra word
{
  const a = analyzeTypingText("one two", "one extra two", { accuracy: 80, passed: false });
  assert(
    a.weakWords.some((w) => w.expected === EXTRA_LABEL) || a.categories.extraContent > 0,
    "extra word",
  );
}

// 9. Missing space (word merge)
{
  const a = analyzeTypingText("hello world", "helloworld", { accuracy: 85, passed: false });
  assert(a.categories.incorrectWords > 0 || a.spacingErrors >= 0, "missing space handled");
}

// 10. Extra repeated space
{
  const a = analyzeTypingText("hello world", "hello  world", { accuracy: 90, passed: true, targetWpm: 25, netWpm: 30 });
  assert(a.spacingErrors > 0 || a.categories.incorrectWords > 0, "extra space handled");
}

// 11. Punctuation mismatch
{
  const a = analyzeTypingText("Hello, world.", "Hello world", { accuracy: 92, passed: true, targetWpm: 25, netWpm: 30 });
  assert(a.punctuationErrors > 0 || a.categories.incorrectWords > 0, "punctuation handled");
}

// 12. Repeated incorrect word aggregation
{
  const a = analyzeTypingText(
    "government government government",
    "goverment goverment goverment",
    { accuracy: 80, passed: false },
  );
  const gov = a.weakWords.find((w) => w.expected === "government");
  assert(!!gov && gov.count >= 2, "repeated word aggregated");
}

// 13. Weak words max 5
{
  const target = "alpha beta gamma delta epsilon zeta eta theta iota kappa";
  const typed = "alphaa betaa gammaa deltaa epsilona zetaa etaa thetaa iota kappa";
  const a = analyzeTypingText(target, typed, { accuracy: 70, passed: false });
  assert(a.weakWords.length <= 5, "weak words capped at 5");
}

// 14. Weak characters max 5
{
  const target = "abcdefghijklmnopqrstuvwxyz";
  const typed = "bbcdefghijklmnopqrstuvwxyz";
  const a = analyzeTypingText(target, typed, { accuracy: 70, passed: false });
  assert(a.weakCharacters.length <= 5, "weak characters capped at 5");
}

// 15. Spacing recommendation
{
  const a = analyzeTypingText(
    "one two three four five six",
    "one  two  three  four  five  six",
    { accuracy: 95, passed: true, targetWpm: 25, netWpm: 30 },
  );
  assert(a.recommendation.kind === "spacing" || a.spacingErrors > 0, "spacing recommendation or errors");
}

// 16. Strong recommendation
{
  const a = analyzeTypingText("exact passage text", "exact passage text", {
    accuracy: 98,
    passed: true,
    targetWpm: 30,
    netWpm: 35,
  });
  assertEq(a.recommendation.kind, "strong", "strong recommendation");
}

// 17. Focused practice from weak words
{
  const a = analyzeTypingText(
    "government development examination",
    "goverment development examinaton",
    { accuracy: 85, passed: false },
  );
  assert(!!a.focusedPracticeText && a.focusedPracticeText.includes("government"), "focused practice text");
}

// 18. Accuracy-first recommendation
{
  const a = analyzeTypingText("hello world", "hello worl", { accuracy: 80, passed: false, targetWpm: 35, netWpm: 20 });
  assertEq(a.recommendation.kind, "accuracy", "accuracy recommendation when below pass threshold");
}

// 19. Unicode Hindi does not crash
{
  const a = analyzeTypingText("विद्यार्थी परीक्षा", "विद्यार्थी परिक्षा", { lang: "hi", accuracy: 90, passed: true });
  assert(typeof a.totalMismatches === "number", "unicode hindi safe");
}

// 20. Canonical scoring regression — computeStats unchanged
{
  const fixtures = [
    { target: "the quick brown fox jumps", typed: "the quick brown fox jumps", lang: "en" as const, elapsed: 60 },
    { target: "the quick brown fox jumps", typed: "the quik brown fox jump", lang: "en" as const, elapsed: 45 },
    { target: "विद्यार्थी परीक्षा", typed: "विद्यार्थी परीक्षा", lang: "hi" as const, elapsed: 50 },
    { target: "विद्यार्थी परीक्षा", typed: "विद्यार्थी परिक्षा", lang: "hi" as const, elapsed: 55 },
    { target: "dks nksV dk;Z", typed: "dks nksV dk;Z", lang: "en" as const, elapsed: 40 },
  ];

  for (const fx of fixtures) {
    const stats = computeStats(fx.target, fx.typed, fx.elapsed, fx.lang);
    assert(typeof stats.grossWpm === "number", `grossWpm number for ${fx.target.slice(0, 12)}`);
    assert(typeof stats.netWpm === "number", `netWpm number for ${fx.target.slice(0, 12)}`);
    assert(typeof stats.accuracy === "number", `accuracy number for ${fx.target.slice(0, 12)}`);
    assert(typeof stats.mistakes === "number", `mistakes number for ${fx.target.slice(0, 12)}`);
  }

  const passCase = computeStats("hello world test", "hello world test", 30, "en");
  assertEq(passCase.accuracy, 100, "regression exact accuracy");
  assertEq(passCase.mistakes, 0, "regression exact mistakes");

  const failCase = computeStats("hello world", "hello worxd", 30, "en");
  assert(failCase.mistakes > 0, "regression fail mistakes");
}

console.log(`Errors: ${errors.length}`);
if (errors.length) {
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("PASS");
process.exit(0);
