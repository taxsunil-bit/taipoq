import type { ReactNode } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";

export function InfoPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-6 p-6 text-sm leading-relaxed text-muted-foreground md:p-8 md:text-base">
          {children}
        </CardContent>
      </Card>
    </PageShell>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function InfoList({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
