import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/english")({
  head: () => ({ meta: [{ title: "English Typing — TAIPOQ" }] }),
  component: () => <Outlet />,
});
