import {
  t03NearBaseProduct,
  t03OrdinaryProduct,
  t03RapidSteps,
} from "@/lib/math-speed-lab/formulas/t03";
import type { MslTechniqueMeta } from "@/lib/math-speed-lab/types";

export const T03_TECHNIQUE_ID = "MSL-T03-NEARBASE-100" as const;
export const T03_SLUG = "nearbase-100" as const;

export const T03_ATTRIBUTION =
  "Popularised in modern Vedic Mathematics teaching as near-base multiplication; this lab locks Base 100 Model A only (both factors in 90–99). Always verify with ordinary multiplication.";

export const T03_TECHNIQUE: MslTechniqueMeta = {
  techniqueId: T03_TECHNIQUE_ID,
  slug: T03_SLUG,
  order: 3,
  titleEn: "Near-Base Multiplication (Base 100)",
  titleHi: "आधार 100 के पास गुणा",
  shortDescription:
    "Multiply two numbers in 90–99 using base-100 deficits, a two-digit right block, and carry when needed.",
  learnerLevel: "Intermediate (after T02 Complements; two-digit multiplication)",
  attribution: T03_ATTRIBUTION,
  recognitionSignal:
    "Both factors are integers from 90 to 99 inclusive (both below base 100). Model A only — no above-base or mixed cases in this lab.",
  whenToUse: [
    "You need the exact product of two integers both in 90–99.",
    "You can form deficits from 100 and will verify with ordinary multiplication.",
  ],
  whenNotToUse: [
    "Either factor is below 90 or above 99 (including 100).",
    "Above-base or mixed above/below pairs (Model B/C and scaled bases are excluded).",
    "Bases other than 100 (10, 50, 200, 1000) or scaled-base shortcuts.",
  ],
  ordinaryMethod: "Multiply the two numbers: n × m.",
  rapidMethodSteps: [
    "Confirm both numbers are integers in 90–99.",
    "Compute deficits: d1 = 100 − n and d2 = 100 − m.",
    "Left raw: n − d2 (same as m − d1).",
    "Right raw: d1 × d2.",
    "Write the right block as exactly two digits (zero-pad if rightRaw < 100).",
    "If rightRaw ≥ 100, carry floor(rightRaw / 100) into the left part; right = rightRaw % 100.",
    "Final answer = left × 100 + right. Verify with ordinary multiplication.",
  ],
  whyItWorks:
    "Write n = 100 − d1 and m = 100 − d2 with positive deficits. Then n × m = 100(n − d2) + d1 × d2. When d1 × d2 ≥ 100, carry into the hundreds (left) place so the right block stays two digits. Equivalently (100 + a)(100 + b) = 100(100 + a + b) + ab with a = −d1 and b = −d2.",
  mathematicalIdentity:
    "n × m = 100(n − d2) + d1 × d2 where d1 = 100 − n and d2 = 100 − m (Model A)",
  verificationMethod: "Always check that the rapid result equals ordinary n × m.",
  commonErrors: [
    {
      code: "T03-ERR-WRONG-DEFICIT",
      description: "Computing the wrong deficit from 100 for either factor.",
    },
    {
      code: "T03-ERR-NO-LEADING-ZERO",
      description:
        "Dropping a leading zero in the two-digit right block (for example writing 6 instead of 06).",
    },
    {
      code: "T03-ERR-NO-CARRY",
      description:
        "Forgetting carry when rightRaw ≥ 100, especially for 90 × 90 where rightRaw = 100.",
    },
    {
      code: "T03-ERR-RANGE",
      description: "Using the method when either factor is outside 90–99.",
    },
    {
      code: "T03-ERR-BASE-50",
      description:
        "Applying a base-50 or other scaled-base shortcut instead of locked Model A base 100.",
    },
  ],
  guidedExamples: [
    {
      exampleId: "MSL-T03-GEX-001",
      techniqueId: T03_TECHNIQUE_ID,
      prompt: "98 × 97",
      orderedSteps: t03RapidSteps(98, 97),
      ordinaryVerification: (() => {
        const b = t03NearBaseProduct(98, 97);
        return `Ordinary: 98 × 97 = ${t03OrdinaryProduct(98, 97)}. Rapid: deficits ${b.deficit1} and ${b.deficit2}; right block ${b.rightBlock}; product ${b.product}.`;
      })(),
      edgeCaseFlag: false,
    },
    {
      exampleId: "MSL-T03-GEX-002",
      techniqueId: T03_TECHNIQUE_ID,
      prompt: "96 × 94",
      orderedSteps: t03RapidSteps(96, 94),
      ordinaryVerification: (() => {
        const b = t03NearBaseProduct(96, 94);
        return `Ordinary: 96 × 94 = ${t03OrdinaryProduct(96, 94)}. Rapid: deficits ${b.deficit1} and ${b.deficit2}; right block ${b.rightBlock}; product ${b.product}.`;
      })(),
      edgeCaseFlag: false,
    },
    {
      exampleId: "MSL-T03-GEX-003",
      techniqueId: T03_TECHNIQUE_ID,
      prompt: "90 × 90 (carry into left; right block 00)",
      orderedSteps: t03RapidSteps(90, 90),
      ordinaryVerification: (() => {
        const b = t03NearBaseProduct(90, 90);
        return `Ordinary: 90 × 90 = ${t03OrdinaryProduct(90, 90)}. Rapid: deficits 10 and 10; rightRaw = ${b.rightRaw}; carry ${b.carry}; right block ${b.rightBlock}; product ${b.product}.`;
      })(),
      edgeCaseFlag: true,
    },
  ],
  invalidExamples: [
    {
      exampleId: "MSL-T03-INV-001",
      techniqueId: T03_TECHNIQUE_ID,
      prompt: "88 × 97",
      reason:
        "88 is below 90, so the first operand is outside the locked Model A range 90–99. Do not apply this T03 method.",
    },
    {
      exampleId: "MSL-T03-INV-002",
      techniqueId: T03_TECHNIQUE_ID,
      prompt: "103 × 97",
      reason:
        "103 is above base 100 while 97 is below — a mixed above/below case excluded from Model A in the current supported practice set.",
    },
  ],
  masteryDirectPercent: 90,
  reviewRequiredBelowPercent: 70,
};
