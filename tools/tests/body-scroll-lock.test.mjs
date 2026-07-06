import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

test("body-scroll-lock module exists and is used by overlays", () => {
  const lockSrc = readFileSync(path.join(ROOT, "src", "lib", "body-scroll-lock.ts"), "utf8");
  assert.match(lockSrc, /lockCount/);
  assert.match(lockSrc, /lockBodyScroll/);

  for (const file of [
    "src/components/WelcomeMotivationOverlay.tsx",
    "src/components/ToughMockChallengePopup.tsx",
    "src/components/CookiePreferencesModal.tsx",
  ]) {
    const src = readFileSync(path.join(ROOT, file), "utf8");
    assert.match(src, /lockBodyScroll/, `${file} must use lockBodyScroll`);
    assert.doesNotMatch(src, /document\.body\.style\.overflow\s*=\s*previousOverflow/);
  }
});
