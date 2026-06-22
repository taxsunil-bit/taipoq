import { Analytics } from "@vercel/analytics/react";
import { useCookieConsent } from "@/components/CookieConsent";

/** Renders Vercel Web Analytics only after the visitor grants analytics consent. */
export function ConsentAwareAnalytics() {
  const { analyticsConsentGranted } = useCookieConsent();
  if (!analyticsConsentGranted) return null;
  return <Analytics />;
}
