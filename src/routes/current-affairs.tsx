import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/current-affairs")({
  head: () => ({
    meta: [{ title: "समसामयिक प्रश्नपत्र — TAIPOQ" }],
  }),
  component: () => <Outlet />,
});
