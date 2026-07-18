// @ts-check
/**
 * Deterministic production sitemap builder for TAIPOQ.
 * No fabricated lastmod values — omit lastmod unless a reliable date exists.
 */

export const SITE_ORIGIN = "https://www.taipoq.com";

/** Subject title → public slug (mirrors src/content/tests/subjects.ts). */
const SUBJECT_SLUG_MAP = {
  Computer: "computer",
  "MS Word": "ms-word",
  Excel: "excel",
  "Typing Skill": "typing-skill",
  Reasoning: "reasoning",
  Maths: "maths",
  "General Awareness": "general-awareness",
  "General Science": "general-science",
  "Current Affairs": "current-affairs",
  Hindi: "hindi",
  English: "english",
  "UP GK": "up-gk",
  "Verified PYQ": "pyq-practice",
  "Model Papers": "model-papers",
};

function subjectSlug(subject) {
  return SUBJECT_SLUG_MAP[subject] ?? String(subject ?? "").toLowerCase().replace(/\s+/g, "-");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Core public hubs always included. */
export const STATIC_PUBLIC_PATHS = [
  "/",
  "/about",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/contact",
  "/tests",
  "/upcoming-exams",
  "/daily-mission",
  "/math-speed-lab",
  "/study-corner",
  "/english",
  "/english/practice",
  "/english/lessons",
  "/hindi",
  "/hindi/practice",
  "/hindi/lessons",
  "/current-affairs",
  "/typing-tips",
  "/typing-start-guide",
  "/word-learning",
];

/** Paths that must never appear in the sitemap. */
export const SITEMAP_EXCLUSIONS = [
  "/admin",
  "/login",
  "/progress",
  "/result",
  "/certificate",
  "/vacancies-preview",
  "/privacy-policy",
  "/test",
];

/**
 * @param {{ papers?: Array<{ subject?: string, paperId?: string, access?: string }> }} [pack]
 * @returns {string[]} absolute path list, sorted, unique, no query strings
 */
export function collectSitemapPaths(pack) {
  const paths = new Set(STATIC_PUBLIC_PATHS);

  for (const paper of pack?.papers ?? []) {
    const subject = subjectSlug(paper.subject);
    const paperId = String(paper.paperId ?? "").trim();
    if (!subject || !paperId) continue;
    // Index free/basic public papers; skip malformed ids.
    if (/[?#]/.test(paperId) || /[?#]/.test(subject)) continue;
    paths.add(`/tests/${subject}`);
    paths.add(`/tests/${subject}/${paperId}`);
  }

  // PYQ guide route (explicit for stability even if pack naming drifts).
  paths.add("/tests/pyq-practice");
  paths.add("/tests/pyq-practice/pyq-practice-test-paper");

  const sorted = [...paths].sort((a, b) => a.localeCompare(b));
  return sorted.filter((p) => !SITEMAP_EXCLUSIONS.some((ex) => p === ex || p.startsWith(`${ex}/`)));
}

/**
 * @param {string[]} paths
 * @param {string} [origin]
 */
export function buildSitemapXml(paths, origin = SITE_ORIGIN) {
  const unique = [];
  const seen = new Set();
  for (const path of paths) {
    if (!path || typeof path !== "string") continue;
    if (path.includes("?") || path.includes("#")) continue;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(normalized);
  }
  unique.sort((a, b) => a.localeCompare(b));

  const urls = unique
    .map((path) => {
      const loc = path === "/" ? `${origin}/` : `${origin}${path}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
