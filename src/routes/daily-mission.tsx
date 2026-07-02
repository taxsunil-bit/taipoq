import { createFileRoute, Link } from "@tanstack/react-router";
import { DailyMissionTaskAction } from "@/components/DailyMissionSection";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDailyMission } from "@/hooks/useDailyMission";
import { DAILY_MISSION_TASKS, getDailyMissionTaskConfig } from "@/lib/dailyMission";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/daily-mission")({
  head: () => ({
    meta: [
      { title: "Today's TAIPOQ Mission — TAIPOQ" },
      {
        name: "description",
        content:
          "Complete four daily tasks: typing practice, Current Affairs, mini mock test, and a verified job update.",
      },
    ],
  }),
  component: DailyMissionPage,
});

function DailyMissionPage() {
  const { state, completedCount, total, progressPercent, primaryCtaLabel, allComplete, nextTaskId } =
    useDailyMission();

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 font-hindi">
        <PageHeader
          title="Today's TAIPOQ Mission"
          subtitle="चार छोटे कार्य — प्रत्येक real action के बाद complete होगा।"
        />

        <div className="space-y-2 rounded-xl border border-border/70 bg-muted/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {completedCount} of {total} completed
            </p>
            {allComplete ? (
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                Mission Completed
              </Badge>
            ) : null}
          </div>
          <Progress
            value={progressPercent}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Daily mission progress: ${completedCount} of ${total} tasks completed`}
            className="motion-reduce:transition-none"
          />
          <p className="text-xs text-muted-foreground">
            Progress refreshes automatically on the next local calendar date.
          </p>
        </div>

        <div className="grid gap-4">
          {DAILY_MISSION_TASKS.map((task) => {
            const done = state.tasks[task.id].completed;
            return (
              <Card
                key={task.id}
                className={cn(
                  "border-border/70 shadow-sm",
                  done && "border-emerald-500/30 bg-emerald-500/5",
                )}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-foreground">{task.title}</h2>
                      <p className="text-sm text-muted-foreground">{task.purpose}</p>
                      <p className="text-xs text-muted-foreground">{task.effort}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        done
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "text-muted-foreground",
                      )}
                    >
                      {done ? "Completed" : "Not Started"}
                    </Badge>
                  </div>
                  <DailyMissionTaskAction taskId={task.id} completed={done} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!allComplete && nextTaskId ? (
            <DailyMissionContinueButton taskId={nextTaskId} label={primaryCtaLabel} />
          ) : null}
          {allComplete ? (
            <>
              <span className={cn(buttonVariants({ size: "lg" }), "pointer-events-none opacity-80")}>
                Mission Completed
              </span>
              <Link
                to="/test"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Continue Typing Practice
              </Link>
              <Link
                to="/tests"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                More Mock Tests
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

function DailyMissionContinueButton({
  taskId,
  label,
}: {
  taskId: NonNullable<ReturnType<typeof useDailyMission>["nextTaskId"]>;
  label: string;
}) {
  const config = getDailyMissionTaskConfig(taskId);

  if (config.linkParams) {
    return (
      <Link
        to="/tests/$subject/$paperId"
        params={{
          subject: config.linkParams.subject,
          paperId: config.linkParams.paperId,
        }}
        className={cn(buttonVariants({ size: "lg" }))}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link to={config.href} className={cn(buttonVariants({ size: "lg" }))}>
      {label}
    </Link>
  );
}
