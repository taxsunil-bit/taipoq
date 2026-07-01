import { createFileRoute } from "@tanstack/react-router";
import { CurrentAffairsPack02ModelPaperView } from "@/components/current-affairs-pack-02/CurrentAffairsPack02ModelPaperView";
import { PageShell } from "@/components/PageShell";
import { CURRENT_AFFAIRS_TOUGH_PACK_02 } from "@/content/tests/currentAffairsToughPack02";

export const Route = createFileRoute("/model-paper/current-affairs-pack-02")({
  head: () => ({
    meta: [
      { title: `${CURRENT_AFFAIRS_TOUGH_PACK_02.title} — Model Paper — TAIPOQ` },
      {
        name: "description",
        content: CURRENT_AFFAIRS_TOUGH_PACK_02.disclaimer,
      },
    ],
  }),
  component: ModelPaperPack02Page,
});

function ModelPaperPack02Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 overflow-x-hidden bg-slate-50 p-4 sm:p-6">
        <CurrentAffairsPack02ModelPaperView />
      </div>
    </PageShell>
  );
}
