import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { reconcileBodyScrollLock } from "@/lib/body-scroll-lock";

/**
 * Clears stale body scroll locks after client-side navigation when no modal remains open.
 */
export function BodyScrollLockRouteSync() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      reconcileBodyScrollLock();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
