import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/math-speed-lab")({
  head: () => ({
    meta: [
      { title: "Math Speed Lab — TAIPOQ" },
      {
        name: "description",
        content:
          "Learn reliable calculation techniques through clear lessons, worked examples and direct practice on TAIPOQ Math Speed Lab.",
      },
    ],
  }),
  component: MathSpeedLabLayout,
});

function MathSpeedLabLayout() {
  return (
    <PageShell>
      <Outlet />
    </PageShell>
  );
}
