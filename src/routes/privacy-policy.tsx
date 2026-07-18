import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — keep for bookmarks; canonical privacy page is /privacy. */
export const Route = createFileRoute("/privacy-policy")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy" });
  },
  component: () => null,
});
