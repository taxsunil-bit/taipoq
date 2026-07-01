import { createFileRoute } from "@tanstack/react-router";
import { CurrentAffairsPack02MockTestView } from "@/components/current-affairs-pack-02/CurrentAffairsPack02MockTestView";
import { PageShell } from "@/components/PageShell";
import { CURRENT_AFFAIRS_TOUGH_PACK_02 } from "@/content/tests/currentAffairsToughPack02";

export const Route = createFileRoute("/mock-test/current-affairs-pack-02")({
  head: () => ({
    meta: [
      { title: `${CURRENT_AFFAIRS_TOUGH_PACK_02.title} — Mock Test — TAIPOQ` },
      {
        name: "description",
        content: "30-minute tough current affairs mock test with score and answer review.",
      },
    ],
  }),
  component: MockTestPack02Page,
});

function MockTestPack02Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 overflow-x-hidden bg-slate-50 p-4 sm:p-6">
        <CurrentAffairsPack02MockTestView pack={CURRENT_AFFAIRS_TOUGH_PACK_02} />
      </div>
    </PageShell>
  );
}
