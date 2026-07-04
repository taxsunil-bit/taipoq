/** Production site URL for canonical and Open Graph links. */
export const SITE_URL = "https://www.taipoq.com";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/taipoq-logo-3d.png`;

export type SeoMetaOptions = {
  title: string;
  description: string;
  /** Pathname starting with / */
  path?: string;
  /** When true, omit canonical (e.g. user-specific result pages). */
  noIndex?: boolean;
};

export function buildSeoHead({ title, description, path = "/", noIndex = false }: SeoMetaOptions) {
  const canonical = `${SITE_URL}${path === "/" ? "" : path}`;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (noIndex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }
  const links: Array<Record<string, string>> = noIndex ? [] : [{ rel: "canonical", href: canonical }];
  return { meta, links };
}

/** Public routes included in sitemap.xml */
export const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/english",
  "/english/practice",
  "/english/lessons",
  "/hindi",
  "/hindi/practice",
  "/hindi/lessons",
  "/test",
  "/daily-mission",
  "/tests",
  "/study-corner",
  "/study-corner/general-awareness/model-test-01",
  "/study-corner/general-science/model-test-01",
  "/mock-test/current-affairs-pack-02",
  "/model-paper/current-affairs-pack-02",
  "/current-affairs",
  "/upcoming-exams",
  "/typing-start-guide",
  "/typing-tips",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/progress",
  "/certificate",
  "/word-learning",
] as const;
