import { createFileRoute, redirect } from "@tanstack/react-router";
import { MIXED_PAPER_ID } from "@/content/currentAffairsPapers";

export const Route = createFileRoute("/current-affairs-test")({
  beforeLoad: () => {
    throw redirect({
      to: "/current-affairs/paper/$paperId",
      params: { paperId: MIXED_PAPER_ID },
      search: { mode: "test" },
    });
  },
});
