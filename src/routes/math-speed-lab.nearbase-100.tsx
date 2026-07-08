import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/math-speed-lab/nearbase-100")({
  head: () => ({
    meta: [
      { title: "Near-Base Multiplication (Base 100) — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content:
          "Lesson and practice for Base 100 Model A near-base multiplication (90–99). Engineering canary.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
