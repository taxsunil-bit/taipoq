import { t02Complement, t02RapidSteps, type T02Base } from "@/lib/math-speed-lab/formulas/t02";
import type { MslDirectQuestion } from "@/lib/math-speed-lab/types";
import { T02_TECHNIQUE_ID } from "../techniques/t02-complements-10n";

type T02Spec = {
  id: string;
  base: T02Base;
  operand: number;
};

const SPECS: T02Spec[] = [
  { id: "MSL-T02-DIR-001", base: 100, operand: 23 },
  { id: "MSL-T02-DIR-002", base: 100, operand: 37 },
  { id: "MSL-T02-DIR-003", base: 100, operand: 46 },
  { id: "MSL-T02-DIR-004", base: 100, operand: 64 },
  { id: "MSL-T02-DIR-005", base: 100, operand: 75 },
  { id: "MSL-T02-DIR-006", base: 100, operand: 90 },
  { id: "MSL-T02-DIR-007", base: 1000, operand: 128 },
  { id: "MSL-T02-DIR-008", base: 1000, operand: 246 },
  { id: "MSL-T02-DIR-009", base: 1000, operand: 357 },
  { id: "MSL-T02-DIR-010", base: 1000, operand: 430 },
  { id: "MSL-T02-DIR-011", base: 1000, operand: 608 },
  { id: "MSL-T02-DIR-012", base: 1000, operand: 999 },
];

function makeQuestion(spec: T02Spec): MslDirectQuestion {
  const answer = t02Complement(spec.base, spec.operand);
  const zeroEnding = spec.operand % 10 === 0;
  return {
    questionId: spec.id,
    techniqueId: T02_TECHNIQUE_ID,
    questionKind: "DIR",
    base: spec.base,
    operand: spec.operand,
    prompt: `Find the complement of ${spec.operand} to ${spec.base} (exact integer).`,
    correctAnswer: answer,
    explanation: zeroEnding
      ? `Complement = ${spec.base} − ${spec.operand} = ${answer}. Zero-ending operands: use algebraic verification (n + complement = base), not an unchecked digitwise layout.`
      : `Complement = ${spec.base} − ${spec.operand} = ${answer}. Verify with ${spec.operand} + ${answer} = ${spec.base}.`,
    rapidMethodSteps: t02RapidSteps(spec.base, spec.operand),
    ordinaryVerification: `${spec.base} − ${spec.operand} = ${answer}; ${spec.operand} + ${answer} = ${spec.base}`,
  };
}

/** Deterministic T02 direct set — fixed order, no randomisation. */
export const T02_DIRECT_QUESTIONS: MslDirectQuestion[] = SPECS.map(makeQuestion);
