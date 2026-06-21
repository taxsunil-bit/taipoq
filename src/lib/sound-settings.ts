export type SoundSettings = {
  soundEnabled: boolean;
  keypressSound: boolean;
  errorSound: boolean;
  completionSound: boolean;
};

const KEY = "taipoq:sound-settings";

const DEFAULTS: SoundSettings = {
  soundEnabled: false,
  keypressSound: false,
  errorSound: false,
  completionSound: false,
};

function ls(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getSoundSettings(): SoundSettings {
  const s = ls();
  if (!s) return { ...DEFAULTS };
  try {
    const raw = s.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<SoundSettings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSoundSettings(settings: SoundSettings) {
  const s = ls();
  if (!s) return;
  try {
    s.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* quota */
  }
}
