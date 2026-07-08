import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/math-speed-lab/square-ending-5")({
  head: () => ({
    meta: [
      { title: "Squares Ending in 5 — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Lesson and practice for exact squares of two-digit numbers ending in 5. Engineering canary.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
