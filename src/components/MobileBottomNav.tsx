import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", match: (path: string) => path === "/" },
  {
    to: "/english",
    label: "Practice",
    match: (path: string) =>
      path.startsWith("/english") ||
      path.startsWith("/hindi") ||
      path.startsWith("/word-learning") ||
      path === "/test",
  },
  {
    to: "/study-corner",
    label: "Library",
    match: (path: string) => path.startsWith("/study-corner"),
  },
  { to: "/progress", label: "Progress", match: (path: string) => path.startsWith("/progress") },
] as const;

function NavIcon({ name }: { name: (typeof NAV_ITEMS)[number]["label"] }) {
  const className = "h-5 w-5 shrink-0";
  switch (name) {
    case "Home":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
        </svg>
      );
    case "Practice":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6v12m6-6H6" />
        </svg>
      );
    case "Library":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 19V5a1 1 0 011-1h5l2 2h7a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
        </svg>
      );
    case "Progress":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 17l4-4 4 4 8-10 4 4" />
        </svg>
      );
  }
}

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <NavIcon name={item.label} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
