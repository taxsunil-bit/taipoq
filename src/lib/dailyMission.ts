export type DailyMissionTaskId =
  | "typing"
  | "currentAffairs"
  | "miniMock"
  | "jobUpdate";

export type DailyMissionTaskResult = {
  netWpm?: number;
  accuracy?: number;
  elapsedSec?: number;
  score?: number;
  total?: number;
  percentage?: number;
};

export type DailyMissionTaskState = {
  completed: boolean;
  completedAt?: string;
  source?: string;
  result?: DailyMissionTaskResult;
};

export type DailyMissionState = {
  version: 2;
  date: string;
  tasks: Record<DailyMissionTaskId, DailyMissionTaskState>;
};

export const DAILY_MISSION_STORAGE_KEY = "taipoq.dailyMission.v1";
export const DAILY_MISSION_UPDATED_EVENT = "taipoq:daily-mission-updated";

/** Core preparation sequence — verified jobs are optional and excluded from this order. */
export const DAILY_MISSION_CORE_TASK_ORDER: DailyMissionTaskId[] = [
  "typing",
  "currentAffairs",
  "miniMock",
];

export const DAILY_MISSION_OPTIONAL_TASK_IDS: DailyMissionTaskId[] = ["jobUpdate"];

/** All tasks for detail-page listing (core first, optional last). */
export const DAILY_MISSION_TASK_ORDER: DailyMissionTaskId[] = [
  ...DAILY_MISSION_CORE_TASK_ORDER,
  ...DAILY_MISSION_OPTIONAL_TASK_IDS,
];

export type DailyMissionTaskConfig = {
  id: DailyMissionTaskId;
  title: string;
  description: string;
  effort: string;
  href: string;
  linkTo?: string;
  linkParams?: Record<string, string>;
  optional?: boolean;
};

export const DAILY_MISSION_TASKS: DailyMissionTaskConfig[] = [
  {
    id: "typing",
    title: "Typing Practice",
    description: "Complete one typing practice session.",
    effort: "About 10 minutes",
    href: "/test",
  },
  {
    id: "currentAffairs",
    title: "Current Affairs",
    description: "Answer today's current-affairs questions.",
    effort: "10 questions",
    href: "/tests/$subject/$paperId",
    linkTo: "/tests/$subject/$paperId",
    linkParams: { subject: "current-affairs", paperId: "current-affairs-test-paper" },
  },
  {
    id: "miniMock",
    title: "Mini Mock Test",
    description: "Complete a short practice test.",
    effort: "10 questions · about 15 minutes",
    href: "/tests/$subject/$paperId",
    linkTo: "/tests/$subject/$paperId",
    linkParams: { subject: "model-papers", paperId: "model-paper-01" },
  },
  {
    id: "jobUpdate",
    title: "Verified Job Updates",
    description: "Review the latest verified opportunities.",
    effort: "About 5 minutes",
    href: "/upcoming-exams",
    optional: true,
  },
];

export const DAILY_MISSION_CA_PAPER = {
  subject: "current-affairs",
  paperId: "current-affairs-test-paper",
} as const;

export const DAILY_MISSION_MINI_MOCK_PAPER = {
  subject: "model-papers",
  paperId: "model-paper-01",
} as const;

function ls(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getTodayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function createEmptyDailyMissionState(date = getTodayDateKey()): DailyMissionState {
  return {
    version: 2,
    date,
    tasks: {
      typing: { completed: false },
      currentAffairs: { completed: false },
      miniMock: { completed: false },
      jobUpdate: { completed: false },
    },
  };
}

function isTaskId(value: unknown): value is DailyMissionTaskId {
  return (
    value === "typing" ||
    value === "currentAffairs" ||
    value === "miniMock" ||
    value === "jobUpdate"
  );
}

function normalizeTaskEntry(entry: unknown): DailyMissionTaskState {
  if (!entry || typeof entry !== "object") {
    return { completed: false };
  }
  const row = entry as DailyMissionTaskState & { result?: DailyMissionTaskResult };
  const result =
    row.result && typeof row.result === "object"
      ? {
          netWpm: typeof row.result.netWpm === "number" ? row.result.netWpm : undefined,
          accuracy: typeof row.result.accuracy === "number" ? row.result.accuracy : undefined,
          elapsedSec: typeof row.result.elapsedSec === "number" ? row.result.elapsedSec : undefined,
          score: typeof row.result.score === "number" ? row.result.score : undefined,
          total: typeof row.result.total === "number" ? row.result.total : undefined,
          percentage: typeof row.result.percentage === "number" ? row.result.percentage : undefined,
        }
      : undefined;

  return {
    completed: row.completed === true,
    completedAt: typeof row.completedAt === "string" ? row.completedAt : undefined,
    source: typeof row.source === "string" ? row.source : undefined,
    result: result && Object.values(result).some((v) => v !== undefined) ? result : undefined,
  };
}

export function validateDailyMissionState(raw: unknown, today = getTodayDateKey()): DailyMissionState {
  if (!raw || typeof raw !== "object") {
    return createEmptyDailyMissionState(today);
  }

  const obj = raw as { version?: number; date?: string; tasks?: Record<string, unknown> };
  const version = obj.version;
  if (version !== 1 && version !== 2) {
    return createEmptyDailyMissionState(today);
  }
  if (typeof obj.date !== "string" || obj.date !== today) {
    return createEmptyDailyMissionState(today);
  }

  const base = createEmptyDailyMissionState(today);
  const tasks = obj.tasks;
  if (!tasks || typeof tasks !== "object") {
    return base;
  }

  for (const id of DAILY_MISSION_TASK_ORDER) {
    const entry = tasks[id];
    if (!entry) continue;
    const normalized = normalizeTaskEntry(entry);
    if (normalized.completed) {
      base.tasks[id] = normalized;
    }
  }

  return base;
}

export function readDailyMissionState(today = getTodayDateKey()): DailyMissionState {
  const storage = ls();
  if (!storage) return createEmptyDailyMissionState(today);

  try {
    const raw = storage.getItem(DAILY_MISSION_STORAGE_KEY);
    if (!raw) return createEmptyDailyMissionState(today);
    return validateDailyMissionState(JSON.parse(raw), today);
  } catch {
    return createEmptyDailyMissionState(today);
  }
}

export function writeDailyMissionState(state: DailyMissionState): void {
  const storage = ls();
  if (!storage) return;
  try {
    storage.setItem(DAILY_MISSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / privacy mode
  }
}

export function dispatchDailyMissionUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DAILY_MISSION_UPDATED_EVENT));
}

export function markDailyMissionTaskComplete(
  taskId: DailyMissionTaskId,
  meta?: { source?: string; result?: DailyMissionTaskResult },
): DailyMissionState {
  if (!isTaskId(taskId)) {
    return readDailyMissionState();
  }

  const today = getTodayDateKey();
  const state = readDailyMissionState(today);
  const current = state.tasks[taskId];

  if (current.completed) {
    return state;
  }

  state.tasks[taskId] = {
    completed: true,
    completedAt: new Date().toISOString(),
    source: meta?.source,
    result: meta?.result,
  };

  writeDailyMissionState(state);
  dispatchDailyMissionUpdated();
  return state;
}

export function getCoreMissionCompletedCount(state = readDailyMissionState()): number {
  return DAILY_MISSION_CORE_TASK_ORDER.filter((id) => state.tasks[id].completed).length;
}

/** @deprecated Use getCoreMissionCompletedCount — core tasks only. */
export function getDailyMissionCompletedCount(state = readDailyMissionState()): number {
  return getCoreMissionCompletedCount(state);
}

export function isDailyGoalAchieved(state = readDailyMissionState()): boolean {
  return getCoreMissionCompletedCount(state) >= 1;
}

export function isFullMissionAchieved(state = readDailyMissionState()): boolean {
  return getCoreMissionCompletedCount(state) >= DAILY_MISSION_CORE_TASK_ORDER.length;
}

export function isOptionalJobUpdateChecked(state = readDailyMissionState()): boolean {
  return state.tasks.jobUpdate.completed === true;
}

export function getNextIncompleteCoreTask(
  state = readDailyMissionState(),
): DailyMissionTaskId | null {
  return DAILY_MISSION_CORE_TASK_ORDER.find((id) => !state.tasks[id].completed) ?? null;
}

/** @deprecated Use getNextIncompleteCoreTask — optional job update is never in the guided sequence. */
export function getNextIncompleteDailyMissionTask(
  state = readDailyMissionState(),
): DailyMissionTaskId | null {
  return getNextIncompleteCoreTask(state);
}

export function getCoreMissionProgressPercent(state = readDailyMissionState()): number {
  return Math.round(
    (getCoreMissionCompletedCount(state) / DAILY_MISSION_CORE_TASK_ORDER.length) * 100,
  );
}

/** @deprecated Use getCoreMissionProgressPercent. */
export function getDailyMissionProgressPercent(state = readDailyMissionState()): number {
  return getCoreMissionProgressPercent(state);
}

export function getCoreProgressLabel(state = readDailyMissionState()): string {
  const n = getCoreMissionCompletedCount(state);
  return `${n} of ${DAILY_MISSION_CORE_TASK_ORDER.length} preparation tasks completed`;
}

export function getMissionStatusHeadline(state = readDailyMissionState()): string {
  const core = getCoreMissionCompletedCount(state);
  if (core === 0) return "Start your first activity";
  if (isFullMissionAchieved(state)) return "Full mission completed";
  if (core === 1) return "Daily goal achieved";
  return getCoreProgressLabel(state);
}

export function getDailyMissionPrimaryCtaLabel(state = readDailyMissionState()): string {
  if (isFullMissionAchieved(state)) return "View Today's Results";

  const next = getNextIncompleteCoreTask(state);
  switch (next) {
    case "typing":
      return getCoreMissionCompletedCount(state) === 0
        ? "Start with Typing Practice"
        : "Continue with Typing Practice";
    case "currentAffairs":
      return "Continue with Current Affairs";
    case "miniMock":
      return "Continue with Mini Mock Test";
    default:
      return "View Today's Results";
  }
}

export function getDailyMissionPrimaryCtaRoute(
  state = readDailyMissionState(),
): { kind: "daily-mission" } | { kind: "path"; href: string } | { kind: "test-paper"; subject: string; paperId: string } {
  if (isFullMissionAchieved(state)) {
    return { kind: "daily-mission" };
  }

  const next = getNextIncompleteCoreTask(state);
  if (!next) {
    return { kind: "daily-mission" };
  }

  const config = getDailyMissionTaskConfig(next);
  if (config.linkParams) {
    return {
      kind: "test-paper",
      subject: config.linkParams.subject,
      paperId: config.linkParams.paperId,
    };
  }

  return { kind: "path", href: config.href };
}

export function getDailyMissionTaskConfig(taskId: DailyMissionTaskId): DailyMissionTaskConfig {
  const task = DAILY_MISSION_TASKS.find((row) => row.id === taskId);
  if (!task) {
    return DAILY_MISSION_TASKS[0];
  }
  return task;
}

export function formatTaskResultSummary(
  taskId: DailyMissionTaskId,
  state = readDailyMissionState(),
): string | null {
  const task = state.tasks[taskId];
  if (!task.completed) return null;

  const r = task.result;
  if (!r) return "Completed";

  switch (taskId) {
    case "typing":
      if (r.netWpm != null && r.accuracy != null) {
        return `${Math.round(r.netWpm)} WPM · ${Math.round(r.accuracy)}% accuracy`;
      }
      break;
    case "currentAffairs":
    case "miniMock":
      if (r.score != null && r.total != null) {
        const base = `${r.score}/${r.total}`;
        if (r.percentage != null) {
          return `${base} (${Math.round(r.percentage)}%)`;
        }
        return base;
      }
      break;
    case "jobUpdate":
      return "Reviewed";
    default:
      break;
  }

  return "Completed";
}

export function getTodayMissionSummaryLines(state = readDailyMissionState()): string[] {
  return DAILY_MISSION_CORE_TASK_ORDER.map((id) => {
    const config = getDailyMissionTaskConfig(id);
    const summary = formatTaskResultSummary(id, state);
    return summary ? `${config.title}: ${summary}` : `${config.title}: Not completed`;
  });
}

export function isDailyMissionCurrentAffairsPaper(subject: string, paperId: string): boolean {
  return (
    subject === DAILY_MISSION_CA_PAPER.subject &&
    paperId === DAILY_MISSION_CA_PAPER.paperId
  );
}

export function isDailyMissionMiniMockPaper(subject: string, paperId: string): boolean {
  return (
    subject === DAILY_MISSION_MINI_MOCK_PAPER.subject &&
    paperId === DAILY_MISSION_MINI_MOCK_PAPER.paperId
  );
}
