export { MSL_MODULE, MSL_MODULE_DISCLAIMER } from "./module";
export {
  T01_TECHNIQUE,
  T01_TECHNIQUE_ID,
  T01_SLUG,
  T01_ATTRIBUTION,
} from "./techniques/t01-square-ending-5";
export {
  T02_TECHNIQUE,
  T02_TECHNIQUE_ID,
  T02_SLUG,
  T02_ATTRIBUTION,
} from "./techniques/t02-complements-10n";
export {
  T03_TECHNIQUE,
  T03_TECHNIQUE_ID,
  T03_SLUG,
  T03_ATTRIBUTION,
} from "./techniques/t03-nearbase-100";
export { T01_DIRECT_QUESTIONS } from "./questions/t01-direct";
export { T02_DIRECT_QUESTIONS } from "./questions/t02-direct";
export { T03_DIRECT_QUESTIONS } from "./questions/t03-direct";

import type { MslDirectQuestion, MslTechniqueMeta } from "@/lib/math-speed-lab/types";
import { T01_TECHNIQUE } from "./techniques/t01-square-ending-5";
import { T02_TECHNIQUE } from "./techniques/t02-complements-10n";
import { T03_TECHNIQUE } from "./techniques/t03-nearbase-100";
import { T01_DIRECT_QUESTIONS } from "./questions/t01-direct";
import { T02_DIRECT_QUESTIONS } from "./questions/t02-direct";
import { T03_DIRECT_QUESTIONS } from "./questions/t03-direct";

export const MSL_PILOT_TECHNIQUES: MslTechniqueMeta[] = [
  T01_TECHNIQUE,
  T02_TECHNIQUE,
  T03_TECHNIQUE,
];

export function getTechniqueBySlug(slug: string): MslTechniqueMeta | undefined {
  return MSL_PILOT_TECHNIQUES.find((t) => t.slug === slug);
}

export function getDirectQuestionsForTechnique(
  techniqueId: MslTechniqueMeta["techniqueId"],
): MslDirectQuestion[] {
  switch (techniqueId) {
    case "MSL-T01-SQUARE-ENDING-5":
      return T01_DIRECT_QUESTIONS;
    case "MSL-T02-COMPLEMENTS-10N":
      return T02_DIRECT_QUESTIONS;
    case "MSL-T03-NEARBASE-100":
      return T03_DIRECT_QUESTIONS;
    default:
      return [];
  }
}
