"use client";

import { Check } from "lucide-react";
import {
  DAILY_MISSION_CORE_TASK_ORDER,
  getDailyMissionTaskConfig,
  type DailyMissionState,
} from "@/lib/dailyMission";
import { cn } from "@/lib/utils";

type MissionProgressStepsProps = {
  state: DailyMissionState;
  nextTaskId: string | null;
  className?: string;
};

export function MissionProgressSteps({ state, nextTaskId, className }: MissionProgressStepsProps) {
  return (
    <div
      className={cn("grid grid-cols-3 gap-1.5 sm:gap-2", className)}
      role="list"
      aria-label="Core preparation progress"
    >
      {DAILY_MISSION_CORE_TASK_ORDER.map((id) => {
        const done = state.tasks[id].completed;
        const isNext = !done && id === nextTaskId;
        const config = getDailyMissionTaskConfig(id);
        const short =
          id === "typing" ? "Typing" : id === "currentAffairs" ? "Current Affairs" : "Mini Mock";

        return (
          <div
            key={id}
            role="listitem"
            aria-label={`${config.title}: ${done ? "completed" : isNext ? "current" : "incomplete"}`}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1.5 py-2 text-center motion-reduce:transition-none sm:px-2",
              done
                ? "border-primary/40 bg-primary/10"
                : isNext
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border/70 bg-muted/10",
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                done
                  ? "bg-primary text-primary-foreground"
                  : isNext
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
              aria-hidden="true"
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : "○"}
            </div>
            <span className="line-clamp-2 text-[10px] font-medium leading-tight text-foreground sm:text-xs">
              {short}
            </span>
          </div>
        );
      })}
    </div>
  );
}
