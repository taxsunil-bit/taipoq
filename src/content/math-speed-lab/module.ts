import { MSL_CONTENT_VERSION, MSL_MODULE_ID, type MslModuleMeta } from "@/lib/math-speed-lab/types";

export const MSL_MODULE_DISCLAIMER = `Math Speed Lab teaches rapid calculation methods for competitive arithmetic. Some methods in this module are teachable applications popularised through Bharati Krishna Tirtha’s twentieth-century system known as Vedic Mathematics. Their mathematical usefulness can be studied through algebraic identities and verified by ordinary arithmetic.

The complete modern Vedic Mathematics system, in its published teaching form, should not be presented as identical to surviving Vedic Samhita content. Historically documented Indian mathematics is a separate and broader tradition. This module does not claim endorsement by any examination body.`;

export const MSL_MODULE: MslModuleMeta = {
  moduleId: MSL_MODULE_ID,
  titleEn: "Math Speed Lab",
  titleHi: "गणना गति प्रयोगशाला",
  description:
    "Learn exact rapid-arithmetic methods with clear conditions, ordinary-method checks, and algebraic reasons. Local pilot canary for Techniques T01–T03 (direct practice). Pilot learning module with lessons and direct practice for calculation speed.",
  disclaimer: MSL_MODULE_DISCLAIMER,
  version: MSL_CONTENT_VERSION,
  status: "canary",
};
