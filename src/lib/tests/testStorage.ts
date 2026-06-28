import type { TestAttemptResult } from "./testTypes";

const STORAGE_KEY = "taipoq-test-attempts-v1";

type StoredAttempts = Record<string, TestAttemptResult>;

function readAll(): StoredAttempts {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredAttempts;
  } catch {
    return {};
  }
}

function writeAll(data: StoredAttempts): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* never block UI */
  }
}

export function saveTestAttempt(result: TestAttemptResult): void {
  const key = `${result.subjectSlug}/${result.paperId}`;
  const all = readAll();
  all[key] = result;
  writeAll(all);
}

export function getTestAttempt(subjectSlug: string, paperId: string): TestAttemptResult | null {
  const key = `${subjectSlug}/${paperId}`;
  return readAll()[key] ?? null;
}

export function getLatestAttempts(limit = 10): TestAttemptResult[] {
  return Object.values(readAll())
    .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())
    .slice(0, limit);
}
