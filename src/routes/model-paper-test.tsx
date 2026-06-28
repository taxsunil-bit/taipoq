import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/model-paper-test")({
  beforeLoad: () => {
    throw redirect({ to: "/study-corner/general-awareness/model-test-01" });
  },
});
