#!/usr/bin/env node
/**
 * Logic validation for TAIPOQ Daily Mission storage helpers.
 * Run: npx tsx tools/validate-daily-mission-logic.ts
 */

import {
  createEmptyDailyMissionState,
  getDailyMissionCompletedCount,
  getDailyMissionPrimaryCtaLabel,
  getDailyMissionProgressPercent,
  getNextIncompleteDailyMissionTask,
  getTodayDateKey,
  markDailyMissionTaskComplete,
  readDailyMissionState,
  validateDailyMissionState,
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
  assert(empty.tasks.typing.completed === false, "empty typing incomplete");
  assert(empty.tasks.currentAffairs.completed === false, "empty CA incomplete");
  assert(empty.tasks.miniMock.completed === false, "empty mini mock incomplete");
  assert(empty.tasks.jobUpdate.completed === false, "empty job update incomplete");
  assert(getDailyMissionCompletedCount(empty) === 0, "empty count is 0");

  markDailyMissionTaskComplete("typing", { source: "test" });
  const afterTyping = readDailyMissionState(today);
  assert(afterTyping.tasks.typing.completed === true, "typing marked complete");
  assert(afterTyping.tasks.currentAffairs.completed === false, "CA still incomplete");
  assert(getDailyMissionCompletedCount(afterTyping) === 1, "count is 1");

  markDailyMissionTaskComplete("typing", { source: "again" });
  const idempotent = readDailyMissionState(today);
  assert(idempotent.tasks.typing.completed === true, "typing idempotent");
  assert(getDailyMissionCompletedCount(idempotent) === 1, "count still 1 after idempotent");

  markDailyMissionTaskComplete("currentAffairs", { source: "ca" });
  assert(getNextIncompleteDailyMissionTask() === "miniMock", "next task is miniMock");

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
  assert(getDailyMissionCompletedCount(yesterday) === 0, "yesterday state resets");

  markDailyMissionTaskComplete("miniMock");
  markDailyMissionTaskComplete("jobUpdate");
  const allDone = readDailyMissionState(today);
  assert(getDailyMissionCompletedCount(allDone) === 4, "all complete count is 4");
  assert(getNextIncompleteDailyMissionTask(allDone) === null, "no next task when complete");
  assert(getDailyMissionProgressPercent(allDone) === 100, "progress 100%");
  assert(getDailyMissionPrimaryCtaLabel(allDone) === "Mission Completed", "completed CTA label");

  const raw = memory.getItem(DAILY_MISSION_STORAGE_KEY);
  assert(typeof raw === "string" && raw.includes('"version":1'), "storage key written");
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
