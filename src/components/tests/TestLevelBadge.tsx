import { getTestLevelLabel } from "@/content/tests/testLevels";
import { cn } from "@/lib/utils";

type TestLevelBadgeProps = {
  level: string;
  className?: string;
};

export function TestLevelBadge({ level, className }: TestLevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm",
        className,
      )}
    >
      {getTestLevelLabel(level)}
    </span>
  );
}
