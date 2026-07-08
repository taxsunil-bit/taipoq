export const T02_ALLOWED_BASES = [100, 1000] as const;
export type T02Base = (typeof T02_ALLOWED_BASES)[number];

export function isT02Base(n: number): n is T02Base {
  return (T02_ALLOWED_BASES as readonly number[]).includes(n);
}

export function isT02Operand(base: number, n: number): boolean {
  return isT02Base(base) && Number.isInteger(n) && n >= 1 && n < base;
}

/** Source of truth: complement = base − n */
export function t02Complement(base: number, n: number): number {
  if (!isT02Operand(base, n)) {
    throw new Error(
      `T02 complement requires base in {100,1000} and integer 1 ≤ n < base; got base=${base}, n=${n}`,
    );
  }
  return base - n;
}

export function t02Verify(
  base: number,
  n: number,
): {
  complement: number;
  sum: number;
  match: boolean;
} {
  const complement = t02Complement(base, n);
  const sum = n + complement;
  return { complement, sum, match: sum === base };
}

/**
 * Digitwise rapid description for teaching.
 * Algebraic result (base − n) remains authoritative — especially for zero endings.
 */
export function t02RapidSteps(base: T02Base, n: number): string[] {
  const complement = t02Complement(base, n);
  const width = base === 100 ? 2 : 3;
  const padded = String(n).padStart(width, "0");
  const hasZeroDigit = padded.includes("0");

  if (hasZeroDigit) {
    return [
      `Base is ${base}; operand n = ${n} satisfies 1 ≤ n < ${base}.`,
      `Operand ${n} contains a zero digit when written as ${padded}.`,
      `Do not trust a careless “all digits from 9 / final from 10” layout — a units contribution of 10 is not a single digit.`,
      `Use the algebraic source of truth: complement = ${base} − ${n} = ${complement}.`,
      `Ordinary check: ${base} − ${n} = ${complement}.`,
      `Verification: ${n} + ${complement} = ${base}.`,
    ];
  }

  const digits = padded.split("").map(Number);
  const digitNotes = digits.map((d, i) => {
    const isLast = i === digits.length - 1;
    if (isLast) {
      return `Final digit ${d}: subtract from 10 → ${10 - d}.`;
    }
    return `Digit ${d}: subtract from 9 → ${9 - d}.`;
  });

  return [
    `Base is ${base}; operand n = ${n} satisfies 1 ≤ n < ${base}.`,
    ...digitNotes,
    `Assemble the rapid digit result and confirm it equals ${complement}.`,
    `Ordinary check: ${base} − ${n} = ${complement}.`,
    `Verification: ${n} + ${complement} = ${base}.`,
  ];
}
