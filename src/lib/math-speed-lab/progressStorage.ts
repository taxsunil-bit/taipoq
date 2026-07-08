import {
  MSL_CONTENT_VERSION,
  MSL_MODULE_ID,
  MSL_STORAGE_KEY,
  type MslActiveDirectSession,
  type MslAttemptRecord,
  type MslProgressState,
  type MslProgressStoreV1,
  type MslTechniqueId,
  type MslTechniqueProgress,
} from "./types";

const MAX_RECENT_ATTEMPTS = 40;

const ALL_TECHNIQUE_IDS: MslTechniqueId[] = [
  "MSL-T01-SQUARE-ENDING-5",
  "MSL-T02-COMPLEMENTS-10N",
  "MSL-T03-NEARBASE-100",
];

function emptyProgress(techniqueId: MslTechniqueId): MslTechniqueProgress {
  return {
    techniqueId,
    state: "not_started",
    directScorePercent: null,
    directFirstPassCorrect: null,
    directTotal: null,
    completedQuestionIds: [],
    lastAttemptedAt: null,
    masteredAt: null,
    lessonOpened: false,
    practiceStarted: false,
    reviewRequired: false,
  };
}

export function createEmptyMslStore(): MslProgressStoreV1 {
  return {
    version: 1,
    moduleId: MSL_MODULE_ID,
    moduleContentVersion: MSL_CONTENT_VERSION,
    techniques: {},
    recentAttempts: [],
    activeDirectSessions: {},
    activeDirectSession: null,
  };
}

function ls(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function migrateActiveSessions(
  parsed: Partial<MslProgressStoreV1>,
): Partial<Record<MslTechniqueId, MslActiveDirectSession>> {
  const sessions: Partial<Record<MslTechniqueId, MslActiveDirectSession>> = {
    ...(parsed.activeDirectSessions ?? {}),
  };
  const legacy = parsed.activeDirectSession;
  if (legacy && legacy.techniqueId && !sessions[legacy.techniqueId]) {
    sessions[legacy.techniqueId] = legacy;
  }
  return sessions;
}

export function readMslStore(): MslProgressStoreV1 {
  const storage = ls();
  if (!storage) return createEmptyMslStore();

  try {
    const raw = storage.getItem(MSL_STORAGE_KEY);
    if (!raw) return createEmptyMslStore();
    const parsed = JSON.parse(raw) as Partial<MslProgressStoreV1>;

    if (parsed.version !== 1 || parsed.moduleId !== MSL_MODULE_ID) {
      return createEmptyMslStore();
    }

    return {
      version: 1,
      moduleId: MSL_MODULE_ID,
      moduleContentVersion:
        typeof parsed.moduleContentVersion === "string"
          ? parsed.moduleContentVersion
          : MSL_CONTENT_VERSION,
      techniques: parsed.techniques ?? {},
      recentAttempts: Array.isArray(parsed.recentAttempts)
        ? parsed.recentAttempts.slice(0, MAX_RECENT_ATTEMPTS)
        : [],
      activeDirectSessions: migrateActiveSessions(parsed),
      activeDirectSession: null,
    };
  } catch {
    return createEmptyMslStore();
  }
}

export function writeMslStore(store: MslProgressStoreV1): void {
  const storage = ls();
  if (!storage) return;
  try {
    const toWrite: MslProgressStoreV1 = {
      ...store,
      moduleContentVersion: MSL_CONTENT_VERSION,
      activeDirectSession: null,
    };
    storage.setItem(MSL_STORAGE_KEY, JSON.stringify(toWrite));
  } catch {
    /* never block UI */
  }
}

export function resetMslStore(): void {
  const storage = ls();
  if (!storage) return;
  try {
    storage.removeItem(MSL_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getTechniqueProgress(techniqueId: MslTechniqueId): MslTechniqueProgress {
  const store = readMslStore();
  return store.techniques[techniqueId] ?? emptyProgress(techniqueId);
}

/** @deprecated Prefer getTechniqueProgress */
export function getT01Progress(): MslTechniqueProgress {
  return getTechniqueProgress("MSL-T01-SQUARE-ENDING-5");
}

function saveTechniqueProgress(progress: MslTechniqueProgress, attempt?: MslAttemptRecord): void {
  const store = readMslStore();
  store.techniques[progress.techniqueId] = progress;
  if (attempt) {
    store.recentAttempts = [attempt, ...store.recentAttempts].slice(0, MAX_RECENT_ATTEMPTS);
  }
  writeMslStore(store);
}

export function markLessonOpened(techniqueId: MslTechniqueId): MslTechniqueProgress {
  const current = getTechniqueProgress(techniqueId);
  if (current.state === "not_started") {
    current.state = "learning";
  }
  current.lessonOpened = true;
  saveTechniqueProgress(current);
  return current;
}

/** @deprecated Prefer markLessonOpened */
export function markT01LessonOpened(): MslTechniqueProgress {
  return markLessonOpened("MSL-T01-SQUARE-ENDING-5");
}

export function markPracticeStarted(techniqueId: MslTechniqueId): MslTechniqueProgress {
  const current = getTechniqueProgress(techniqueId);
  current.practiceStarted = true;
  if (current.state === "not_started" || current.state === "learning") {
    current.state = "practising";
  }
  current.lastAttemptedAt = new Date().toISOString();
  saveTechniqueProgress(current);
  return current;
}

/** @deprecated Prefer markPracticeStarted */
export function markT01PracticeStarted(): MslTechniqueProgress {
  return markPracticeStarted("MSL-T01-SQUARE-ENDING-5");
}

export function recordAttempt(attempt: MslAttemptRecord): void {
  const current = getTechniqueProgress(attempt.techniqueId);
  current.lastAttemptedAt = attempt.timestamp;
  if (!current.practiceStarted) {
    current.practiceStarted = true;
    if (current.state === "not_started" || current.state === "learning") {
      current.state = "practising";
    }
  }
  saveTechniqueProgress(current, attempt);
}

/** @deprecated Prefer recordAttempt */
export function recordT01Attempt(attempt: MslAttemptRecord): void {
  recordAttempt(attempt);
}

export function completeDirectSet(
  techniqueId: MslTechniqueId,
  args: {
    firstPassCorrect: number;
    total: number;
    accuracyPercent: number;
    completedQuestionIds: string[];
    state: MslProgressState;
  },
): MslTechniqueProgress {
  const current = getTechniqueProgress(techniqueId);
  const previouslyMastered = current.state === "mastered" || Boolean(current.masteredAt);

  current.directFirstPassCorrect = args.firstPassCorrect;
  current.directTotal = args.total;
  current.directScorePercent = args.accuracyPercent;
  current.completedQuestionIds = args.completedQuestionIds;
  current.lastAttemptedAt = new Date().toISOString();
  current.state = args.state;
  current.reviewRequired = args.state === "review_required";

  if (args.state === "mastered") {
    current.masteredAt = current.masteredAt ?? new Date().toISOString();
  } else if (args.state === "review_required") {
    /* keep masteredAt history */
  } else if (!previouslyMastered) {
    current.masteredAt = null;
  }

  const store = readMslStore();
  store.techniques[techniqueId] = current;
  const sessions = { ...(store.activeDirectSessions ?? {}) };
  delete sessions[techniqueId];
  store.activeDirectSessions = sessions;
  writeMslStore(store);
  return current;
}

/** @deprecated Prefer completeDirectSet */
export function completeT01DirectSet(args: {
  firstPassCorrect: number;
  total: number;
  accuracyPercent: number;
  completedQuestionIds: string[];
  state: MslProgressState;
}): MslTechniqueProgress {
  return completeDirectSet("MSL-T01-SQUARE-ENDING-5", args);
}

/** Restart one technique's direct practice only. */
export function resetDirectPracticeScores(techniqueId: MslTechniqueId): MslTechniqueProgress {
  const current = getTechniqueProgress(techniqueId);
  current.directScorePercent = null;
  current.directFirstPassCorrect = null;
  current.directTotal = null;
  current.completedQuestionIds = [];
  if (current.state === "proficient" || current.state === "mastered") {
    current.state = "practising";
  }

  const store = readMslStore();
  store.techniques[techniqueId] = current;
  const sessions = { ...(store.activeDirectSessions ?? {}) };
  delete sessions[techniqueId];
  store.activeDirectSessions = sessions;
  writeMslStore(store);
  return current;
}

/** @deprecated Prefer resetDirectPracticeScores */
export function resetT01DirectPracticeScores(): MslTechniqueProgress {
  return resetDirectPracticeScores("MSL-T01-SQUARE-ENDING-5");
}

export function saveActiveDirectSession(
  techniqueId: MslTechniqueId,
  session: { questionIndex: number; firstPassResults: Record<string, boolean> },
): void {
  const store = readMslStore();
  const sessions = { ...(store.activeDirectSessions ?? {}) };
  sessions[techniqueId] = {
    techniqueId,
    questionIndex: session.questionIndex,
    firstPassResults: { ...session.firstPassResults },
    updatedAt: new Date().toISOString(),
  };
  store.activeDirectSessions = sessions;
  writeMslStore(store);
}

/** @deprecated Prefer saveActiveDirectSession */
export function saveT01ActiveDirectSession(session: {
  questionIndex: number;
  firstPassResults: Record<string, boolean>;
}): void {
  saveActiveDirectSession("MSL-T01-SQUARE-ENDING-5", session);
}

export function clearActiveDirectSession(techniqueId: MslTechniqueId): void {
  const store = readMslStore();
  const sessions = { ...(store.activeDirectSessions ?? {}) };
  delete sessions[techniqueId];
  store.activeDirectSessions = sessions;
  writeMslStore(store);
}

/** @deprecated Prefer clearActiveDirectSession */
export function clearT01ActiveDirectSession(): void {
  clearActiveDirectSession("MSL-T01-SQUARE-ENDING-5");
}

export function getActiveDirectSession(techniqueId: MslTechniqueId): MslActiveDirectSession | null {
  const store = readMslStore();
  return store.activeDirectSessions?.[techniqueId] ?? null;
}

/** @deprecated Prefer getActiveDirectSession */
export function getT01ActiveDirectSession(): MslActiveDirectSession | null {
  return getActiveDirectSession("MSL-T01-SQUARE-ENDING-5");
}

export function parseMslStoreJson(raw: string | null): MslProgressStoreV1 {
  if (!raw) return createEmptyMslStore();
  try {
    const parsed = JSON.parse(raw) as Partial<MslProgressStoreV1>;
    if (parsed.version !== 1 || parsed.moduleId !== MSL_MODULE_ID) {
      return createEmptyMslStore();
    }
    return {
      version: 1,
      moduleId: MSL_MODULE_ID,
      moduleContentVersion:
        typeof parsed.moduleContentVersion === "string"
          ? parsed.moduleContentVersion
          : MSL_CONTENT_VERSION,
      techniques: parsed.techniques ?? {},
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : [],
      activeDirectSessions: migrateActiveSessions(parsed),
      activeDirectSession: null,
    };
  } catch {
    return createEmptyMslStore();
  }
}

export function listTechniqueIds(): MslTechniqueId[] {
  return [...ALL_TECHNIQUE_IDS];
}
