import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function AdminDisabled() {
  return (
    <PageShell>
      <PageHeader
        title="Admin Panel Disabled"
        subtitle="The admin panel is disabled in this public demo. Paragraph management will be available only after secure admin login in the next version."
      />
      <Card className="mx-auto max-w-lg">
        <CardContent className="flex justify-center p-6">
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel Disabled — TAIPOQ" }] }),
  component: AdminDisabled,
});
