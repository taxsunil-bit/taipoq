export type NormalizeExactPositiveIntegerResult =
  | { ok: true; value: number; normalized: string }
  | { ok: false; reason: string };

/**
 * Exact positive integer normalisation for Math Speed Lab.
 *
 * Leading zeros: accepted mathematically and normalised (`0225` → `225`).
 * Rejects signs, decimals, commas, letters, scientific notation, and empty input.
 * No octal parsing — digit strings are base-10 after `/^\d+$/` validation.
 */
export function normalizeExactPositiveInteger(raw: string): NormalizeExactPositiveIntegerResult {
  if (typeof raw !== "string") {
    return { ok: false, reason: "Input must be a string." };
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: false, reason: "Answer is empty." };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      ok: false,
      reason: "Enter digits only (no signs, decimals, commas, or letters).",
    };
  }

  // Strip leading zeros safely; preserve a lone "0".
  const normalized = trimmed.replace(/^0+(?=\d)/, "");
  const value = Number(normalized);

  if (!Number.isSafeInteger(value) || value < 0) {
    return { ok: false, reason: "Value is not a safe non-negative integer." };
  }

  return { ok: true, value, normalized };
}

export function answersMatchExactPositiveInteger(raw: string, correctAnswer: number): boolean {
  const parsed = normalizeExactPositiveInteger(raw);
  if (!parsed.ok) return false;
  return parsed.value === correctAnswer;
}
