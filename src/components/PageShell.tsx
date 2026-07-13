import type { ReactNode } from "react";
import { MobileBottomNav } from "./MobileBottomNav";
import { NavBar, Footer } from "./NavBar";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main
        id="main-content"
        role="main"
        aria-label="Main content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:py-8 md:pb-8"
      >
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  accent,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "english" | "hindi" | "neutral";
}) {
  const accentClass =
    accent === "english" ? "text-english" : accent === "hindi" ? "text-hindi" : "text-foreground";
  return (
    <div className="mb-4 md:mb-8">
      <h1
        className={`text-[28px] font-bold leading-tight tracking-tight sm:text-[32px] md:text-[36px] lg:text-[40px] ${accentClass}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-[15.5px] leading-relaxed text-muted-foreground md:mt-2 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
