import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/math-speed-lab/complements-10n/practice")({
  component: () => <Outlet />,
});
