import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useCookieConsent } from "@/components/CookieConsent";
import { TaipoqLogo } from "@/components/TaipoqLogo";
import { BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { to: "/" as const, label: "Home", exact: true },
  { to: "/english/practice" as const, label: "Typing Practice" },
  { to: "/tests" as const, label: "Mock Tests" },
  { to: "/study-corner" as const, label: "Study" },
  { to: "/upcoming-exams" as const, label: "Job Updates" },
] as const;

const SECONDARY_LINKS = [
  { to: "/daily-mission" as const, label: "Daily Mission" },
  { to: "/typing-start-guide" as const, label: "Typing Guide" },
  { to: "/progress" as const, label: "Progress" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
  { to: "/privacy-policy" as const, label: "Privacy" },
] as const;

export const INFO_LINKS = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
  { to: "/privacy-policy" as const, label: "Privacy Policy" },
  { to: "/terms" as const, label: "Terms" },
  { to: "/disclaimer" as const, label: "Disclaimer" },
  { to: "/typing-tips" as const, label: "Typing Tips" },
  { to: "/daily-mission" as const, label: "Daily Mission" },
  { to: "/upcoming-exams" as const, label: "Job Updates" },
  { to: "/word-learning" as const, label: "Word Learning" },
  { to: "/study-corner" as const, label: "Study Corner" },
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

const linkClass =
  "rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white min-h-11 lg:min-h-0 lg:py-1.5 inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

const activeLinkClass =
  "rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-sm font-medium text-white min-h-11 lg:min-h-0 lg:py-1.5 inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        className="min-h-11 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="Close menu"
            onClick={close}
          />
          <div
            id={menuId}
            ref={panelRef}
            className={cn(
              "absolute right-0 z-50 mt-2 flex max-h-[min(80vh,32rem)] w-64 flex-col overflow-y-auto rounded-2xl border p-2 shadow-2xl shadow-black/30",
              NAVBAR_BG,
              NAVY_BORDER,
            )}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Main
            </p>
            {PRIMARY_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="min-h-11 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                activeProps={{ className: "rounded-lg bg-white/10 px-3 py-2 text-sm text-white" }}
                activeOptions={{ exact: "exact" in l && l.exact }}
                onClick={close}
              >
                {l.label}
              </Link>
            ))}
            <p className="mt-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              More
            </p>
            {SECONDARY_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="min-h-11 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                onClick={close}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

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
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md"
        >
          <div className="font-display text-lg font-extrabold tracking-tight text-white">TAIPOQ</div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-300">
            V1.0
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={linkClass}
              activeProps={{ className: activeLinkClass }}
              activeOptions={{ exact: "exact" in l && l.exact }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/english/practice"
            className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Start Typing
          </Link>
        </div>

        <MobileMenu />
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
            <p className="max-w-sm text-xs text-slate-400">
              Independent educational platform — not an official government website.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
            {INFO_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
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
