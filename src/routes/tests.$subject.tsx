import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tests/$subject")({
  component: () => <Outlet />,
});
