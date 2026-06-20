// Typing calculation + Unicode-safe text utilities.

export function normalize(s: string): string {
  return (s ?? "").normalize("NFC");
}

// Grapheme-aware split (handles Hindi matras / संयुक्ताक्षर more correctly).
export function toGraphemes(s: string, lang: "en" | "hi" = "en"): string[] {
  const n = normalize(s);
  // Intl.Segmenter is widely available in modern browsers.
  // For English we keep code-point splitting (faster, same result).
  if (lang === "hi" && typeof (Intl as any).Segmenter === "function") {
    try {
      const seg = new (Intl as any).Segmenter("hi", { granularity: "grapheme" });
      return Array.from(seg.segment(n), (x: any) => x.segment);
    } catch {
      /* fall through */
    }
  }
  return Array.from(n);
}

export type CharCompare = {
  expected: string;
  typed: string;
  status: "correct" | "wrong" | "pending";
  index: number;
};

export function compareTexts(target: string, typed: string, lang: "en" | "hi" = "en"): CharCompare[] {
  const t = toGraphemes(target, lang);
  const u = toGraphemes(typed, lang);
  return t.map((ch, i) => {
    if (i >= u.length) return { expected: ch, typed: "", status: "pending", index: i };
    return { expected: ch, typed: u[i], status: u[i] === ch ? "correct" : "wrong", index: i };
  });
}

export type LiveStats = {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  mistakes: number;
  correct: number;
  wrong: number;
  total: number;
  elapsedSec: number;
};

export function computeStats(
  target: string,
  typed: string,
  elapsedSec: number,
  lang: "en" | "hi" = "en"
): LiveStats {
  const t = toGraphemes(target, lang);
  const u = toGraphemes(typed, lang);
  let correct = 0;
  let wrong = 0;
  for (let i = 0; i < u.length; i++) {
    if (i < t.length && u[i] === t[i]) correct++;
    else wrong++;
  }
  const total = u.length;
  const minutes = Math.max(elapsedSec, 1) / 60;
  const gross = total > 0 ? total / 5 / minutes : 0;
  const net = total > 0 ? correct / 5 / minutes : 0;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  return {
    grossWpm: Math.max(0, Math.round(gross)),
    netWpm: Math.max(0, Math.round(net)),
    accuracy: Math.round(accuracy),
    mistakes: wrong,
    correct,
    wrong,
    total,
    elapsedSec: Math.max(0, Math.round(elapsedSec)),
  };
}

export type MistakeRow = {
  expected: string;
  typed: string;
  position: number;
  type: string;
};

export function buildMistakes(target: string, typed: string, lang: "en" | "hi" = "en"): MistakeRow[] {
  const t = toGraphemes(target, lang);
  const u = toGraphemes(typed, lang);
  const rows: MistakeRow[] = [];
  for (let i = 0; i < u.length; i++) {
    const exp = t[i] ?? "";
    const got = u[i];
    if (got !== exp) {
      rows.push({
        expected: exp,
        typed: got,
        position: i + 1,
        type: classifyError(exp, got),
      });
    }
  }
  return rows;
}

function classifyError(expected: string, typed: string): string {
  if (expected === " ") return "Missed space";
  if (typed === " ") return "Extra space";
  if (!expected) return "Extra character";
  if (!typed) return "Missing character";
  // Hindi-aware heuristics
  if (/[\u0900-\u097F]/.test(expected)) {
    if (/[\u093E-\u094F\u0955-\u0957]/.test(expected)) return "Matra error";
    if (expected.includes("\u094D") || typed.includes("\u094D")) return "Halant error";
    if (/[\u0902\u0901]/.test(expected)) return "Anuswar / Chandrabindu";
    return "Devanagari character";
  }
  return "Wrong character";
}
