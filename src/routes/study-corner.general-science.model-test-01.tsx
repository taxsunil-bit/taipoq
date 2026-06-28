import { createFileRoute } from "@tanstack/react-router";
import { GeneralAwarenessTest } from "@/components/GeneralAwarenessTest";
import { GENERAL_SCIENCE_TEST_DATA } from "@/content/generalScienceTestData";

export const Route = createFileRoute("/study-corner/general-science/model-test-01")({
  head: () => ({
    meta: [{ title: "General Science Test — TAIPOQ" }],
  }),
  component: ModelTestPage,
});

function ModelTestPage() {
  return <GeneralAwarenessTest dataUrl="/data/general-science/model-test-01.json" />;
}
