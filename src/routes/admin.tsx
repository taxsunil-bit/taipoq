import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — TAIPOQ" }] }),
  component: () => <Outlet />,
});
