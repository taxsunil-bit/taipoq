import { Link } from "@tanstack/react-router";
import { useCookieConsent } from "@/components/CookieConsent";

const links = [
  { to: "/", label: "Home" },
  { to: "/english", label: "English" },
  { to: "/hindi", label: "Hindi" },
  { to: "/test", label: "Test" },
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
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
            T
          </div>
          <div className="font-display text-lg font-bold tracking-tight">TAIPOQ</div>
          <span className="ml-2 hidden rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
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
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-display font-bold">TAIPOQ</div>
            <div className="text-muted-foreground">Smart English and Hindi typing practice for students and job aspirants.</div>
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
