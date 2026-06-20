import type { ReactNode } from "react";
import { NavBar, Footer } from "./NavBar";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
      <Footer />
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
    accent === "english"
      ? "text-english"
      : accent === "hindi"
        ? "text-hindi"
        : "text-foreground";
  return (
    <div className="mb-8">
      <h1 className={`text-3xl font-bold tracking-tight md:text-4xl ${accentClass}`}>{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
