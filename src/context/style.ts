export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceHover: string;
  
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryGlow: string;
  
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  
  hover: string;
  focus: string;
  border: string;
  borderLight: string;
  borderHover: string;
  
  shadow: string;
  shadowHover: string;
  overlay: string;

  // SwasthyaSetu Medical Tokens
  opdTokenBg: string;
  opdTokenBorder: string;
  opdTokenText: string;
  riskLowBg: string;
  riskLowText: string;
  riskModerateBg: string;
  riskModerateText: string;
  riskHighBg: string;
  riskHighText: string;
  vitalsCardBg: string;
  vitalsCardBorder: string;
  cardGlow: string;
}

// ============================================================================
// 1. AYUSHMAN TEAL (Clean Single-Tone Palette)
// ============================================================================
export const lightVibrantColors: ThemeColors = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",
  surfaceHover: "#F8FAFC",
  
  text: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  
  primary: "#0D9488", // Teal Primary
  primaryHover: "#0F766E",
  primaryLight: "rgba(13, 148, 136, 0.1)",
  primaryGlow: "rgba(13, 148, 136, 0.2)",
  
  secondary: "#2563EB",
  success: "#059669",
  warning: "#D97706",
  error: "#DC2626",
  info: "#0284C7",
  
  hover: "#F1F5F9",
  focus: "rgba(13, 148, 136, 0.25)",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  borderHover: "#CBD5E1",
  
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
  shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
  overlay: "rgba(15, 23, 42, 0.5)",

  opdTokenBg: "#F0FDFA",
  opdTokenBorder: "#CCFBF1",
  opdTokenText: "#0F766E",
  riskLowBg: "#F0FDF4",
  riskLowText: "#166534",
  riskModerateBg: "#FFFBEB",
  riskModerateText: "#92400E",
  riskHighBg: "#FEF2F2",
  riskHighText: "#991B1B",
  vitalsCardBg: "#FFFFFF",
  vitalsCardBorder: "#E2E8F0",
  cardGlow: "none",
};

export const darkVibrantColors: ThemeColors = {
  background: "#0B0F17", // Single cohesive deep dark background
  surface: "#111827",    // Simple, clean single-color surface
  surfaceSecondary: "#1F2937",
  surfaceHover: "#1E293B",
  
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textTertiary: "#6B7280",
  
  primary: "#14B8A6", // Refined Teal Accent
  primaryHover: "#2DD4BF",
  primaryLight: "rgba(20, 184, 166, 0.12)",
  primaryGlow: "rgba(20, 184, 166, 0.2)",
  
  secondary: "#38BDF8",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  info: "#60A5FA",
  
  hover: "#1F2937",
  focus: "rgba(20, 184, 166, 0.25)",
  border: "#1F2937",
  borderLight: "#1F2937",
  borderHover: "#374151",
  
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
  shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
  overlay: "rgba(0, 0, 0, 0.75)",

  opdTokenBg: "rgba(20, 184, 166, 0.1)",
  opdTokenBorder: "rgba(20, 184, 166, 0.25)",
  opdTokenText: "#2DD4BF",
  riskLowBg: "rgba(52, 211, 153, 0.1)",
  riskLowText: "#34D399",
  riskModerateBg: "rgba(251, 191, 36, 0.1)",
  riskModerateText: "#FBBF24",
  riskHighBg: "rgba(248, 113, 113, 0.1)",
  riskHighText: "#F87171",
  vitalsCardBg: "#111827",
  vitalsCardBorder: "#1F2937",
  cardGlow: "none",
};

// ============================================================================
// 2. AYUSHMAN SAFFRON (Clean Warm Single-Tone Palette)
// ============================================================================
export const lightOrangeColors: ThemeColors = {
  background: "#FAFAF9",
  surface: "#FFFFFF",
  surfaceSecondary: "#F5F5F4",
  surfaceHover: "#FAFAF9",
  
  text: "#1C1917",
  textSecondary: "#57534E",
  textTertiary: "#A8A29E",
  
  primary: "#EA580C", // Saffron Primary
  primaryHover: "#C2410C",
  primaryLight: "rgba(234, 88, 12, 0.1)",
  primaryGlow: "rgba(234, 88, 12, 0.2)",
  
  secondary: "#0284C7",
  success: "#059669",
  warning: "#D97706",
  error: "#DC2626",
  info: "#2563EB",
  
  hover: "#F5F5F4",
  focus: "rgba(234, 88, 12, 0.25)",
  border: "#E7E5E4",
  borderLight: "#F5F5F4",
  borderHover: "#D6D3D1",
  
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.06)",
  shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.08)",
  overlay: "rgba(28, 25, 23, 0.5)",

  opdTokenBg: "#FFF7ED",
  opdTokenBorder: "#FFEDD5",
  opdTokenText: "#C2410C",
  riskLowBg: "#F0FDF4",
  riskLowText: "#166534",
  riskModerateBg: "#FFFBEB",
  riskModerateText: "#92400E",
  riskHighBg: "#FEF2F2",
  riskHighText: "#991B1B",
  vitalsCardBg: "#FFFFFF",
  vitalsCardBorder: "#E7E5E4",
  cardGlow: "none",
};

export const darkOrangeColors: ThemeColors = {
  background: "#0C0A09",
  surface: "#1C1917",
  surfaceSecondary: "#292524",
  surfaceHover: "#322D29",
  
  text: "#FAFAF9",
  textSecondary: "#A8A29E",
  textTertiary: "#78716C",
  
  primary: "#F97316", // Saffron Accent
  primaryHover: "#FB923C",
  primaryLight: "rgba(249, 115, 22, 0.12)",
  primaryGlow: "rgba(249, 115, 22, 0.2)",
  
  secondary: "#38BDF8",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  info: "#60A5FA",
  
  hover: "#292524",
  focus: "rgba(249, 115, 22, 0.25)",
  border: "#292524",
  borderLight: "#292524",
  borderHover: "#44403C",
  
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
  shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
  overlay: "rgba(0, 0, 0, 0.75)",

  opdTokenBg: "rgba(249, 115, 22, 0.1)",
  opdTokenBorder: "rgba(249, 115, 22, 0.25)",
  opdTokenText: "#FB923C",
  riskLowBg: "rgba(52, 211, 153, 0.1)",
  riskLowText: "#34D399",
  riskModerateBg: "rgba(251, 191, 36, 0.1)",
  riskModerateText: "#FBBF24",
  riskHighBg: "rgba(248, 113, 113, 0.1)",
  riskHighText: "#F87171",
  vitalsCardBg: "#1C1917",
  vitalsCardBorder: "#292524",
  cardGlow: "none",
};

// Helper to get active palette based on isDark and colorTheme
export function getPaletteColors(isDark: boolean, colorTheme: "green" | "orange"): ThemeColors {
  if (colorTheme === "orange") {
    return isDark ? darkOrangeColors : lightOrangeColors;
  }
  return isDark ? darkVibrantColors : lightVibrantColors;
}

export const createThemedStyles = (colors: ThemeColors, isDark: boolean) => ({
  pageContainer: {
    background: colors.background,
    color: colors.text,
    minHeight: "100vh",
    boxSizing: "border-box" as const,
  },

  bannerHeader: {
    background: colors.surface,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: "24px",
    padding: "24px",
  },

  card: {
    background: colors.surface,
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${colors.border}`,
    boxShadow: colors.shadow,
    transition: "all 0.2s ease",
  },

  cardHover: {
    "&:hover": {
      borderColor: colors.borderHover,
      boxShadow: colors.shadowHover,
    },
  },

  opdTokenBadge: {
    background: colors.opdTokenBg,
    color: colors.opdTokenText,
    border: `1px solid ${colors.opdTokenBorder}`,
    borderRadius: "10px",
    padding: "6px 14px",
    fontWeight: 700,
    fontFamily: "monospace",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  vitalsContainer: {
    background: colors.vitalsCardBg,
    border: `1px solid ${colors.vitalsCardBorder}`,
    borderRadius: "16px",
    padding: "16px 20px",
  },

  buttonPrimary: {
    background: colors.primary,
    color: isDark ? "#0B0F17" : "#FFFFFF",
    borderRadius: "12px",
    padding: "10px 20px",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "none",
    transition: "all 0.15s ease",
  },

  buttonSecondary: {
    background: colors.surfaceSecondary,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "10px 20px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  tableHeader: {
    background: colors.surfaceSecondary,
    color: colors.textSecondary,
    borderBottom: `1px solid ${colors.border}`,
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
  },

  tableRow: {
    borderBottom: `1px solid ${colors.borderLight}`,
    transition: "background-color 0.15s ease",
  },

  input: {
    background: colors.surface,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
  },
});
