import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/math-speed-lab/complements-10n")({
  head: () => ({
    meta: [
      { title: "Complements to Powers of Ten — Math Speed Lab Canary | TAIPOQ" },
      {
        name: "description",
        content: "Lesson and practice for exact complements to 100 and 1000. Engineering canary.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
