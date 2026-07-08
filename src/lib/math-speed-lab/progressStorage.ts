import {
  MSL_CONTENT_VERSION,
  MSL_MODULE_ID,
  MSL_STORAGE_KEY,
  type MslAttemptRecord,
  type MslProgressState,
  type MslProgressStoreV1,
  type MslTechniqueProgress,
} from "./types";

const MAX_RECENT_ATTEMPTS = 40;

function emptyT01Progress(): MslTechniqueProgress {
  return {
    techniqueId: "MSL-T01-SQUARE-ENDING-5",
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

export function readMslStore(): MslProgressStoreV1 {
  const storage = ls();
  if (!storage) return createEmptyMslStore();

  try {
    const raw = storage.getItem(MSL_STORAGE_KEY);
    if (!raw) return createEmptyMslStore();
    const parsed = JSON.parse(raw) as Partial<MslProgressStoreV1>;

    if (parsed.version !== 1 || parsed.moduleId !== MSL_MODULE_ID) {
      // Version / module mismatch — safe empty store (review can be set later).
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
      activeDirectSession:
        parsed.activeDirectSession && typeof parsed.activeDirectSession === "object"
          ? (parsed.activeDirectSession as MslProgressStoreV1["activeDirectSession"])
          : null,
    };
  } catch {
    return createEmptyMslStore();
  }
}

export function writeMslStore(store: MslProgressStoreV1): void {
  const storage = ls();
  if (!storage) return;
  try {
    storage.setItem(MSL_STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* never block UI */
  }
}

/** Clears only the Math Speed Lab key. */
export function resetMslStore(): void {
  const storage = ls();
  if (!storage) return;
  try {
    storage.removeItem(MSL_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getT01Progress(): MslTechniqueProgress {
  const store = readMslStore();
  return store.techniques["MSL-T01-SQUARE-ENDING-5"] ?? emptyT01Progress();
}

function saveT01Progress(progress: MslTechniqueProgress, attempt?: MslAttemptRecord): void {
  const store = readMslStore();
  store.moduleContentVersion = MSL_CONTENT_VERSION;
  store.techniques["MSL-T01-SQUARE-ENDING-5"] = progress;
  if (attempt) {
    store.recentAttempts = [attempt, ...store.recentAttempts].slice(0, MAX_RECENT_ATTEMPTS);
  }
  writeMslStore(store);
}

export function markT01LessonOpened(): MslTechniqueProgress {
  const current = getT01Progress();
  if (current.state === "not_started") {
    current.state = "learning";
  }
  current.lessonOpened = true;
  saveT01Progress(current);
  return current;
}

export function markT01PracticeStarted(): MslTechniqueProgress {
  const current = getT01Progress();
  current.practiceStarted = true;
  if (current.state === "not_started" || current.state === "learning") {
    current.state = "practising";
  }
  current.lastAttemptedAt = new Date().toISOString();
  saveT01Progress(current);
  return current;
}

export function recordT01Attempt(attempt: MslAttemptRecord): void {
  const current = getT01Progress();
  current.lastAttemptedAt = attempt.timestamp;
  if (!current.practiceStarted) {
    current.practiceStarted = true;
    if (current.state === "not_started" || current.state === "learning") {
      current.state = "practising";
    }
  }
  saveT01Progress(current, attempt);
}

export function completeT01DirectSet(args: {
  firstPassCorrect: number;
  total: number;
  accuracyPercent: number;
  completedQuestionIds: string[];
  state: MslProgressState;
}): MslTechniqueProgress {
  const current = getT01Progress();
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
    /* keep masteredAt history; flag review */
  } else if (!previouslyMastered) {
    current.masteredAt = null;
  }

  const store = readMslStore();
  store.moduleContentVersion = MSL_CONTENT_VERSION;
  store.techniques["MSL-T01-SQUARE-ENDING-5"] = current;
  store.activeDirectSession = null;
  writeMslStore(store);
  return current;
}

/** Restart direct practice: clears set scores but keeps lessonOpened / key isolation. */
export function resetT01DirectPracticeScores(): MslTechniqueProgress {
  const current = getT01Progress();
  current.directScorePercent = null;
  current.directFirstPassCorrect = null;
  current.directTotal = null;
  current.completedQuestionIds = [];
  if (current.state === "proficient" || current.state === "mastered") {
    current.state = "practising";
  }
  if (current.state === "review_required") {
    /* remain review_required until a new mastered set */
  }
  const store = readMslStore();
  store.techniques["MSL-T01-SQUARE-ENDING-5"] = current;
  store.activeDirectSession = null;
  writeMslStore(store);
  return current;
}

export function saveT01ActiveDirectSession(session: {
  questionIndex: number;
  firstPassResults: Record<string, boolean>;
}): void {
  const store = readMslStore();
  store.activeDirectSession = {
    techniqueId: "MSL-T01-SQUARE-ENDING-5",
    questionIndex: session.questionIndex,
    firstPassResults: { ...session.firstPassResults },
    updatedAt: new Date().toISOString(),
  };
  writeMslStore(store);
}

export function clearT01ActiveDirectSession(): void {
  const store = readMslStore();
  store.activeDirectSession = null;
  writeMslStore(store);
}

export function getT01ActiveDirectSession(): MslProgressStoreV1["activeDirectSession"] {
  return readMslStore().activeDirectSession ?? null;
}

/** Test helper: parse raw JSON the same way production does. */
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
      activeDirectSession:
        parsed.activeDirectSession && typeof parsed.activeDirectSession === "object"
          ? (parsed.activeDirectSession as MslProgressStoreV1["activeDirectSession"])
          : null,
    };
  } catch {
    return createEmptyMslStore();
  }
}
