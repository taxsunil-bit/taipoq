import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [{ title: "TAIPOQ Tests — परीक्षा अभ्यास" }],
  }),
  component: () => <Outlet />,
});
