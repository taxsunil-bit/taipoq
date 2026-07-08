import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/math-speed-lab")({
  head: () => ({
    meta: [
      { title: "Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Math Speed Lab engineering canary — Technique 1 (squares ending in 5). Exact arithmetic practice for competitive maths. Not an official examination product.",
      },
      { name: "robots", content: "noindex, nofollow" },
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
