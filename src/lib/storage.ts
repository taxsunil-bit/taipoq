// localStorage utilities for TAIPOQ (SSR-safe).

import type { MistakeRow } from "./typing-utils";
import type { AnalysisLang } from "./typingAnalysis";

export type Language = "English" | "Hindi";
export type HindiMode = "Unicode" | "Remington" | "Phonetic";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Legal Practice";

export type SavedResult = {
  id: string;
  date: string; // ISO
  language: Language;
  mode: string;
  title: string;
  kind: "lesson" | "practice" | "test";
  durationMin?: number;
  elapsedSec: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  total: number;
  correct: number;
  wrong: number;
  mistakes: number;
  backspaceAllowed: boolean;
  mistakeHighlight: boolean;
  passed: boolean;
  mistakeList: MistakeRow[];
  // Optional — stored for improvement analysis on /result (older records omit these).
  targetText?: string;
  typedText?: string;
  analysisLang?: AnalysisLang;
  // Optional — Phase 1 job-target feature. Older results have this undefined.
  targetWpm?: number;
  targetLabel?: string;
};

export type SavedParagraph = {
  id: string;
  title: string;
  language: Language;
  hindiMode?: HindiMode;
  difficulty: Difficulty;
  durationMin: number;
  text: string;
  active: boolean;
  createdAt: string;
};

export type SavedUser = { name: string; email?: string };

const KEY_RESULTS = "taipoq:results";
const KEY_PARAS = "taipoq:paragraphs";
const KEY_USER = "taipoq:user";
const KEY_LATEST = "taipoq:last-result";

function ls(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function read<T>(key: string, fallback: T): T {
  const s = ls();
  if (!s) return fallback;
  try {
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  const s = ls();
  if (!s) return;
  try {
    s.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

// ---------- Results ----------

export function saveResult(
  r: Omit<SavedResult, "id" | "date"> & Partial<Pick<SavedResult, "id" | "date">>,
): SavedResult {
  const all = getResults();
  const full: SavedResult = {
    id: r.id ?? "R-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    date: r.date ?? new Date().toISOString(),
    ...r,
  } as SavedResult;
  all.unshift(full);
  write(KEY_RESULTS, all.slice(0, 200));
  write(KEY_LATEST, full);
  return full;
}

export function getResults(): SavedResult[] {
  return read<SavedResult[]>(KEY_RESULTS, []);
}

export function getLatestResult(): SavedResult | null {
  return read<SavedResult | null>(KEY_LATEST, null);
}

export function getResultsByLanguage(lang: Language): SavedResult[] {
  return getResults().filter((r) => r.language === lang);
}

export function getLatestEligibleResult(minNet = 25, minAcc = 90): SavedResult | null {
  return getResults().find((r) => r.netWpm >= minNet && r.accuracy >= minAcc) ?? null;
}

// ---------- Paragraphs ----------

export function getParagraphs(): SavedParagraph[] {
  return read<SavedParagraph[]>(KEY_PARAS, []);
}

export function saveParagraph(
  p: Omit<SavedParagraph, "id" | "createdAt"> & Partial<Pick<SavedParagraph, "id" | "createdAt">>,
): SavedParagraph {
  const all = getParagraphs();
  const full: SavedParagraph = {
    id: p.id ?? "P-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    createdAt: p.createdAt ?? new Date().toISOString(),
    ...p,
  } as SavedParagraph;
  all.unshift(full);
  write(KEY_PARAS, all);
  return full;
}

export function updateParagraph(id: string, patch: Partial<SavedParagraph>) {
  const all = getParagraphs().map((p) => (p.id === id ? { ...p, ...patch } : p));
  write(KEY_PARAS, all);
}

export function deleteParagraph(id: string) {
  write(
    KEY_PARAS,
    getParagraphs().filter((p) => p.id !== id),
  );
}

export function getActiveParagraphs(lang?: Language): SavedParagraph[] {
  return getParagraphs().filter((p) => p.active && (!lang || p.language === lang));
}

// ---------- User ----------

export function saveUser(u: SavedUser) {
  write(KEY_USER, { name: u.name.trim(), ...(u.email ? { email: u.email.trim() } : {}) });
}

export function getUser(): SavedUser | null {
  const raw = read<unknown>(KEY_USER, null);
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.name !== "string") return null;
  const name = record.name.trim();
  if (!name) return null;
  const email = typeof record.email === "string" ? record.email.trim() : undefined;
  return email ? { name, email } : { name };
}

/** Drop legacy extra keys (e.g. password) from taipoq:user without changing parsed values. */
export function sanitizeStoredUser(): void {
  const user = getUser();
  if (!user) return;
  saveUser(user);
}

export function clearUser() {
  const s = ls();
  if (!s) return;
  try {
    s.removeItem(KEY_USER);
  } catch {
    /* ignore */
  }
}
