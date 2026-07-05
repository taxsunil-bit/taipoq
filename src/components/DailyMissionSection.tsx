"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ClipboardList, Keyboard } from "lucide-react";
import { MissionProgressSteps } from "@/components/MissionProgressSteps";
import { buttonVariants } from "@/components/ui/button";
import { useDailyMission } from "@/hooks/useDailyMission";
import {
  DAILY_MISSION_CORE_TASK_ORDER,
  DAILY_MISSION_TASKS,
  formatTaskResultSummary,
  getDailyMissionPrimaryCtaRoute,
  getDailyMissionTaskConfig,
  type DailyMissionTaskId,
} from "@/lib/dailyMission";
import { cn } from "@/lib/utils";

const TASK_ICONS: Record<DailyMissionTaskId, typeof Keyboard> = {
  typing: Keyboard,
  currentAffairs: BookOpen,
  miniMock: ClipboardList,
  jobUpdate: ClipboardList,
};

function DailyMissionPrimaryLink({
  label,
  state,
  className,
}: {
  label: string;
  state: ReturnType<typeof useDailyMission>["state"];
  className?: string;
}) {
  const route = getDailyMissionPrimaryCtaRoute(state);
  const btnClass = cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto", className);

  if (route.kind === "daily-mission") {
    return (
      <Link to="/daily-mission" className={btnClass}>
        {label}
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Link>
    );
  }

  if (route.kind === "test-paper") {
    return (
      <Link
        to="/tests/$subject/$paperId"
        params={{ subject: route.subject, paperId: route.paperId }}
        className={btnClass}
      >
        {label}
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link to={route.href} className={btnClass}>
      {label}
      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function DailyMissionSection() {
  const {
    state,
    coreCompletedCount,
    coreTotal,
    nextTaskId,
    primaryCtaLabel,
    fullMissionComplete,
    dailyGoalAchieved,
    statusHeadline,
    coreProgressLabel,
    jobUpdateChecked,
  } = useDailyMission();

  const nextConfig = nextTaskId ? getDailyMissionTaskConfig(nextTaskId) : null;
  const NextIcon = nextTaskId ? TASK_ICONS[nextTaskId] : Keyboard;
  const upNext = DAILY_MISSION_CORE_TASK_ORDER.filter(
    (id) => id !== nextTaskId && !state.tasks[id].completed,
  );
  const jobTask = DAILY_MISSION_TASKS.find((t) => t.id === "jobUpdate")!;

  return (
    <section
      className="bento-tile space-y-4 p-4 sm:p-5"
      aria-labelledby="daily-mission-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 id="daily-mission-heading" className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Today&apos;s TAIPOQ Mission
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Complete focused preparation activities and keep your daily progress on track.
          </p>
        </div>
        <p
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
            fullMissionComplete
              ? "border-primary/40 bg-primary/10 text-primary"
              : dailyGoalAchieved
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-border bg-muted/20 text-muted-foreground",
          )}
          aria-live="polite"
        >
          {statusHeadline}
        </p>
      </div>

      {!fullMissionComplete && nextConfig && nextTaskId ? (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Next activity</p>
          <div className="mt-2 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary" aria-hidden="true">
              <NextIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-semibold text-foreground">{nextConfig.title}</p>
              <p className="text-sm text-muted-foreground">{nextConfig.description}</p>
              <p className="text-xs text-muted-foreground">Estimated time: {nextConfig.effort}</p>
            </div>
          </div>
          <div className="mt-4">
            <DailyMissionPrimaryLink label={primaryCtaLabel} state={state} />
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
          <p className="font-semibold text-foreground">Today&apos;s progress</p>
          <ul className="space-y-1 text-sm text-muted-foreground" aria-label="Today's mission results">
            {DAILY_MISSION_CORE_TASK_ORDER.map((id) => {
              const config = getDailyMissionTaskConfig(id);
              const summary = formatTaskResultSummary(id, state);
              return (
                <li key={id}>
                  <span className="text-foreground">{config.title}:</span>{" "}
                  {summary ?? "Not completed"}
                </li>
              );
            })}
          </ul>
          <DailyMissionPrimaryLink label={primaryCtaLabel} state={state} />
        </div>
      )}

      {upNext.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Up next</p>
          <ul className="space-y-1.5" aria-label="Upcoming mission tasks">
            {upNext.map((id) => {
              const config = getDailyMissionTaskConfig(id);
              return (
                <li
                  key={id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-muted-foreground/80" aria-hidden="true">
                    ○
                  </span>
                  <span>
                    {config.title} — {config.effort}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border border-dashed border-border/80 bg-muted/5 px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Optional opportunity check
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-foreground">{jobTask.title}</p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              jobUpdateChecked
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {jobUpdateChecked ? "Checked" : "Not checked"}
          </span>
        </div>
        {!jobUpdateChecked ? (
          <Link
            to="/upcoming-exams"
            className="mt-2 inline-flex text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Review verified job updates
          </Link>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-medium text-foreground">{coreProgressLabel}</p>
          <Link
            to="/daily-mission"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View mission details
          </Link>
        </div>
        <MissionProgressSteps state={state} nextTaskId={nextTaskId} />
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Daily Goal: {dailyGoalAchieved ? "Achieved" : "Not yet"}</span>
          <span aria-hidden="true">·</span>
          <span>
            Full Mission: {fullMissionComplete ? "Completed" : `${coreCompletedCount}/${coreTotal}`}
          </span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        A new mission is available each day.
      </p>
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
  const label = completed ? "Review" : "Start";

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
