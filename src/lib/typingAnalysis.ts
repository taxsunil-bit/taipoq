/**
 * Deterministic typing mistake analysis — post-submit only.
 * Does not alter canonical WPM / accuracy scoring in typing-utils.ts.
 */

import { normalize, toGraphemes } from "./typing-utils";

export type AnalysisLang = "en" | "hi" | "kruti";

export type MismatchType =
  | "substitution"
  | "omission"
  | "insertion"
  | "spacing"
  | "punctuation";

export interface TypingMismatch {
  index: number;
  expected: string;
  actual: string;
  type: MismatchType;
}

export interface WordMistake {
  expected: string;
  actual: string;
  count: number;
  firstIndex: number;
}

export interface CharacterMistake {
  expected: string;
  actual: string;
  count: number;
}

export interface MistakeCategorySummary {
  incorrectWords: number;
  missingContent: number;
  extraContent: number;
  spacing: number;
  punctuation: number;
}

export type RecommendationKind =
  | "accuracy"
  | "spacing"
  | "punctuation"
  | "omission"
  | "substitution"
  | "strong";

export interface TypingRecommendation {
  kind: RecommendationKind;
  message: string;
}

export interface TypingAnalysis {
  totalMismatches: number;
  substitutions: number;
  omissions: number;
  insertions: number;
  spacingErrors: number;
  punctuationErrors: number;
  categories: MistakeCategorySummary;
  weakWords: WordMistake[];
  weakCharacters: CharacterMistake[];
  repeatedPatterns: string[];
  recommendation: TypingRecommendation;
  focusedPracticeText?: string;
}

export interface AnalyzeTypingOptions {
  lang?: AnalysisLang;
  accuracy?: number;
  netWpm?: number;
  targetWpm?: number;
  passed?: boolean;
}

const MAX_ANALYSIS_CHARS = 8000;
const MISSING_LABEL = "[missing]";
const EXTRA_LABEL = "[extra]";
const SPACE_LABEL = "Space";

const HINDI_CONJUNCTS = ["त्र", "क्ष", "ज्ञ", "श्र", "क्र", "प्र"] as const;

const PUNCTUATION = new Set(".,;:!?\"'()[]{}-/–—…");

function prepText(text: string, lang: AnalysisLang): string {
  if (lang === "kruti") return text ?? "";
  return normalize(text ?? "");
}

function splitWords(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed.split(/\s+/);
}

function isPunctuationChar(ch: string): boolean {
  if (!ch) return false;
  return PUNCTUATION.has(ch) || /[\u0964\u0965]/.test(ch);
}

function isSpaceChar(ch: string): boolean {
  return ch === " " || ch === "\u00a0";
}

function displayChar(ch: string, role: "expected" | "actual"): string {
  if (!ch) return role === "expected" ? MISSING_LABEL : EXTRA_LABEL;
  if (isSpaceChar(ch)) return SPACE_LABEL;
  return ch;
}

function classifyMismatch(expected: string, actual: string): MismatchType {
  if (isSpaceChar(expected) || isSpaceChar(actual)) return "spacing";
  if (isPunctuationChar(expected) || isPunctuationChar(actual)) return "punctuation";
  if (!expected && actual) return "insertion";
  if (expected && !actual) return "omission";
  return "substitution";
}

function graphemesFor(text: string, lang: AnalysisLang): string[] {
  if (lang === "kruti") return Array.from(text);
  return toGraphemes(text, lang === "hi" ? "hi" : "en");
}

type AlignOp = { kind: "match" | "sub" | "ins" | "del"; expected: string; actual: string };

function alignGraphemes(expected: string, actual: string, lang: AnalysisLang): AlignOp[] {
  const exp = graphemesFor(expected, lang);
  const act = graphemesFor(actual, lang);
  const n = exp.length;
  const m = act.length;

  if (n === 0 && m === 0) return [];

  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) dp[i][0] = i;
  for (let j = 1; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = exp[i - 1] === act[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + cost,
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
      );
    }
  }

  const ops: AlignOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const cost = exp[i - 1] === act[j - 1] ? 0 : 1;
      if (dp[i][j] === dp[i - 1][j - 1] + cost) {
        ops.push({
          kind: exp[i - 1] === act[j - 1] ? "match" : "sub",
          expected: exp[i - 1],
          actual: act[j - 1],
        });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ kind: "del", expected: exp[i - 1], actual: "" });
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      ops.push({ kind: "ins", expected: "", actual: act[j - 1] });
      j--;
    } else {
      break;
    }
  }

  return ops.reverse();
}

type WordAlignPair = { expected: string | null; actual: string | null; wordIndex: number };

function alignWords(expectedWords: string[], actualWords: string[]): WordAlignPair[] {
  const n = expectedWords.length;
  const m = actualWords.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) dp[i][0] = i;
  for (let j = 1; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = expectedWords[i - 1] === actualWords[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j - 1] + cost,
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
      );
    }
  }

  const pairs: WordAlignPair[] = [];
  let i = n;
  let j = m;
  let wordIndex = Math.max(n, m);

  while (i > 0 || j > 0) {
    wordIndex--;
    if (i > 0 && j > 0) {
      const cost = expectedWords[i - 1] === actualWords[j - 1] ? 0 : 1;
      if (dp[i][j] === dp[i - 1][j - 1] + cost) {
        pairs.push({
          expected: expectedWords[i - 1],
          actual: actualWords[j - 1],
          wordIndex,
        });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      pairs.push({ expected: expectedWords[i - 1], actual: null, wordIndex });
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      pairs.push({ expected: null, actual: actualWords[j - 1], wordIndex });
      j--;
    } else {
      break;
    }
  }

  return pairs.reverse();
}

function aggregateWeakWords(pairs: WordAlignPair[]): WordMistake[] {
  const map = new Map<string, WordMistake>();

  pairs.forEach((pair, idx) => {
    const expected = pair.expected ?? MISSING_LABEL;
    const actual = pair.actual ?? MISSING_LABEL;
    if (expected === actual) return;
    if (pair.expected === null) {
      const key = `${EXTRA_LABEL}|${actual}`;
      const row = map.get(key) ?? { expected: EXTRA_LABEL, actual, count: 0, firstIndex: idx };
      row.count++;
      map.set(key, row);
      return;
    }
    if (pair.actual === null) {
      const key = `${expected}|${MISSING_LABEL}`;
      const row = map.get(key) ?? { expected, actual: MISSING_LABEL, count: 0, firstIndex: idx };
      row.count++;
      map.set(key, row);
      return;
    }
    const key = `${expected}|${actual}`;
    const row = map.get(key) ?? { expected, actual, count: 0, firstIndex: idx };
    row.count++;
    map.set(key, row);
  });

  return [...map.values()]
    .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex || a.expected.localeCompare(b.expected))
    .slice(0, 5);
}

function aggregateWeakCharacters(mismatches: TypingMismatch[]): CharacterMistake[] {
  const map = new Map<string, CharacterMistake>();

  for (const row of mismatches) {
    const expected = displayChar(row.expected, "expected");
    const actual = displayChar(row.actual, "actual");
    if (expected === actual) continue;
    const key = `${expected}|${actual}`;
    const existing = map.get(key) ?? { expected, actual, count: 0 };
    existing.count++;
    map.set(key, existing);
  }

  return [...map.values()]
    .sort((a, b) => b.count - a.count || a.expected.localeCompare(b.expected))
    .slice(0, 5);
}

function detectRepeatedPatterns(
  mismatches: TypingMismatch[],
  lang: AnalysisLang,
): string[] {
  const patterns = new Set<string>();

  for (const row of mismatches) {
    if (lang === "hi" || lang === "kruti") {
      for (const conjunct of HINDI_CONJUNCTS) {
        if (row.expected.includes(conjunct) || row.actual.includes(conjunct)) {
          patterns.add(`Conjunct: ${conjunct}`);
        }
      }
      const matraPairs: Array<[string, string, string]> = [
        ["\u093F", "\u0940", "ि / ी"],
        ["\u0941", "\u0942", "ु / ू"],
        ["\u0947", "\u0948", "े / ै"],
        ["\u094B", "\u094C", "ो / ौ"],
        ["\u0902", "\u0901", "anusvara / chandrabindu"],
      ];
      for (const [a, b, label] of matraPairs) {
        if (
          (row.expected === a && row.actual === b) ||
          (row.expected === b && row.actual === a)
        ) {
          patterns.add(`Matra: ${label}`);
        }
      }
      if (row.expected.includes("\u094D") || row.actual.includes("\u094D")) {
        patterns.add("Halant (्)");
      }
    }
  }

  return [...patterns].slice(0, 5);
}

function buildRecommendation(
  categories: MistakeCategorySummary,
  mismatches: TypingMismatch[],
  options: AnalyzeTypingOptions,
): TypingRecommendation {
  const accuracy = options.accuracy ?? 100;
  const passAcc = 90;
  const targetWpm = options.targetWpm;
  const netWpm = options.netWpm ?? 0;
  const strongAcc = accuracy >= 95;
  const strongSpeed = targetWpm ? netWpm >= targetWpm : netWpm >= 35;

  if (accuracy < passAcc || options.passed === false) {
    return {
      kind: "accuracy",
      message:
        "Focus on accuracy before increasing speed. Repeat a shorter passage and keep corrections controlled.",
    };
  }

  const totals = [
    { key: "spacing" as const, value: categories.spacing },
    { key: "punctuation" as const, value: categories.punctuation },
    { key: "omission" as const, value: categories.missingContent },
    { key: "substitution" as const, value: categories.incorrectWords },
    { key: "extra" as const, value: categories.extraContent },
  ].sort((a, b) => b.value - a.value);

  const dominant = totals[0];
  const mismatchTotal = mismatches.length;

  if (mismatchTotal <= 2 && strongAcc && (options.passed !== false)) {
    return {
      kind: "strong",
      message:
        "Your performance is stable. Continue with a longer or higher-speed test.",
    };
  }

  if (dominant.value === 0 || mismatchTotal === 0) {
    return {
      kind: "strong",
      message:
        "Your performance is stable. Continue with a longer or higher-speed test.",
    };
  }

  switch (dominant.key) {
    case "spacing":
      return {
        kind: "spacing",
        message:
          "Your main difficulty is spacing. Practise short sentences while maintaining one space between words.",
      };
    case "punctuation":
      return {
        kind: "punctuation",
        message:
          "Your word typing is comparatively stable, but punctuation needs attention. Practise passages containing commas, full stops and brackets.",
      };
    case "omission":
      return {
        kind: "omission",
        message:
          "You are skipping parts of the passage. Reduce speed slightly and read one word ahead.",
      };
    case "extra":
      return {
        kind: "substitution",
        message:
          "Extra characters or words are reducing accuracy. Slow down and match the passage exactly.",
      };
    default:
      return {
        kind: "substitution",
        message:
          "Repeated character substitutions are reducing accuracy. Practise the listed weak character patterns before the next timed test.",
      };
  }
}

function buildFocusedPractice(
  weakWords: WordMistake[],
  weakCharacters: CharacterMistake[],
  lang: AnalysisLang,
): string | undefined {
  const usefulWords = weakWords.filter(
    (w) => w.expected !== EXTRA_LABEL && w.expected !== MISSING_LABEL && w.expected.length > 1,
  );

  if (usefulWords.length >= 2) {
    const words = usefulWords.slice(0, 5).flatMap((w) => [w.expected, w.expected]);
    if (lang === "hi") {
      return `इन शब्दों का अभ्यास करें:\n${words.join(" ")}`;
    }
    return `Practice these words:\n${words.join(" ")}`;
  }

  if (weakCharacters.length >= 1 && usefulWords.length === 1) {
    const w = usefulWords[0].expected;
    if (lang === "hi") {
      return `इन शब्दों का अभ्यास करें:\n${w} ${w}`;
    }
    return `Practice these words:\n${w} ${w}`;
  }

  if (weakCharacters.length >= 2) {
    const patterns = weakCharacters
      .slice(0, 3)
      .map((c) => `${c.expected} → ${c.actual}`)
      .join(", ");
    if (lang === "hi") {
      return `इन अक्षर-पैटर्न का अभ्यास करें: ${patterns}`;
    }
    return `Practise these character patterns: ${patterns}`;
  }

  return undefined;
}

export function analyzeTypingText(
  rawTarget: string,
  rawTyped: string,
  options: AnalyzeTypingOptions = {},
): TypingAnalysis {
  const lang = options.lang ?? "en";
  const target = prepText(rawTarget, lang);
  const typed = prepText(rawTyped, lang);

  if (target.length > MAX_ANALYSIS_CHARS || typed.length > MAX_ANALYSIS_CHARS) {
    return emptyAnalysis(options, "Passage too long for detailed analysis.");
  }

  if (target === typed) {
    return emptyAnalysis(options);
  }

  const expectedWords = splitWords(target);
  const actualWords = splitWords(typed);
  const wordPairs = alignWords(expectedWords, actualWords);

  const fullOps = alignGraphemes(target, typed, lang);
  const mismatches: TypingMismatch[] = [];
  let charIndex = 0;

  for (const op of fullOps) {
    if (op.kind === "match") {
      charIndex++;
      continue;
    }
    const type = classifyMismatch(op.expected, op.actual);
    mismatches.push({
      index: charIndex,
      expected: op.expected,
      actual: op.actual,
      type,
    });
    charIndex++;
  }

  const categories: MistakeCategorySummary = {
    incorrectWords: 0,
    missingContent: 0,
    extraContent: 0,
    spacing: 0,
    punctuation: 0,
  };

  for (const pair of wordPairs) {
    if (pair.expected && pair.actual && pair.expected !== pair.actual) {
      categories.incorrectWords++;
    } else if (pair.expected && !pair.actual) {
      categories.missingContent++;
    } else if (!pair.expected && pair.actual) {
      categories.extraContent++;
    }
  }

  let substitutions = 0;
  let omissions = 0;
  let insertions = 0;
  let spacingErrors = 0;
  let punctuationErrors = 0;

  for (const row of mismatches) {
    switch (row.type) {
      case "substitution":
        substitutions++;
        break;
      case "omission":
        omissions++;
        break;
      case "insertion":
        insertions++;
        break;
      case "spacing":
        spacingErrors++;
        categories.spacing++;
        break;
      case "punctuation":
        punctuationErrors++;
        categories.punctuation++;
        break;
    }
  }

  const weakWords = aggregateWeakWords(wordPairs);
  const weakCharacters = aggregateWeakCharacters(mismatches);
  const repeatedPatterns = detectRepeatedPatterns(mismatches, lang);
  const recommendation = buildRecommendation(categories, mismatches, options);
  const focusedPracticeText = buildFocusedPractice(weakWords, weakCharacters, lang);

  return {
    totalMismatches: mismatches.length,
    substitutions,
    omissions,
    insertions,
    spacingErrors,
    punctuationErrors,
    categories,
    weakWords,
    weakCharacters,
    repeatedPatterns,
    recommendation,
    focusedPracticeText,
  };
}

function emptyAnalysis(options: AnalyzeTypingOptions, strongOverride?: string): TypingAnalysis {
  const categories: MistakeCategorySummary = {
    incorrectWords: 0,
    missingContent: 0,
    extraContent: 0,
    spacing: 0,
    punctuation: 0,
  };
  const recommendation: TypingRecommendation = strongOverride
    ? { kind: "strong", message: strongOverride }
    : buildRecommendation(categories, [], options);

  return {
    totalMismatches: 0,
    substitutions: 0,
    omissions: 0,
    insertions: 0,
    spacingErrors: 0,
    punctuationErrors: 0,
    categories,
    weakWords: [],
    weakCharacters: [],
    repeatedPatterns: [],
    recommendation,
  };
}

export function resolveAnalysisLang(result: {
  language: string;
  mode: string;
}): AnalysisLang {
  if (result.language === "Hindi" && result.mode === "Remington") return "kruti";
  if (result.language === "Hindi") return "hi";
  return "en";
}

export { MISSING_LABEL, EXTRA_LABEL, SPACE_LABEL };
