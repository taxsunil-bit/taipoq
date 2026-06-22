import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  acceptAllConsent,
  getCookieConsent,
  rejectAllConsent,
  saveCookieConsent,
  type CookieConsentSettings,
} from "@/lib/cookie-consent";
import { loadGoogleAnalytics } from "@/lib/google-analytics";
import { CookiePreferencesModal } from "@/components/CookiePreferencesModal";

type CookieConsentContextValue = {
  openPreferences: () => void;
  /** True only when stored consent exists and analytics is enabled. */
  analyticsConsentGranted: boolean;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

function applyAnalyticsConsent(analytics: boolean) {
  if (analytics) loadGoogleAnalytics();
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [analyticsConsentGranted, setAnalyticsConsentGranted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing) {
      setAnalyticsEnabled(existing.analytics);
      setAnalyticsConsentGranted(existing.analytics);
      applyAnalyticsConsent(existing.analytics);
    } else {
      setBannerVisible(true);
    }
    setInitialized(true);
  }, []);

  const finalizeConsent = useCallback((settings: CookieConsentSettings) => {
    saveCookieConsent(settings);
    setAnalyticsEnabled(settings.analytics);
    setAnalyticsConsentGranted(settings.analytics);
    setBannerVisible(false);
    setModalOpen(false);
    applyAnalyticsConsent(settings.analytics);
  }, []);

  const openPreferences = useCallback(() => {
    const existing = getCookieConsent();
    setAnalyticsEnabled(existing?.analytics ?? false);
    setModalOpen(true);
  }, []);

  const contextValue = useMemo(
    () => ({ openPreferences, analyticsConsentGranted }),
    [openPreferences, analyticsConsentGranted],
  );

  if (!initialized) {
    return <CookieConsentContext.Provider value={contextValue}>{children}</CookieConsentContext.Provider>;
  }

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}

      {bannerVisible && (
        <div
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:inset-x-auto md:bottom-6 md:left-1/2 md:max-w-4xl md:-translate-x-1/2 md:rounded-xl md:border md:p-6"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="text-sm font-medium text-foreground">Cookie Consent</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                We use cookies and analytics tools to understand website traffic and improve user experience. You can
                accept, reject or manage your preferences.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end">
              <Button type="button" className="min-h-10 sm:min-w-[120px]" onClick={() => finalizeConsent(acceptAllConsent())}>
                Accept All
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-10 sm:min-w-[120px]"
                onClick={() => finalizeConsent(rejectAllConsent())}
              >
                Reject All
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-10 text-primary"
                onClick={() => {
                  setAnalyticsEnabled(false);
                  setModalOpen(true);
                }}
              >
                Manage Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      <CookiePreferencesModal
        open={modalOpen}
        analyticsEnabled={analyticsEnabled}
        onAnalyticsChange={setAnalyticsEnabled}
        onClose={() => setModalOpen(false)}
        onSave={() => finalizeConsent({ essential: true, analytics: analyticsEnabled })}
        onAcceptAll={() => finalizeConsent(acceptAllConsent())}
        onRejectAll={() => finalizeConsent(rejectAllConsent())}
      />
    </CookieConsentContext.Provider>
  );
}
