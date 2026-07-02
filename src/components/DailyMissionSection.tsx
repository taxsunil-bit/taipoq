"use client";

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDailyMission } from "@/hooks/useDailyMission";
import {
  DAILY_MISSION_TASKS,
  getDailyMissionTaskConfig,
  type DailyMissionTaskId,
} from "@/lib/dailyMission";
import { cn } from "@/lib/utils";

function DailyMissionPrimaryLink({
  taskId,
  label,
  className,
}: {
  taskId: DailyMissionTaskId | null;
  label: string;
  className?: string;
}) {
  if (!taskId) {
    return (
      <Link
        to="/daily-mission"
        className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto", className)}
      >
        {label}
      </Link>
    );
  }

  const config = getDailyMissionTaskConfig(taskId);

  if (config.linkParams) {
    return (
      <Link
        to="/tests/$subject/$paperId"
        params={{
          subject: config.linkParams.subject,
          paperId: config.linkParams.paperId,
        }}
        className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto", className)}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={config.href}
      className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto", className)}
    >
      {label}
    </Link>
  );
}

export function DailyMissionSection() {
  const { state, completedCount, total, nextTaskId, progressPercent, primaryCtaLabel, allComplete } =
    useDailyMission();

  return (
    <section
      className="bento-tile space-y-4 p-4 font-hindi sm:p-5"
      aria-labelledby="daily-mission-heading"
    >
      <div className="space-y-1">
        <h2 id="daily-mission-heading" className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Today&apos;s TAIPOQ Mission
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          चार छोटे कार्य — typing, Current Affairs, mini mock और verified job update — एक दिन में पूरा करें।
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2" aria-label="Daily mission tasks">
        {DAILY_MISSION_TASKS.map((task) => {
          const done = state.tasks[task.id].completed;
          return (
            <li
              key={task.id}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm",
                done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/70 bg-muted/10",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{task.effort}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    done
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground",
                  )}
                  aria-label={done ? `${task.title} completed` : `${task.title} not started`}
                >
                  {done ? "Completed" : "Not Started"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <p className="font-medium text-foreground">
            {completedCount} of {total} completed
          </p>
          <Link
            to="/daily-mission"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View mission page
          </Link>
        </div>
        <Progress
          value={progressPercent}
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Daily mission progress: ${completedCount} of ${total} tasks completed`}
          className="motion-reduce:transition-none"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DailyMissionPrimaryLink
          taskId={allComplete ? null : nextTaskId}
          label={primaryCtaLabel}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Progress refreshes automatically on the next local calendar date.
        </p>
      </div>
    </section>
  );
}

export function DailyMissionTaskAction({
  taskId,
  completed,
}: {
  taskId: DailyMissionTaskId;
  completed: boolean;
}) {
  const config = getDailyMissionTaskConfig(taskId);
  const label = completed ? "Review" : "आरम्भ";

  if (config.linkParams) {
    return (
      <Link
        to="/tests/$subject/$paperId"
        params={{
          subject: config.linkParams.subject,
          paperId: config.linkParams.paperId,
        }}
        className={cn(buttonVariants({ size: "sm" }), "min-h-10 w-full sm:w-auto")}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={config.href}
      className={cn(buttonVariants({ size: "sm" }), "min-h-10 w-full sm:w-auto")}
    >
      {label}
    </Link>
  );
}
