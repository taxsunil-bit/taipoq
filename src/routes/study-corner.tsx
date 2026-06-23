import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/study-corner")({
  head: () => ({
    meta: [{ title: "पुस्तकालय / Library — TAIPOQ" }],
  }),
  component: () => <Outlet />,
});
