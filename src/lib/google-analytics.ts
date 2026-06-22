declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Replace G-XXXXXXXXXX with your real GA4 Measurement ID before enabling Google Analytics. */
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

const SCRIPT_ID = "taipoq-ga-script";

export function isGoogleAnalyticsConfigured(): boolean {
  return GA_MEASUREMENT_ID !== "G-XXXXXXXXXX" && GA_MEASUREMENT_ID.length > 0;
}

export function loadGoogleAnalytics(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!isGoogleAnalyticsConfigured()) return;
  if (document.getElementById(SCRIPT_ID) || typeof window.gtag === "function") return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}
