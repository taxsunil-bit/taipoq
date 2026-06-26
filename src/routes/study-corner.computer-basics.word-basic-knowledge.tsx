import { createFileRoute } from "@tanstack/react-router";
import { WordBasicKnowledgePage } from "@/components/WordBasicKnowledgePage";

export const Route = createFileRoute("/study-corner/computer-basics/word-basic-knowledge")({
  head: () => ({
    meta: [
      {
        title: "MS Word Basic Knowledge — पुस्तकालय / Library",
      },
      {
        name: "description",
        content:
          "Document typing, formatting, page setup, tables, print और file handling की मूलभूत जानकारी।",
      },
    ],
  }),
  component: WordBasicKnowledgePage,
});
