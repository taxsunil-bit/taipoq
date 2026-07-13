export const BRAND_ASSETS = {
  /** Blue app mark for dark UI (navbar, favicon, small marks). No wordmark in image. */
  navbarMark: "/brand/taipoq-navbar-mark.png",
  logoIcon: "/brand/taipoq-logo-icon.png",
  /** Full logo with dark navy wordmark — light/white backgrounds only. */
  logoFullLight: "/brand/taipoq-logo-full-light.png",
  /** Full logo with white wordmark — dark backgrounds when full lockup is needed. */
  logoFullDark: "/brand/taipoq-logo-full-dark.png",
  /** @deprecated use logoFullLight */
  logoFull: "/brand/taipoq-logo-full-light.png",
  logoSourceJpg: "/brand/taipoq-logo-source.jpg",
  /** Primary 3D brand logo — light backgrounds only (home, cards). Not for navbar/favicon. */
  logo3d: "/brand/taipoq-logo-3d.png",
} as const;

export const NAVBAR_MARK_SIZE = { mobile: 36, desktop: 40 } as const;

/** Public product identity — government-exam preparation (not typing-first). */
export const BRAND_TAGLINE =
  "Government exam preparation with verified jobs, PYQs and guided practice";

export const SITE_TITLE =
  "TAIPOQ — Government Exam Preparation, Verified Jobs, PYQs and Mock Tests";

export const SITE_DESCRIPTION =
  "Prepare for government exams with verified job updates, PYQs, mock tests, Daily Mission and Math Speed Lab on TAIPOQ.";

export const SITE_CANONICAL_URL = "https://www.taipoq.com/";

/** Level 1 — focus / principal active state */
export const FOCUS_CARD =
  "rounded-[20px] border border-[var(--border-focus)] bg-[var(--surface-focus)] shadow-[var(--shadow-subtle)] transition-all duration-[var(--duration-standard)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-focus)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/** Level 2 — standard product / feature cards */
export const PRODUCT_CARD =
  "rounded-2xl border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-subtle)] transition-all duration-[var(--duration-standard)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

/** Level 3 — compact utility rows */
export const UTILITY_ROW =
  "flex min-h-11 items-center gap-3 border-b border-[var(--border-subtle)] py-3 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/** Shared primary practice card — Calm Spatial primary blue */
export const MAIN_ACTION_CARD =
  "bg-primary text-primary-foreground border border-[var(--border-focus)] shadow-[var(--shadow-subtle)] transition-all duration-[var(--duration-standard)] hover:bg-[var(--cs-primary-hover)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-px";

export const MAIN_ACTION_SUBTITLE = "text-primary-foreground/80";

/** Tests hub highlight — restrained, no heavy glow */
export const TESTS_HUB_CARD_HIGHLIGHT =
  "border-[var(--border-focus)] shadow-[var(--shadow-subtle)]";

export const TESTS_HUB_BADGE =
  "absolute right-3 top-3 rounded-full border border-[var(--border-subtle)] bg-[var(--cs-primary-container)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--cs-on-primary-container)]";
