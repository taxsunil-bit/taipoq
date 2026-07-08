/** Near-base multiplication — Base 100 Model A (both operands in 90–99). */

export function isT03Operand(n: number): boolean {
  return Number.isInteger(n) && n >= 90 && n <= 99;
}

export type T03Breakdown = {
  leftOperand: number;
  rightOperand: number;
  deficit1: number;
  deficit2: number;
  leftRaw: number;
  rightRaw: number;
  carry: number;
  leftFinal: number;
  rightBlock: string;
  product: number;
};

export function t03NearBaseProduct(n: number, m: number): T03Breakdown {
  if (!isT03Operand(n) || !isT03Operand(m)) {
    throw new Error(
      `T03 Model A requires both operands integers in 90–99 inclusive; got ${n} × ${m}`,
    );
  }

  const deficit1 = 100 - n;
  const deficit2 = 100 - m;
  const leftRaw = n - deficit2; // equals m - deficit1
  const rightRaw = deficit1 * deficit2;
  const carry = Math.floor(rightRaw / 100);
  const right = rightRaw % 100;
  const leftFinal = leftRaw + carry;
  const rightBlock = String(right).padStart(2, "0");
  const product = leftFinal * 100 + right;

  return {
    leftOperand: n,
    rightOperand: m,
    deficit1,
    deficit2,
    leftRaw,
    rightRaw,
    carry,
    leftFinal,
    rightBlock,
    product,
  };
}

export function t03OrdinaryProduct(n: number, m: number): number {
  return n * m;
}

export function t03Verify(
  n: number,
  m: number,
): {
  rapid: number;
  ordinary: number;
  match: boolean;
  breakdown: T03Breakdown;
} {
  const breakdown = t03NearBaseProduct(n, m);
  const ordinary = t03OrdinaryProduct(n, m);
  return {
    rapid: breakdown.product,
    ordinary,
    match: breakdown.product === ordinary,
    breakdown,
  };
}

export function t03RapidSteps(n: number, m: number): string[] {
  const b = t03NearBaseProduct(n, m);
  return [
    `Confirm both ${n} and ${m} are in 90–99.`,
    `Deficits: d1 = 100 − ${n} = ${b.deficit1}; d2 = 100 − ${m} = ${b.deficit2}.`,
    `Left raw: ${n} − ${b.deficit2} = ${b.leftRaw} (also ${m} − ${b.deficit1}).`,
    `Right raw: ${b.deficit1} × ${b.deficit2} = ${b.rightRaw}.`,
    b.carry > 0
      ? `Carry: floor(${b.rightRaw}/100) = ${b.carry} adds to left → ${b.leftFinal}; right block = ${b.rightBlock}.`
      : `Right block (two digits): ${b.rightBlock} (zero-pad if needed).`,
    `Final rapid answer: ${b.leftFinal}${b.rightBlock} = ${b.product}.`,
    `Ordinary check: ${n} × ${m} = ${b.product}.`,
  ];
}
