import { createFileRoute } from "@tanstack/react-router";
import { GeneralAwarenessTest } from "@/components/GeneralAwarenessTest";

export const Route = createFileRoute("/study-corner/general-awareness/model-test-01")({
  head: () => ({
    meta: [
      { title: "सामान्य जागरूकता मॉडल अभ्यास - 01 — TAIPOQ" },
      {
        name: "description",
        content:
          "50 प्रश्न, 40 मिनट, 100 अंक — SSC, रेलवे, CDS, NDA और UP परीक्षाओं की प्रवृत्ति पर आधारित online अभ्यास।",
      },
    ],
  }),
  component: ModelTestPage,
});

function ModelTestPage() {
  return <GeneralAwarenessTest dataUrl="/data/general-awareness/model-test-01.json" />;
}
