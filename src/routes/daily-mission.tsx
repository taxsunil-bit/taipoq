import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DailyMissionTaskAction } from "@/components/DailyMissionSection";
import { MissionProgressSteps } from "@/components/MissionProgressSteps";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDailyMission } from "@/hooks/useDailyMission";
import {
  DAILY_MISSION_TASKS,
  formatTaskResultSummary,
  getDailyMissionPrimaryCtaRoute,
} from "@/lib/dailyMission";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/daily-mission")({
  head: () => ({
    meta: [
      { title: "Today's TAIPOQ Mission — TAIPOQ" },
      {
        name: "description",
        content:
          "Complete daily preparation: typing practice, current affairs, mini mock test, and optional verified job updates.",
      },
    ],
  }),
  component: DailyMissionPage,
});

function DailyMissionContinueButton({
  label,
  state,
}: {
  label: string;
  state: ReturnType<typeof useDailyMission>["state"];
}) {
  const route = getDailyMissionPrimaryCtaRoute(state);
  const btnClass = cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto");

  if (route.kind === "daily-mission") {
    return (
      <span className={cn(btnClass, "pointer-events-none opacity-90")} aria-current="page">
        {label}
      </span>
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

function DailyMissionPage() {
  const {
    state,
    coreCompletedCount,
    coreTotal,
    progressPercent,
    primaryCtaLabel,
    fullMissionComplete,
    dailyGoalAchieved,
    statusHeadline,
    coreProgressLabel,
    jobUpdateChecked,
    nextTaskId,
  } = useDailyMission();

  const coreTasks = DAILY_MISSION_TASKS.filter((t) => !t.optional);
  const optionalTasks = DAILY_MISSION_TASKS.filter((t) => t.optional);

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Today's TAIPOQ Mission"
          subtitle="Daily Goal: 3 preparation activities. Optional: review one verified job update."
        />

        <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Daily Goal: 3 preparation activities
              </p>
              <p className="text-sm font-medium">{coreProgressLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {dailyGoalAchieved ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                >
                  Daily Goal achieved
                </Badge>
              ) : null}
              {fullMissionComplete ? (
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                  Full Mission completed
                </Badge>
              ) : null}
            </div>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {statusHeadline}
          </p>
          <MissionProgressSteps state={state} nextTaskId={nextTaskId} />
          <p className="text-xs text-muted-foreground" aria-hidden="true">
            Progress: {progressPercent}% of core preparation ({coreCompletedCount}/{coreTotal})
          </p>
          <p className="text-xs text-muted-foreground">A new mission is available each day.</p>
        </div>

        <div className="grid gap-4">
          {coreTasks.map((task) => {
            const done = state.tasks[task.id].completed;
            const summary = formatTaskResultSummary(task.id, state);
            return (
              <Card
                key={task.id}
                className={cn(
                  "border-border/70 shadow-sm",
                  done && "border-primary/30 bg-primary/5",
                )}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-foreground">{task.title}</h2>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <p className="text-xs text-muted-foreground">{task.effort}</p>
                      {summary ? (
                        <p className="text-xs font-medium text-foreground">Result: {summary}</p>
                      ) : null}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        done
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {done ? "Completed" : "Not started"}
                    </Badge>
                  </div>
                  <DailyMissionTaskAction taskId={task.id} completed={done} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Optional opportunity check
          </p>
          {optionalTasks.map((task) => {
            const done = state.tasks[task.id].completed;
            return (
              <Card key={task.id} className="border-dashed border-border/80 shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-foreground">{task.title}</h2>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <p className="text-xs text-muted-foreground">{task.effort}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={done ? "text-primary" : "text-muted-foreground"}
                    >
                      {done ? "Checked" : "Not checked"}
                    </Badge>
                  </div>
                  <DailyMissionTaskAction taskId={task.id} completed={done} />
                </CardContent>
              </Card>
            );
          })}
          {!jobUpdateChecked ? (
            <p className="text-xs text-muted-foreground">
              Open an official vacancy notice or source link on the verified jobs page to mark this
              check complete.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!fullMissionComplete && nextTaskId ? (
            <DailyMissionContinueButton label={primaryCtaLabel} state={state} />
          ) : null}
          {fullMissionComplete ? (
            <>
              <Link
                to="/test"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                Continue Typing Practice
              </Link>
              <Link
                to="/tests"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                More Mock Tests
              </Link>
            </>
          ) : null}
          <Link
            to="/"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full sm:w-auto")}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
