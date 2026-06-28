import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/study-corner/general-science")({
  component: () => <Outlet />,
});
