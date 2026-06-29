import { Link } from "@tanstack/react-router";
import { useCookieConsent } from "@/components/CookieConsent";
import { TaipoqLogo } from "@/components/TaipoqLogo";
import { BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/english", label: "English" },
  { to: "/hindi", label: "Hindi" },
  { to: "/tests", label: "Tests" },
  { to: "/upcoming-exams", label: "आगामी परीक्षाएँ" },
  { to: "/word-learning", label: "शब्द अभ्यास" },
  { to: "/study-corner", label: "पुस्तकालय / Library" },
  { to: "/progress", label: "Progress" },
  { to: "/login", label: "Local Profile" },
] as const;

export const INFO_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
  { to: "/privacy-policy" as const, label: "Privacy Policy" },
  { to: "/terms" as const, label: "Terms" },
  { to: "/disclaimer" as const, label: "Disclaimer" },
  { to: "/typing-tips" as const, label: "Typing Tips" },
  { to: "/upcoming-exams" as const, label: "आगामी परीक्षाएँ" },
  { to: "/word-learning" as const, label: "शब्द अभ्यास / Word Learning" },
  { to: "/study-corner" as const, label: "पुस्तकालय / Library" },
] as const;

function CookiePreferencesLink() {
  const { openPreferences } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-slate-300 transition-colors hover:text-white"
    >
      Cookie Preferences
    </button>
  );
}

const NAVBAR_BG = "bg-[#08080B]";
const FOOTER_BG = "bg-[#071A3D]";
const NAVY_BORDER = "border-white/10";

export function NavBar() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur-md",
        NAVBAR_BG,
        NAVY_BORDER,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="font-display text-lg font-extrabold tracking-tight text-white">TAIPOQ</div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-300">
            V1.0
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              activeProps={{
                className:
                  "rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white">
            Menu
          </summary>
          <div
            className={cn(
              "absolute right-0 mt-2 flex w-56 flex-col rounded-2xl border p-2 shadow-2xl shadow-black/30",
              NAVBAR_BG,
              NAVY_BORDER,
            )}
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
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
    <footer className={cn("mt-20 border-t pb-20 md:pb-8", FOOTER_BG, NAVY_BORDER, "text-white")}>
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <TaipoqLogo variant="navbar" width={40} height={40} className="h-10 w-10" />
            <div className="font-display font-bold text-white">TAIPOQ</div>
            <div className="text-slate-300">{BRAND_TAGLINE}</div>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {INFO_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-slate-300 transition-colors hover:text-white"
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <CookiePreferencesLink />
          </nav>
        </div>
        <div className="font-mono text-xs text-slate-300">
          © 2026 TAIPOQ. Created by Manas Dixit for job aspirants.
        </div>
      </div>
    </footer>
  );
}
