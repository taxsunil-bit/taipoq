/** Locked T01 operands — positive two-digit integers ending in 5. */
export const T01_ALLOWED_OPERANDS = [15, 25, 35, 45, 55, 65, 75, 85, 95] as const;

export type T01Operand = (typeof T01_ALLOWED_OPERANDS)[number];

export function isT01Operand(n: number): n is T01Operand {
  return (T01_ALLOWED_OPERANDS as readonly number[]).includes(n);
}

/** Ordinary exact square. */
export function t01OrdinarySquare(n: number): number {
  return n * n;
}

/**
 * Rapid identity: (10a + 5)² = 100·a·(a+1) + 25
 * where a = floor(n / 10) and n is in the locked canary operand set.
 * Unsupported ending-in-5 values (e.g. 5, 105) are rejected — not silently computed.
 */
export function t01RapidSquare(n: number): number {
  if (!Number.isInteger(n) || !isT01Operand(n)) {
    throw new Error(
      `T01 rapid square requires a locked canary operand (${T01_ALLOWED_OPERANDS.join(", ")}); got ${n}`,
    );
  }
  const a = Math.floor(n / 10);
  return 100 * a * (a + 1) + 25;
}

export function t01VerifyIdentity(n: number): {
  ordinary: number;
  rapid: number;
  match: boolean;
  endsIn5: boolean;
  inLockedSet: boolean;
} {
  const endsIn5 = n % 10 === 5;
  const inLockedSet = isT01Operand(n);
  const ordinary = t01OrdinarySquare(n);
  let rapid = Number.NaN;
  try {
    rapid = t01RapidSquare(n);
  } catch {
    rapid = Number.NaN;
  }
  return {
    ordinary,
    rapid,
    match: endsIn5 && ordinary === rapid,
    endsIn5,
    inLockedSet,
  };
}

export function t01RapidSteps(n: number): string[] {
  // Throws for unsupported operands (same guard as t01RapidSquare).
  const result = t01RapidSquare(n);
  const a = Math.floor(n / 10);
  const product = a * (a + 1);
  return [
    `Confirm ${n} ends in 5.`,
    `Remove the final 5 to obtain a = ${a}.`,
    `Calculate a × (a + 1) = ${a} × ${a + 1} = ${product}.`,
    `Append 25 → ${product}25 = ${result}.`,
    `Verify with ordinary multiplication: ${n} × ${n} = ${result}.`,
  ];
}
