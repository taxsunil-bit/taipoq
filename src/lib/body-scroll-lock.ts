/**
 * Reference-counted document body scroll lock for modals/overlays.
 * Prevents nested locks from restoring a stale "hidden" overflow value.
 */

let lockCount = 0;
let storedOverflow: string | undefined;

function applyLock() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    storedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function releaseLock() {
  if (typeof document === "undefined") return;
  if (lockCount <= 0) {
    lockCount = 0;
    return;
  }
  lockCount -= 1;
  if (lockCount === 0) {
    if (storedOverflow !== undefined && storedOverflow !== "") {
      document.body.style.overflow = storedOverflow;
    } else {
      document.body.style.removeProperty("overflow");
    }
    storedOverflow = undefined;
  }
}

/** Lock body scroll; call returned function to release (safe to call multiple times). */
export function lockBodyScroll(): () => void {
  applyLock();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    releaseLock();
  };
}

/** For diagnostics/tests only. */
export function bodyScrollLockState(): { lockCount: number; overflow: string } {
  if (typeof document === "undefined") {
    return { lockCount, overflow: "" };
  }
  return { lockCount, overflow: document.body.style.overflow };
}
