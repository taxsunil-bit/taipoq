import {
  T01_ALLOWED_OPERANDS,
  t01OrdinarySquare,
  t01RapidSquare,
  t01RapidSteps,
} from "@/lib/math-speed-lab/formulas/t01";
import type { MslTechniqueMeta } from "@/lib/math-speed-lab/types";

export const T01_TECHNIQUE_ID = "MSL-T01-SQUARE-ENDING-5" as const;
export const T01_SLUG = "square-ending-5" as const;

export const T01_ATTRIBUTION =
  "Popularised in modern Vedic Mathematics teaching; mathematically based on an algebraic identity. Always verify with the ordinary method.";

export const T01_TECHNIQUE: MslTechniqueMeta = {
  techniqueId: T01_TECHNIQUE_ID,
  slug: T01_SLUG,
  order: 1,
  titleEn: "Squares Ending in 5",
  titleHi: "5 पर समाप्त संख्याओं का वर्ग",
  shortDescription:
    "Exact squares of two-digit numbers ending in 5, with ordinary multiplication checks.",
  learnerLevel: "Beginner (foundational rapid arithmetic)",
  attribution: T01_ATTRIBUTION,
  recognitionSignal:
    "The number is a positive two-digit integer that ends in 5 (15, 25, 35, 45, 55, 65, 75, 85, or 95 in this lab).",
  whenToUse: [
    "You need the exact square of a number that ends in 5.",
    "You want a fast mental method and will verify with ordinary multiplication.",
  ],
  whenNotToUse: [
    "The number does not end in 5.",
    "The task asks for a product of two different numbers instead of one square.",
    "Operands outside the locked canary set (only the nine two-digit endings in 5).",
  ],
  ordinaryMethod: "Multiply the number by itself: n × n.",
  rapidMethodSteps: [
    "Confirm the number ends in 5.",
    "Remove the final 5 to obtain a.",
    "Calculate a × (a + 1).",
    "Append 25.",
    "Verify with ordinary multiplication.",
  ],
  whyItWorks:
    "Write n = 10a + 5. Then n² = (10a + 5)² = 100a(a + 1) + 25. The left block is a(a + 1) and the right block is always 25.",
  mathematicalIdentity: "(10a + 5)² = 100a(a + 1) + 25",
  verificationMethod: "Always check that the rapid result equals n × n.",
  commonErrors: [
    {
      code: "T01-ERR-WRONG-A",
      description: "Forgetting to form a correctly, or using a + 1 incorrectly.",
    },
    {
      code: "T01-ERR-NO-APPEND",
      description: "Calculating a(a + 1) but forgetting to append 25.",
    },
    {
      code: "T01-ERR-MISAPPLY",
      description: "Applying the rule to a number that does not end in 5.",
    },
  ],
  guidedExamples: [
    {
      exampleId: "MSL-T01-GEX-001",
      techniqueId: T01_TECHNIQUE_ID,
      prompt: "Find 25²",
      orderedSteps: t01RapidSteps(25),
      ordinaryVerification: `Ordinary: 25 × 25 = ${t01OrdinarySquare(25)}. Rapid: a = 2; 2 × 3 = 6; append 25 → ${t01RapidSquare(25)}.`,
      edgeCaseFlag: false,
    },
    {
      exampleId: "MSL-T01-GEX-002",
      techniqueId: T01_TECHNIQUE_ID,
      prompt: "Find 65²",
      orderedSteps: t01RapidSteps(65),
      ordinaryVerification: `Ordinary: 65 × 65 = ${t01OrdinarySquare(65)}. Rapid: a = 6; 6 × 7 = 42; append 25 → ${t01RapidSquare(65)}.`,
      edgeCaseFlag: false,
    },
    {
      exampleId: "MSL-T01-GEX-003",
      techniqueId: T01_TECHNIQUE_ID,
      prompt: "Find 95²",
      orderedSteps: t01RapidSteps(95),
      ordinaryVerification: `Ordinary: 95 × 95 = ${t01OrdinarySquare(95)}. Rapid identity checks: a = 9; 9 × 10 = 90; append 25 → ${t01RapidSquare(95)}.`,
      edgeCaseFlag: true,
    },
  ],
  invalidExamples: [
    {
      exampleId: "MSL-T01-INV-001",
      techniqueId: T01_TECHNIQUE_ID,
      prompt: "46²",
      reason:
        "46 does not end in 5, so the ending-in-5 square shortcut does not apply. Use ordinary multiplication (or another valid method).",
    },
    {
      exampleId: "MSL-T01-INV-002",
      techniqueId: T01_TECHNIQUE_ID,
      prompt: "45 × 55",
      reason:
        "This asks for a product of two different numbers, not the square of one ending-in-5 number. The T01 square rule is for n² when n ends in 5.",
    },
  ],
  allowedOperands: T01_ALLOWED_OPERANDS,
  masteryDirectPercent: 90,
  reviewRequiredBelowPercent: 70,
};
