import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/math-speed-lab/square-ending-5/practice")({
  component: () => <Outlet />,
});
