import { t01OrdinarySquare, t01RapidSteps } from "@/lib/math-speed-lab/formulas/t01";
import type { MslDirectQuestion } from "@/lib/math-speed-lab/types";
import { T01_TECHNIQUE_ID } from "../techniques/t01-square-ending-5";

/** Deterministic canary set — one question per locked operand, fixed order. */
export const T01_DIRECT_QUESTIONS: MslDirectQuestion[] = [
  {
    questionId: "MSL-T01-DIR-001",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 15,
    prompt: "Find 15² (exact integer).",
    correctAnswer: t01OrdinarySquare(15),
    explanation:
      "Using the ending-in-5 identity, 15² = 225. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(15),
    ordinaryVerification: "15 × 15 = 225",
  },
  {
    questionId: "MSL-T01-DIR-002",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 25,
    prompt: "Find 25² (exact integer).",
    correctAnswer: t01OrdinarySquare(25),
    explanation:
      "Using the ending-in-5 identity, 25² = 625. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(25),
    ordinaryVerification: "25 × 25 = 625",
  },
  {
    questionId: "MSL-T01-DIR-003",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 35,
    prompt: "Find 35² (exact integer).",
    correctAnswer: t01OrdinarySquare(35),
    explanation:
      "Using the ending-in-5 identity, 35² = 1225. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(35),
    ordinaryVerification: "35 × 35 = 1225",
  },
  {
    questionId: "MSL-T01-DIR-004",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 45,
    prompt: "Find 45² (exact integer).",
    correctAnswer: t01OrdinarySquare(45),
    explanation:
      "Using the ending-in-5 identity, 45² = 2025. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(45),
    ordinaryVerification: "45 × 45 = 2025",
  },
  {
    questionId: "MSL-T01-DIR-005",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 55,
    prompt: "Find 55² (exact integer).",
    correctAnswer: t01OrdinarySquare(55),
    explanation:
      "Using the ending-in-5 identity, 55² = 3025. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(55),
    ordinaryVerification: "55 × 55 = 3025",
  },
  {
    questionId: "MSL-T01-DIR-006",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 65,
    prompt: "Find 65² (exact integer).",
    correctAnswer: t01OrdinarySquare(65),
    explanation:
      "Using the ending-in-5 identity, 65² = 4225. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(65),
    ordinaryVerification: "65 × 65 = 4225",
  },
  {
    questionId: "MSL-T01-DIR-007",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 75,
    prompt: "Find 75² (exact integer).",
    correctAnswer: t01OrdinarySquare(75),
    explanation:
      "Using the ending-in-5 identity, 75² = 5625. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(75),
    ordinaryVerification: "75 × 75 = 5625",
  },
  {
    questionId: "MSL-T01-DIR-008",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 85,
    prompt: "Find 85² (exact integer).",
    correctAnswer: t01OrdinarySquare(85),
    explanation:
      "Using the ending-in-5 identity, 85² = 7225. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(85),
    ordinaryVerification: "85 × 85 = 7225",
  },
  {
    questionId: "MSL-T01-DIR-009",
    techniqueId: T01_TECHNIQUE_ID,
    questionKind: "DIR",
    operand: 95,
    prompt: "Find 95² (exact integer).",
    correctAnswer: t01OrdinarySquare(95),
    explanation:
      "Using the ending-in-5 identity, 95² = 9025. Always verify with ordinary multiplication.",
    rapidMethodSteps: t01RapidSteps(95),
    ordinaryVerification: "95 × 95 = 9025",
  },
];
