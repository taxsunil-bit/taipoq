export type CookieConsentSettings = {
  essential: true;
  analytics: boolean;
};

export const COOKIE_CONSENT_KEY = "taipoq_cookie_consent";

const DEFAULT_REJECT: CookieConsentSettings = {
  essential: true,
  analytics: false,
};

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getCookieConsent(): CookieConsentSettings | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentSettings>;
    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(settings: CookieConsentSettings): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ essential: true, analytics: settings.analytics }),
    );
  } catch {
    /* quota */
  }
}

export function acceptAllConsent(): CookieConsentSettings {
  const settings: CookieConsentSettings = { essential: true, analytics: true };
  saveCookieConsent(settings);
  return settings;
}

export function rejectAllConsent(): CookieConsentSettings {
  saveCookieConsent(DEFAULT_REJECT);
  return DEFAULT_REJECT;
}
