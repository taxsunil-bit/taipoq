import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/study-corner/computer-basics")({
  component: () => <Outlet />,
});
