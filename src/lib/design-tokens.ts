/**
 * TAIPOQ Calm Spatial Learning OS — JS mirror of CSS tokens in styles.css.
 */

export const TQ = {
  primary: "#2457D6",
  primaryStrong: "#183B99",
  primaryHover: "#1E48B8",
  primaryContainer: "#EAF0FF",
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#132B66",

  secondary: "#087F78",
  secondaryStrong: "#065F5B",
  secondaryContainer: "#E4F7F5",
  onSecondary: "#FFFFFF",
  onSecondaryContainer: "#064E49",

  accentIntelligence: "#B7E34A",
  accentIntelligenceSoft: "#F3FAD9",

  canvas: "#F7F9FC",
  cardBg: "#FFFFFF",
  surfaceFocus: "#EEF4FF",
  surfaceSecondary: "#F0FAF9",
  surfaceMuted: "#F8FAFC",

  textPrimary: "#101828",
  textSecondary: "#475467",
  textMuted: "#667085",
  textDisabled: "#98A2B3",

  borderSubtle: "#E4E7EC",
  borderDefault: "#D0D5DD",
  borderFocus: "#84A7FF",

  statusSuccess: "#16835B",
  statusSuccessContainer: "#E8F7F0",
  statusWarning: "#A85B00",
  statusWarningContainer: "#FFF4E5",
  statusDanger: "#B42318",
  statusDangerContainer: "#FEECEB",
  statusInfo: "#175CD3",
  statusInfoContainer: "#EAF2FF",

  /** @deprecated use primaryContainer */
  heroPale: "#EAF0FF",
  /** @deprecated use textPrimary */
  textMain: "#101828",
  /** @deprecated use canvas */
  pageBg: "#F7F9FC",
  /** @deprecated use borderSubtle */
  border: "#E4E7EC",

  accents: {
    tests: "#2457D6",
    pyqs: "#3B5BDB",
    msl: "#087F78",
    mission: "#A85B00",
    jobs: "#16835B",
    progress: "#087F78",
    error: "#B42318",
  },
  pale: {
    tests: "#EAF0FF",
    pyqs: "#EEF2FF",
    msl: "#E4F7F5",
    mission: "#FFF4E5",
    jobs: "#E8F7F0",
    progress: "#E4F7F5",
    error: "#FEECEB",
  },
} as const;

export type ProductAccent = keyof typeof TQ.accents;
