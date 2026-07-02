export type DailyMissionTaskId =
  | "typing"
  | "currentAffairs"
  | "miniMock"
  | "jobUpdate";

export type DailyMissionTaskState = {
  completed: boolean;
  completedAt?: string;
  source?: string;
};

export type DailyMissionState = {
  version: 1;
  date: string;
  tasks: Record<DailyMissionTaskId, DailyMissionTaskState>;
};

export const DAILY_MISSION_STORAGE_KEY = "taipoq.dailyMission.v1";
export const DAILY_MISSION_UPDATED_EVENT = "taipoq:daily-mission-updated";

export const DAILY_MISSION_TASK_ORDER: DailyMissionTaskId[] = [
  "typing",
  "currentAffairs",
  "miniMock",
  "jobUpdate",
];

export type DailyMissionTaskConfig = {
  id: DailyMissionTaskId;
  title: string;
  purpose: string;
  effort: string;
  href: string;
  linkTo?: string;
  linkParams?: Record<string, string>;
};

export const DAILY_MISSION_TASKS: DailyMissionTaskConfig[] = [
  {
    id: "typing",
    title: "Typing Practice",
    purpose: "Timed typing test — speed और accuracy जाँचें",
    effort: "≈ 10 minutes",
    href: "/test",
  },
  {
    id: "currentAffairs",
    title: "Current Affairs",
    purpose: "10-question Current Affairs test submit करें",
    effort: "10 questions",
    href: "/tests/$subject/$paperId",
    linkTo: "/tests/$subject/$paperId",
    linkParams: { subject: "current-affairs", paperId: "current-affairs-test-paper" },
  },
  {
    id: "miniMock",
    title: "Mini Mock Test",
    purpose: "Short mixed model paper — submit के बाद result देखें",
    effort: "10 questions · ≈ 15 minutes",
    href: "/tests/$subject/$paperId",
    linkTo: "/tests/$subject/$paperId",
    linkParams: { subject: "model-papers", paperId: "model-paper-01" },
  },
  {
    id: "jobUpdate",
    title: "Verified Job Update",
    purpose: "एक verified open vacancy का official source देखें",
    effort: "≈ 5 minutes",
    href: "/upcoming-exams",
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
    version: 1,
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

export function validateDailyMissionState(raw: unknown, today = getTodayDateKey()): DailyMissionState {
  if (!raw || typeof raw !== "object") {
    return createEmptyDailyMissionState(today);
  }

  const obj = raw as Partial<DailyMissionState>;
  if (obj.version !== 1 || typeof obj.date !== "string" || obj.date !== today) {
    return createEmptyDailyMissionState(today);
  }

  const base = createEmptyDailyMissionState(today);
  const tasks = obj.tasks;
  if (!tasks || typeof tasks !== "object") {
    return base;
  }

  for (const id of DAILY_MISSION_TASK_ORDER) {
    const entry = (tasks as Record<string, unknown>)[id];
    if (!entry || typeof entry !== "object") continue;
    const row = entry as DailyMissionTaskState;
    if (row.completed === true) {
      base.tasks[id] = {
        completed: true,
        completedAt: typeof row.completedAt === "string" ? row.completedAt : undefined,
        source: typeof row.source === "string" ? row.source : undefined,
      };
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
  meta?: { source?: string },
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
  };

  writeDailyMissionState(state);
  dispatchDailyMissionUpdated();
  return state;
}

export function getDailyMissionCompletedCount(state = readDailyMissionState()): number {
  return DAILY_MISSION_TASK_ORDER.filter((id) => state.tasks[id].completed).length;
}

export function getNextIncompleteDailyMissionTask(
  state = readDailyMissionState(),
): DailyMissionTaskId | null {
  return DAILY_MISSION_TASK_ORDER.find((id) => !state.tasks[id].completed) ?? null;
}

export function getDailyMissionProgressPercent(state = readDailyMissionState()): number {
  return Math.round((getDailyMissionCompletedCount(state) / DAILY_MISSION_TASK_ORDER.length) * 100);
}

export function getDailyMissionPrimaryCtaLabel(state = readDailyMissionState()): string {
  const completed = getDailyMissionCompletedCount(state);
  if (completed === 0) return "Start Today's Mission";
  if (completed >= DAILY_MISSION_TASK_ORDER.length) return "Mission Completed";
  return "Continue Today's Mission";
}

export function getDailyMissionTaskConfig(taskId: DailyMissionTaskId): DailyMissionTaskConfig {
  const task = DAILY_MISSION_TASKS.find((row) => row.id === taskId);
  if (!task) {
    return DAILY_MISSION_TASKS[0];
  }
  return task;
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
