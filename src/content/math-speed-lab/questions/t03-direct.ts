import {
  t03NearBaseProduct,
  t03OrdinaryProduct,
  t03RapidSteps,
} from "@/lib/math-speed-lab/formulas/t03";
import type { MslDirectQuestion } from "@/lib/math-speed-lab/types";
import { T03_TECHNIQUE_ID } from "../techniques/t03-nearbase-100";

type T03Spec = {
  id: string;
  left: number;
  right: number;
};

const SPECS: T03Spec[] = [
  { id: "MSL-T03-DIR-001", left: 99, right: 98 },
  { id: "MSL-T03-DIR-002", left: 98, right: 97 },
  { id: "MSL-T03-DIR-003", left: 97, right: 96 },
  { id: "MSL-T03-DIR-004", left: 96, right: 94 },
  { id: "MSL-T03-DIR-005", left: 95, right: 93 },
  { id: "MSL-T03-DIR-006", left: 94, right: 92 },
  { id: "MSL-T03-DIR-007", left: 93, right: 91 },
  { id: "MSL-T03-DIR-008", left: 92, right: 90 },
  { id: "MSL-T03-DIR-009", left: 99, right: 90 },
  { id: "MSL-T03-DIR-010", left: 95, right: 95 },
  { id: "MSL-T03-DIR-011", left: 91, right: 91 },
  { id: "MSL-T03-DIR-012", left: 90, right: 90 },
];

function makeQuestion(spec: T03Spec): MslDirectQuestion {
  const b = t03NearBaseProduct(spec.left, spec.right);
  const ordinary = t03OrdinaryProduct(spec.left, spec.right);
  return {
    questionId: spec.id,
    techniqueId: T03_TECHNIQUE_ID,
    questionKind: "DIR",
    leftOperand: spec.left,
    rightOperand: spec.right,
    deficit1: b.deficit1,
    deficit2: b.deficit2,
    leftRaw: b.leftRaw,
    rightRaw: b.rightRaw,
    carry: b.carry,
    rightBlock: b.rightBlock,
    prompt: `Find ${spec.left} × ${spec.right} (exact integer).`,
    correctAnswer: ordinary,
    explanation: `Model A: deficits ${b.deficit1} and ${b.deficit2}; left raw ${b.leftRaw}; right raw ${b.rightRaw}; carry ${b.carry}; right block ${b.rightBlock}; product ${b.product}. Ordinary: ${spec.left} × ${spec.right} = ${ordinary}.`,
    rapidMethodSteps: t03RapidSteps(spec.left, spec.right),
    ordinaryVerification: `${spec.left} × ${spec.right} = ${ordinary}`,
  };
}

/** Deterministic T03 direct set — fixed order, no randomisation. */
export const T03_DIRECT_QUESTIONS: MslDirectQuestion[] = SPECS.map(makeQuestion);
