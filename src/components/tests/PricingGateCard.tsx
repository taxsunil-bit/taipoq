import { getAccessRequirementLabel, getAccessRequirementLabelHi } from "@/lib/tests/testAccess";
import type { TestAccess } from "@/lib/tests/testTypes";
import { Button } from "@/components/ui/button";

type PricingGateCardProps = {
  access: TestAccess;
  title: string;
};

export function PricingGateCard({ access, title }: PricingGateCardProps) {
  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">Locked Test</p>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-base font-semibold text-amber-100">{getAccessRequirementLabel(access)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{getAccessRequirementLabelHi(access)}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Payment integration is not live yet. Basic tests remain unlimited and free.
      </p>
      <Button type="button" variant="outline" className="mt-4" disabled>
        View Test Pass — Coming soon
      </Button>
    </section>
  );
}
