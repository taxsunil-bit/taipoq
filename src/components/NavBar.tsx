import { Link } from "@tanstack/react-router";
import { useCookieConsent } from "@/components/CookieConsent";
import { TaipoqLogo } from "@/components/TaipoqLogo";
import { BRAND_TAGLINE } from "@/lib/brand";
import { PYQ_GUIDE_PAPER_ID, PYQ_GUIDE_SUBJECT_SLUG } from "@/lib/tests/pyqGuide";

/** Blueprint desktop IA — real TAIPOQ areas only. */
const primaryLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/tests" as const, label: "Tests" },
  { to: "/study-corner" as const, label: "Learn" },
  { to: "/upcoming-exams" as const, label: "Jobs" },
  { to: "/daily-mission" as const, label: "Daily Mission" },
];

const utilityLinks = [
  { to: "/tests" as const, label: "Find Tests", ariaLabel: "Find tests and practice papers" },
  {
    to: "/login" as const,
    label: "My Progress",
    ariaLabel: "My Progress — local profile stored on this device",
  },
];

type FooterLink =
  | { to: "/tests"; label: string }
  | {
      to: "/tests/$subject/$paperId";
      label: string;
      params: { subject: string; paperId: string };
    }
  | { to: "/math-speed-lab"; label: string }
  | { to: "/upcoming-exams"; label: string }
  | { to: "/english/practice"; label: string }
  | { to: "/study-corner"; label: string }
  | { to: "/daily-mission"; label: string }
  | { to: "/about"; label: string }
  | { to: "/contact"; label: string }
  | { to: "/disclaimer"; label: string }
  | { to: "/privacy-policy"; label: string }
  | { to: "/terms"; label: string };

const FOOTER_GROUPS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { to: "/tests", label: "Tests" },
      {
        to: "/tests/$subject/$paperId",
        label: "PYQs",
        params: { subject: PYQ_GUIDE_SUBJECT_SLUG, paperId: PYQ_GUIDE_PAPER_ID },
      },
      { to: "/math-speed-lab", label: "Math Speed Lab" },
      { to: "/upcoming-exams", label: "Verified Jobs" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { to: "/english/practice", label: "Typing Practice" },
      { to: "/study-corner", label: "Library" },
      { to: "/daily-mission", label: "Daily Mission" },
    ],
  },
  {
    heading: "TAIPOQ",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/privacy-policy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

/** Kept for secondary discovery elsewhere if needed. */
export const INFO_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
  { to: "/privacy-policy" as const, label: "Privacy Policy" },
  { to: "/terms" as const, label: "Terms" },
  { to: "/disclaimer" as const, label: "Disclaimer" },
  { to: "/typing-tips" as const, label: "Typing Tips" },
  { to: "/upcoming-exams" as const, label: "Jobs" },
  { to: "/word-learning" as const, label: "Word Learning" },
  { to: "/study-corner" as const, label: "Learn / Library" },
  { to: "/english" as const, label: "English Typing" },
  { to: "/hindi" as const, label: "Hindi Typing" },
  { to: "/progress" as const, label: "Progress" },
] as const;

function CookiePreferencesLink() {
  const { openPreferences } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-slate-600 transition-colors hover:text-slate-900"
    >
      Cookie Preferences
    </button>
  );
}

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8]";
const navLinkActive = "rounded-lg bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1D4ED8]";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <TaipoqLogo variant="navbar" width={36} height={36} className="h-9 w-9" />
          <div className="font-display text-lg font-bold tracking-tight text-[#0F172A]">TAIPOQ</div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {primaryLinks.slice(0, 2).map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={navLinkClass}
              activeProps={{ className: navLinkActive }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/tests/$subject/$paperId"
            params={{ subject: PYQ_GUIDE_SUBJECT_SLUG, paperId: PYQ_GUIDE_PAPER_ID }}
            className={navLinkClass}
            activeProps={{ className: navLinkActive }}
          >
            PYQs
          </Link>
          {primaryLinks.slice(2).map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={navLinkClass}
              activeProps={{ className: navLinkActive }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          {utilityLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              aria-label={l.ariaLabel}
              className="min-h-11 rounded-lg px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              activeProps={{
                className:
                  "min-h-11 rounded-lg bg-[#F5F3FF] px-3 py-2 text-sm font-semibold text-[#7C3AED]",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <details className="relative lg:hidden">
          <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A]">
            Menu
          </summary>
          <div className="absolute right-0 z-50 mt-2 flex w-56 flex-col rounded-[14px] border border-[#E2E8F0] bg-white p-2 shadow-[0_8px_22px_rgba(15,23,42,0.09)]">
            {primaryLinks.slice(0, 2).map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#0F172A] hover:bg-[#EFF6FF]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/tests/$subject/$paperId"
              params={{ subject: PYQ_GUIDE_SUBJECT_SLUG, paperId: PYQ_GUIDE_PAPER_ID }}
              className="min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#0F172A] hover:bg-[#EFF6FF]"
            >
              PYQs
            </Link>
            {primaryLinks.slice(2).map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#0F172A] hover:bg-[#EFF6FF]"
              >
                {l.label}
              </Link>
            ))}
            {utilityLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="min-h-11 rounded-lg px-3 py-2.5 text-sm text-[#0F172A] hover:bg-[#EFF6FF]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E2E8F0] bg-white pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] text-[#0F172A] md:pb-8">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-sm md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
          <div className="space-y-2">
            <TaipoqLogo variant="navbar" width={40} height={40} className="h-10 w-10" />
            <div className="font-display font-bold">TAIPOQ</div>
            <p className="max-w-xs text-[#475569]">{BRAND_TAGLINE}</p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#0F172A]">
                {group.heading}
              </h2>
              <ul className="space-y-2">
                {group.links.map((l) => (
                  <li key={`${group.heading}-${l.label}`}>
                    {"params" in l && l.params ? (
                      <Link
                        to={l.to}
                        params={l.params}
                        className="text-[#475569] transition-colors hover:text-[#1D4ED8]"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-[#475569] transition-colors hover:text-[#1D4ED8]"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E2E8F0] pt-4 text-xs text-[#475569]">
          <CookiePreferencesLink />
          <p>© {new Date().getFullYear()} TAIPOQ. Created by Manas Dixit for job aspirants.</p>
        </div>
      </div>
    </footer>
  );
}
