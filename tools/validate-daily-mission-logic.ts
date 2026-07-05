#!/usr/bin/env node
/**
 * Logic validation for TAIPOQ Daily Mission storage helpers (guided flow v2).
 * Run: npx tsx tools/validate-daily-mission-logic.ts
 */

import {
  createEmptyDailyMissionState,
  getCoreMissionCompletedCount,
  getCoreMissionProgressPercent,
  getCoreProgressLabel,
  getDailyMissionPrimaryCtaLabel,
  getDailyMissionPrimaryCtaRoute,
  getMissionStatusHeadline,
  getNextIncompleteCoreTask,
  getTodayDateKey,
  isDailyGoalAchieved,
  isFullMissionAchieved,
  isOptionalJobUpdateChecked,
  markDailyMissionTaskComplete,
  readDailyMissionState,
  validateDailyMissionState,
  formatTaskResultSummary,
  DAILY_MISSION_STORAGE_KEY,
} from "../src/lib/dailyMission.ts";

const errors: string[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) errors.push(message);
}

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

function withMockStorage(run: (memory: MemoryStorage) => void) {
  const memory = new MemoryStorage();
  const win = { localStorage: memory, dispatchEvent: () => true };
  const previousWindow = globalThis.window;
  const previousLocalStorage = globalThis.localStorage;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: win,
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: memory,
  });

  try {
    run(memory);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: previousWindow,
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: previousLocalStorage,
    });
  }
}

const today = getTodayDateKey();

withMockStorage((memory) => {
  const empty = createEmptyDailyMissionState(today);
  assert(empty.version === 2, "empty state version 2");
  assert(getCoreMissionCompletedCount(empty) === 0, "fresh day: 0 of 3");
  assert(isDailyGoalAchieved(empty) === false, "fresh day: daily goal not achieved");
  assert(isFullMissionAchieved(empty) === false, "fresh day: full mission not achieved");
  assert(getNextIncompleteCoreTask(empty) === "typing", "fresh day: CTA target typing");
  assert(getDailyMissionPrimaryCtaLabel(empty) === "Start with Typing Practice", "fresh CTA label");
  assert(getDailyMissionPrimaryCtaRoute(empty).kind === "path", "fresh CTA route typing path");

  markDailyMissionTaskComplete("typing", {
    source: "test",
    result: { netWpm: 31, accuracy: 94, elapsedSec: 180 },
  });
  const afterTyping = readDailyMissionState(today);
  assert(getCoreMissionCompletedCount(afterTyping) === 1, "typing: 1 of 3");
  assert(isDailyGoalAchieved(afterTyping) === true, "typing: daily goal achieved");
  assert(isFullMissionAchieved(afterTyping) === false, "typing: full mission not yet");
  assert(getNextIncompleteCoreTask(afterTyping) === "currentAffairs", "typing done: next CA");
  assert(
    getDailyMissionPrimaryCtaLabel(afterTyping) === "Continue with Current Affairs",
    "typing done: CTA label",
  );
  assert(
    formatTaskResultSummary("typing", afterTyping)?.includes("31 WPM"),
    "typing result summary",
  );

  markDailyMissionTaskComplete("typing", { source: "again" });
  assert(getCoreMissionCompletedCount(readDailyMissionState(today)) === 1, "typing idempotent");

  markDailyMissionTaskComplete("currentAffairs", {
    source: "ca",
    result: { score: 7, total: 10, percentage: 70 },
  });
  const afterCa = readDailyMissionState(today);
  assert(getCoreMissionCompletedCount(afterCa) === 2, "CA: 2 of 3");
  assert(getNextIncompleteCoreTask(afterCa) === "miniMock", "CA done: next mini mock");
  assert(
    getDailyMissionPrimaryCtaLabel(afterCa) === "Continue with Mini Mock Test",
    "CA done: CTA label",
  );

  markDailyMissionTaskComplete("miniMock", {
    result: { score: 8, total: 10, percentage: 80 },
  });
  const allCore = readDailyMissionState(today);
  assert(getCoreMissionCompletedCount(allCore) === 3, "all core: 3 of 3");
  assert(isFullMissionAchieved(allCore) === true, "all core: full mission");
  assert(getDailyMissionPrimaryCtaLabel(allCore) === "View Today's Results", "all core: results CTA");
  assert(getDailyMissionPrimaryCtaRoute(allCore).kind === "daily-mission", "all core: mission page");
  assert(getCoreMissionProgressPercent(allCore) === 100, "progress 100%");

  markDailyMissionTaskComplete("jobUpdate", { source: "vacancy" });
  const withJob = readDailyMissionState(today);
  assert(getCoreMissionCompletedCount(withJob) === 3, "job check does not inflate core count");
  assert(isOptionalJobUpdateChecked(withJob) === true, "optional job checked");

  const invalid = validateDailyMissionState("{not json", today);
  assert(invalid.date === today, "invalid JSON resets to today");

  const yesterday = validateDailyMissionState(
    {
      version: 1,
      date: "1999-01-01",
      tasks: {
        typing: { completed: true },
        currentAffairs: { completed: true },
        miniMock: { completed: true },
        jobUpdate: { completed: true },
      },
    },
    today,
  );
  assert(getCoreMissionCompletedCount(yesterday) === 0, "yesterday state resets");

  const migrated = validateDailyMissionState(
    {
      version: 1,
      date: today,
      tasks: { typing: { completed: true, completedAt: "2026-07-05T10:00:00.000Z" } },
    },
    today,
  );
  assert(migrated.tasks.typing.completed === true, "v1 migrates typing completion");
  assert(getMissionStatusHeadline(migrated) === "Daily goal achieved", "v1 migrated daily goal headline");
  assert(getCoreProgressLabel(afterCa).includes("2 of 3"), "core progress label format");

  const raw = memory.getItem(DAILY_MISSION_STORAGE_KEY);
  assert(typeof raw === "string" && raw.includes('"version":2'), "storage written as v2");
});

console.log("TAIPOQ — Daily Mission Logic Validation");
console.log("=".repeat(48));
console.log(`Errors: ${errors.length}`);

if (errors.length) {
  for (const e of errors) console.log(" -", e);
  process.exit(1);
}

console.log("PASS");
process.exit(0);
