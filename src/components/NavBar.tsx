import { Link } from "@tanstack/react-router";
import { useCookieConsent } from "@/components/CookieConsent";
import { TaipoqLogo } from "@/components/TaipoqLogo";
import { BRAND_TAGLINE } from "@/lib/brand";

const links = [
  { to: "/", label: "Home" },
  { to: "/english", label: "English" },
  { to: "/hindi", label: "Hindi" },
  { to: "/tests", label: "Tests" },
  { to: "/upcoming-exams", label: "आगामी परीक्षाएँ" },
  { to: "/word-learning", label: "शब्द अभ्यास" },
  { to: "/study-corner", label: "पुस्तकालय / Library" },
  { to: "/progress", label: "Progress" },
  { to: "/login", label: "Login" },
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
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      Cookie Preferences
    </button>
  );
}

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <TaipoqLogo
            variant="icon"
            width={44}
            height={44}
            className="h-9 w-9 rounded-xl border border-blue-400/20 bg-blue-600/10 object-contain md:h-11 md:w-11"
          />
          <div className="font-display text-lg font-extrabold tracking-tight text-white">TAIPOQ</div>
          <span className="ml-1 hidden rounded-full border border-border/80 bg-surface/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80 md:inline">
            v1.0
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              activeProps={{ className: "rounded-full px-3.5 py-1.5 text-sm font-medium bg-surface-hover text-foreground border border-border" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-border bg-surface px-4 py-1.5 text-sm">Menu</summary>
          <div className="absolute right-0 mt-2 flex w-56 flex-col rounded-2xl border border-border bg-popover p-2 shadow-2xl">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 text-sm hover:bg-surface-hover">
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
    <footer className="mt-20 border-t border-border/60 pb-20 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <TaipoqLogo variant="full" width={140} height={140} className="h-auto w-[140px] max-w-[160px]" />
            <div className="font-display font-bold">TAIPOQ</div>
            <div className="text-muted-foreground">{BRAND_TAGLINE}</div>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {INFO_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-muted-foreground transition-colors hover:text-foreground"
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <CookiePreferencesLink />
          </nav>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          © 2026 TAIPOQ. Created by Manas Dixit for job aspirants.
        </div>
      </div>
    </footer>
  );
}
