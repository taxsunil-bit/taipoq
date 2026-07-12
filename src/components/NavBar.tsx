import { Link } from "@tanstack/react-router";
import { useCookieConsent } from "@/components/CookieConsent";
import { TaipoqLogo } from "@/components/TaipoqLogo";
import { BRAND_TAGLINE } from "@/lib/brand";
import { PYQ_GUIDE_PAPER_ID, PYQ_GUIDE_SUBJECT_SLUG } from "@/lib/tests/pyqGuide";
import { cn } from "@/lib/utils";

/** Blueprint desktop IA — real TAIPOQ areas only. */
const primaryLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/tests" as const, label: "Tests" },
  { to: "/study-corner" as const, label: "Learn" },
  { to: "/upcoming-exams" as const, label: "Jobs" },
  { to: "/daily-mission" as const, label: "Daily Mission" },
];

const utilityLinks = [
  { to: "/tests" as const, label: "Search", ariaLabel: "Find tests and practice" },
  { to: "/login" as const, label: "Local Profile" },
];

/** Kept for footer secondary discovery (typing paths remain available). */
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
          <span className="hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#475569] sm:inline">
            V1.0
          </span>
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
              aria-label={"ariaLabel" in l ? l.ariaLabel : l.label}
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
          <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#0F172A]">
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
    <footer className="mt-16 border-t border-[#E2E8F0] bg-white pb-20 text-[#0F172A] md:pb-8">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 text-sm md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <TaipoqLogo variant="navbar" width={40} height={40} className="h-10 w-10" />
            <div className="font-display font-bold">TAIPOQ</div>
            <div className="text-[#475569]">{BRAND_TAGLINE}</div>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {INFO_LINKS.map((l) => (
              <Link
                key={`${l.to}-${l.label}`}
                to={l.to}
                className="text-[#475569] transition-colors hover:text-[#1D4ED8]"
              >
                {l.label}
              </Link>
            ))}
            <CookiePreferencesLink />
          </nav>
        </div>
        <p className="text-xs text-[#475569]">
          © {new Date().getFullYear()} TAIPOQ. Created by Manas Dixit for job aspirants.
        </p>
      </div>
    </footer>
  );
}
