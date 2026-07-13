import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Blueprint: exactly five permanent mobile items. */
const NAV_ITEMS = [
  { to: "/", label: "Home", match: (path: string) => path === "/" },
  {
    to: "/tests",
    label: "Tests",
    match: (path: string) => path.startsWith("/tests") || path === "/test",
  },
  {
    to: "/daily-mission",
    label: "Mission",
    emphasize: true,
    match: (path: string) => path.startsWith("/daily-mission"),
  },
  {
    to: "/upcoming-exams",
    label: "Jobs",
    match: (path: string) => path.startsWith("/upcoming-exams"),
  },
  {
    to: "/login",
    label: "Profile",
    match: (path: string) => path.startsWith("/login") || path.startsWith("/progress"),
  },
] as const;

function NavIcon({ name }: { name: (typeof NAV_ITEMS)[number]["label"] }) {
  const className = "h-5 w-5 shrink-0";
  switch (name) {
    case "Home":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10"
          />
        </svg>
      );
    case "Tests":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M9 5h6M9 9h6M9 13h4M5 3h14a1 1 0 011 1v16l-4-2-4 2-4-2-4 2V4a1 1 0 011-1z"
          />
        </svg>
      );
    case "Mission":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "Jobs":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M4 7h16v12H4V7zm4-3h8v3H8V4z"
          />
        </svg>
      );
    case "Profile":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0"
          />
        </svg>
      );
  }
}

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const emphasize = "emphasize" in item && item.emphasize;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-[var(--text-secondary)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full",
                    active && "bg-[var(--cs-primary-container)]",
                    emphasize && !active && "bg-[var(--cs-accent-intelligence-soft)]",
                  )}
                >
                  {emphasize ? (
                    <span
                      className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--cs-accent-intelligence)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <NavIcon name={item.label} />
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
