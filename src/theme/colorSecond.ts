/**
 * Theme colors for ProfileSecond, HomeSecond, ProfileSettingScreenSecond.
 * Do not hardcode colors in those screens; use this file only.
 */

export const themeSecond = {
  // ---- Base ----
  bgDark: "#07060F", // deeper black-purple
  glassBg: "rgba(15, 12, 30, 0.75)",
  glassBorder: "rgba(120, 90, 255, 0.35)",
  pillBg: "rgba(120, 90, 255, 0.12)",
  pillBorder: "rgba(120, 90, 255, 0.35)",
  textPrimary: "#F8F7FF",
  textMuted: "#B8B5D6",
  textSoft: "#9C97C2",
  accentPurple: "#7B61FF", // refined neon violet
  onlineGreen: "#00E6A8", // more futuristic neon green

  // ---- Pill / tag colors ----
  pillReligion: "#8B5CF6",
  pillMarital: "#FF4D9D",
  pillLanguage: "#00C2FF",
  pillDiet: "#FF8A3D",
  pillSmoking: "#38BDF8",
  pillDrinking: "#FBBF24",
  planFamily: "#FF4D9D",
  planChildren: "#00C2FF",
  planLiving: "#00E6A8",
  planRelocation: "#FBBF24",

  // ---- Intention stages ----
  intentionChatting: "#7B61FF",
  intentionFamily: "#FF4D9D",
  intentionMarriage: "#FF8A3D",

  // ---- HomeSecond ----
  headerLavender: "#A78BFA",
  tabInactive: "#6E6A8A",
  iconLight: "#EDEBFF",
  avatarRingBg: "#140F2E",
  avatarRingBorder: "#7B61FF",
  cardBg: "#110D25",
  primaryActionPurple: "#6D28FF",

  // ---- Overlays & surfaces ----
  overlayDarkLight: "rgba(7, 6, 15, 0.3)",
  overlayDarkHeavy: "rgba(7, 6, 15, 0.9)",
  overlayBlack: "rgba(0, 0, 0, 0.7)",

  surfaceCard: "rgba(20, 15, 45, 0.65)",
  surfaceCardDark: "rgba(12, 10, 30, 0.9)",
  surfaceMuted: "rgba(40, 20, 80, 0.5)",
  surfaceImagePlaceholder: "rgba(15, 12, 35, 0.95)",
  surfaceRaised: "rgba(30, 24, 60, 0.75)",
  surfaceModal: "rgba(18, 14, 40, 0.95)",

  surfaceWhiteSubtle: "rgba(255, 255, 255, 0.05)",
  surfaceWhiteLight: "rgba(255, 255, 255, 0.12)",
  surfaceWhiteMedium: "rgba(255, 255, 255, 0.18)",

  surfaceDark: "#110D25",

  borderLight: "rgba(120, 90, 255, 0.15)",
  borderMedium: "rgba(120, 90, 255, 0.3)",
  borderStrong: "rgba(120, 90, 255, 0.45)",

  // ---- Accent purple ----
  accentPurpleSubtle: "rgba(123, 97, 255, 0.08)",
  accentPurpleLight: "rgba(123, 97, 255, 0.2)",
  accentPurpleMedium: "rgba(123, 97, 255, 0.45)",
  accentPurpleStrong: "rgba(123, 97, 255, 0.65)",
  accentPurpleSolid: "rgba(123, 97, 255, 1)",

  // ---- Shadows ----
  shadowBlack: "#000",
  shadowWhite: "#FFFFFF",
  shadowPurple: "#7B61FF",
  shadowOnline: "#00E6A8",

  // ---- Timeline ----
  tickInactiveBg: "rgba(255, 255, 255, 0.25)",
  tickInactiveBorder: "rgba(255, 255, 255, 0.35)",

  // ---- Status & options ----
  statusError: "#FF4D6D",
  statusWarning: "#FFB020",
  statusSuccess: "#00E6A8",

  optionOrange: "#FF8A3D",
  optionBlue: "#00C2FF",
  optionGreen: "#00E6A8",
  optionPink: "#FF4D9D",
  optionRed: "#FF4D6D",
  optionYellow: "#FFB020",
  optionPurple: "#8B5CF6",
  optionViolet: "#7B61FF",
  optionSlate: "#1E293B",
  optionTeal: "#14B8A6",
  optionHeart: "#FF3366",
  optionCoral: "#FF7A7A",
  optionTerracotta: "#D97757",

  iconPersonBg: "rgba(255, 138, 61, 0.2)",
  iconHeartBg: "rgba(255, 77, 109, 0.2)",

  tagReligionBg: "rgba(139, 92, 246, 0.2)",
  tagReligionBorder: "rgba(139, 92, 246, 0.45)",

  tagBlueBg: "rgba(0, 194, 255, 0.2)",
  tagBlueBorder: "rgba(0, 194, 255, 0.45)",

  tagGreenBg: "rgba(0, 230, 168, 0.2)",
  tagGreenBorder: "rgba(0, 230, 168, 0.45)",

  // ---- Buttons ----
  buttonPrimaryBg: "#6D28FF",
  buttonPrimaryBorder: "rgba(123, 97, 255, 0.4)",
} as const;

export type ThemeSecond = typeof themeSecond;
