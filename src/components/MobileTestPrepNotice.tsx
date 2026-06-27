import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const MOBILE_ACTION =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition-transform active:scale-[0.98]";

type MobileTestPrepNoticeProps = {
  practiceTo: string;
  onContinue: () => void;
};

export function MobileTestPrepNotice({ practiceTo, onContinue }: MobileTestPrepNoticeProps) {
  return (
    <section
      className="mb-6 space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40 md:hidden"
      aria-labelledby="mobile-test-prep-heading"
    >
      <h2 id="mobile-test-prep-heading" className="text-base font-semibold text-foreground">
        Using phone?
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Real typing exam practice is best on a computer keyboard. On phone, you can read passages, learn
        finger placement and understand speed targets.
      </p>
      <Link
        to="/typing-start-guide"
        className={cn(MOBILE_ACTION, "border border-border bg-surface text-foreground")}
      >
        Learn Finger Placement
      </Link>
      <Link to={practiceTo} className={cn(MOBILE_ACTION, "border border-border bg-surface text-foreground")}>
        Practice Passage
      </Link>
      <button
        type="button"
        onClick={onContinue}
        className={cn(MOBILE_ACTION, "bg-primary text-primary-foreground")}
      >
        Continue to Desktop Speed Test
      </button>
    </section>
  );
}
