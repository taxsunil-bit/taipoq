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

export const BRAND_TAGLINE = "Govt Job Computer & Typing Preparation";

/** Shared primary practice card — Calm Focus solid blue (legacy gradient retained for Tests hub). */
export const MAIN_ACTION_CARD =
  "bg-[#1D4ED8] text-white border border-[#93C5FD]/60 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-all duration-200 hover:bg-[#1E40AF] hover:shadow-[0_8px_22px_rgba(15,23,42,0.09)] hover:-translate-y-px";

export const MAIN_ACTION_SUBTITLE = "text-blue-100";

/** Tests hub only — same base blue; extra border/shadow/glow via badge + CTA. */
export const TESTS_HUB_CARD_HIGHLIGHT = "tests-hub-card-glow border-blue-200/50 shadow-blue-600/25";

export const TESTS_HUB_BADGE =
  "absolute right-3 top-3 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm";

/** Calm Focus product-tool card surfaces */
export const PRODUCT_CARD =
  "rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-all duration-200 hover:shadow-[0_8px_22px_rgba(15,23,42,0.09)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2";
