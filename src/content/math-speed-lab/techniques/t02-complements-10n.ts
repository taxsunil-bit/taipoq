import { t02Complement, t02RapidSteps, type T02Base } from "@/lib/math-speed-lab/formulas/t02";
import type { MslTechniqueMeta } from "@/lib/math-speed-lab/types";

export const T02_TECHNIQUE_ID = "MSL-T02-COMPLEMENTS-10N" as const;
export const T02_SLUG = "complements-10n" as const;

export const T02_ATTRIBUTION =
  "Popularised in modern Vedic Mathematics teaching as complements of numbers from powers of ten; mathematically complement = base − n. Always verify with ordinary subtraction. This lab locks bases 100 and 1000 only.";

export const T02_TECHNIQUE: MslTechniqueMeta = {
  techniqueId: T02_TECHNIQUE_ID,
  slug: T02_SLUG,
  order: 2,
  titleEn: "Complements to Powers of Ten",
  titleHi: "दस की घात का पूरक",
  shortDescription: "Find how far a number is from 100 or 1000 using exact complement arithmetic.",
  learnerLevel: "Beginner–intermediate (after recognising place value)",
  attribution: T02_ATTRIBUTION,
  recognitionSignal:
    "You need the distance from a positive integer n to base 100 or 1000, where 1 ≤ n < base. The answer is the exact complement base − n.",
  whenToUse: [
    "You need the exact complement of n to 100 or 1000.",
    "You want a fast mental path and will verify with ordinary subtraction (or n + answer = base).",
  ],
  whenNotToUse: [
    "The base is not 100 or 1000 (for example base 10, 50, 200, or 10000 are outside the current supported range).",
    "The operand is outside 1 ≤ n < base (including n ≥ base).",
    "You need a non-integer or approximate complement.",
  ],
  ordinaryMethod:
    "Subtract the operand from the base: complement = base − n. Check that n + complement = base.",
  rapidMethodSteps: [
    "Confirm the base is 100 or 1000 and that 1 ≤ n < base.",
    "For teaching: subtract non-final digits from 9 and the final digit from 10.",
    "If n ends in zero, treat digitwise notes carefully — the algebraic result base − n remains the source of truth.",
    "Assemble the complement and verify with ordinary subtraction.",
  ],
  whyItWorks:
    "By definition the complement of n relative to base is the unique non-negative integer c such that n + c = base, so c = base − n. Digitwise “from 9 / from 10” shortcuts rearrange that same subtraction when digits are non-zero; zero endings still require the algebraic check.",
  mathematicalIdentity: "complement = base − n, with verification n + complement = base",
  verificationMethod: "Always check that base − n equals your answer and that n + answer = base.",
  commonErrors: [
    {
      code: "T02-ERR-WRONG-BASE",
      description: "Using a base outside the locked set (100 / 1000), such as 50 or 10000.",
    },
    {
      code: "T02-ERR-RANGE",
      description: "Accepting an operand with n ≥ base or n < 1.",
    },
    {
      code: "T02-ERR-ZERO-ENDING",
      description:
        "Trusting a digitwise layout that breaks on zero endings without checking base − n.",
    },
    {
      code: "T02-ERR-DIGITWISE-ONLY",
      description: "Skipping ordinary verification after a rapid digit rearrange.",
    },
  ],
  guidedExamples: [
    {
      exampleId: "MSL-T02-GEX-001",
      techniqueId: T02_TECHNIQUE_ID,
      prompt: "Complement of 64 to 100",
      orderedSteps: t02RapidSteps(100, 64),
      ordinaryVerification: `Ordinary: 100 − 64 = ${t02Complement(100, 64)}. Check: 64 + ${t02Complement(100, 64)} = 100.`,
      edgeCaseFlag: false,
    },
    {
      exampleId: "MSL-T02-GEX-002",
      techniqueId: T02_TECHNIQUE_ID,
      prompt: "Complement of 357 to 1000",
      orderedSteps: t02RapidSteps(1000, 357),
      ordinaryVerification: `Ordinary: 1000 − 357 = ${t02Complement(1000, 357)}. Check: 357 + ${t02Complement(1000, 357)} = 1000.`,
      edgeCaseFlag: false,
    },
    {
      exampleId: "MSL-T02-GEX-003",
      techniqueId: T02_TECHNIQUE_ID,
      prompt: "Complement of 430 to 1000 (zero-ending operand)",
      orderedSteps: t02RapidSteps(1000, 430),
      ordinaryVerification: `Ordinary truth: 1000 − 430 = ${t02Complement(1000, 430)}. Zero-ending operands can confuse a careless digitwise layout; always trust base − n. Check: 430 + ${t02Complement(1000, 430)} = 1000.`,
      edgeCaseFlag: true,
    },
  ],
  invalidExamples: [
    {
      exampleId: "MSL-T02-INV-001",
      techniqueId: T02_TECHNIQUE_ID,
      prompt: "Complement of 125 to 100",
      reason:
        "125 is not strictly less than base 100, so 1 ≤ n < base fails. This lab does not accept operands outside that range for complement practice.",
    },
    {
      exampleId: "MSL-T02-INV-002",
      techniqueId: T02_TECHNIQUE_ID,
      prompt: "Complement of 37 to 50",
      reason:
        "Base 50 is outside the current supported bases (only 100 and 1000). Do not apply this T02 lesson to arbitrary bases.",
    },
  ],
  masteryDirectPercent: 90,
  reviewRequiredBelowPercent: 70,
};

export type { T02Base };
