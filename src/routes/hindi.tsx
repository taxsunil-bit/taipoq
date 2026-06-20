import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hindi")({
  head: () => ({ meta: [{ title: "Hindi Typing — TAIPOQ" }] }),
  component: () => <Outlet />,
});
