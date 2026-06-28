import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/model-paper")({
  beforeLoad: () => {
    throw redirect({ to: "/study-corner/general-awareness" });
  },
});
