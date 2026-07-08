import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/math-speed-lab/nearbase-100/practice")({
  component: () => <Outlet />,
});
