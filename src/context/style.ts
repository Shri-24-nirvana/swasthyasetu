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
// 1. AYUSHMAN TEAL (Fresh, High-Contrast & Highlighted Palette)
// ============================================================================
export const lightVibrantColors: ThemeColors = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",
  surfaceHover: "#F8FAFC",
  
  text: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  
  primary: "#0D9488", // Crisp Teal Primary
  primaryHover: "#0F766E",
  primaryLight: "rgba(13, 148, 136, 0.12)",
  primaryGlow: "rgba(13, 148, 136, 0.25)",
  
  secondary: "#0284C7",
  success: "#059669",
  warning: "#D97706",
  error: "#DC2626",
  info: "#2563EB",
  
  hover: "#F1F5F9",
  focus: "rgba(13, 148, 136, 0.25)",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  borderHover: "#CBD5E1",
  
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
  shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
  overlay: "rgba(15, 23, 42, 0.5)",

  opdTokenBg: "#F0FDFA",
  opdTokenBorder: "#99F6E4",
  opdTokenText: "#0F766E",
  riskLowBg: "#DCFCE7",
  riskLowText: "#166534",
  riskModerateBg: "#FEF3C7",
  riskModerateText: "#92400E",
  riskHighBg: "#FEE2E2",
  riskHighText: "#991B1B",
  vitalsCardBg: "#FFFFFF",
  vitalsCardBorder: "#E2E8F0",
  cardGlow: "none",
};

export const darkVibrantColors: ThemeColors = {
  background: "#070C16", // Deep Midnight Navy background
  surface: "#0E172A",    // Crisp, highlighted slate surface card
  surfaceSecondary: "#162238",
  surfaceHover: "#1E2D48",
  
  text: "#FFFFFF",        // Ultra crisp white text
  textSecondary: "#CBD5E1",
  textTertiary: "#94A3B8",
  
  primary: "#2DD4BF",     // Luminous Cyan-Teal Accent
  primaryHover: "#14B8A6",
  primaryLight: "rgba(45, 212, 191, 0.18)",
  primaryGlow: "rgba(45, 212, 191, 0.35)",
  
  secondary: "#38BDF8",   // Electric Sky Blue
  success: "#34D399",     // Bright Emerald
  warning: "#FBBF24",     // Radiant Amber
  error: "#F87171",       // Vivid Coral
  info: "#60A5FA",        // Vivid Blue
  
  hover: "#1A2840",
  focus: "rgba(45, 212, 191, 0.35)",
  border: "#1E2F4D",      // Highlighted distinct border
  borderLight: "rgba(255, 255, 255, 0.08)",
  borderHover: "#2E4770",
  
  shadow: "0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)",
  shadowHover: "0 8px 28px -4px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(45, 212, 191, 0.35)",
  overlay: "rgba(0, 0, 0, 0.8)",

  opdTokenBg: "rgba(45, 212, 191, 0.15)",
  opdTokenBorder: "rgba(45, 212, 191, 0.4)",
  opdTokenText: "#2DD4BF",
  riskLowBg: "rgba(52, 211, 153, 0.15)",
  riskLowText: "#34D399",
  riskModerateBg: "rgba(251, 191, 36, 0.15)",
  riskModerateText: "#FDE68A",
  riskHighBg: "rgba(248, 113, 113, 0.15)",
  riskHighText: "#FCA5A5",
  vitalsCardBg: "#0E172A",
  vitalsCardBorder: "#1E2F4D",
  cardGlow: "rgba(45, 212, 191, 0.15)",
};

// ============================================================================
// 2. AYUSHMAN SAFFRON (Fresh Warm Palette)
// ============================================================================
export const lightOrangeColors: ThemeColors = {
  background: "#FAF8F5",
  surface: "#FFFFFF",
  surfaceSecondary: "#FFF7ED",
  surfaceHover: "#FFF1E6",
  
  text: "#1C1917",
  textSecondary: "#57534E",
  textTertiary: "#A8A29E",
  
  primary: "#EA580C", // Saffron Primary
  primaryHover: "#C2410C",
  primaryLight: "rgba(234, 88, 12, 0.12)",
  primaryGlow: "rgba(234, 88, 12, 0.25)",
  
  secondary: "#0284C7",
  success: "#059669",
  warning: "#D97706",
  error: "#DC2626",
  info: "#2563EB",
  
  hover: "#FFF7ED",
  focus: "rgba(234, 88, 12, 0.25)",
  border: "#E7E5E4",
  borderLight: "#FFEDD5",
  borderHover: "#FDBA74",
  
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.06)",
  shadowHover: "0 4px 6px -1px rgba(0, 0, 0, 0.08)",
  overlay: "rgba(28, 25, 23, 0.5)",

  opdTokenBg: "#FFF7ED",
  opdTokenBorder: "#FDBA74",
  opdTokenText: "#C2410C",
  riskLowBg: "#DCFCE7",
  riskLowText: "#166534",
  riskModerateBg: "#FEF3C7",
  riskModerateText: "#92400E",
  riskHighBg: "#FEE2E2",
  riskHighText: "#991B1B",
  vitalsCardBg: "#FFFFFF",
  vitalsCardBorder: "#E7E5E4",
  cardGlow: "none",
};

export const darkOrangeColors: ThemeColors = {
  background: "#0A0705",
  surface: "#18120E",
  surfaceSecondary: "#261D17",
  surfaceHover: "#33261F",
  
  text: "#FFFFFF",
  textSecondary: "#D6D3D1",
  textTertiary: "#A8A29E",
  
  primary: "#FB923C", // Luminous Saffron Accent
  primaryHover: "#F97316",
  primaryLight: "rgba(251, 146, 60, 0.18)",
  primaryGlow: "rgba(251, 146, 60, 0.35)",
  
  secondary: "#38BDF8",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  info: "#60A5FA",
  
  hover: "#2A1F18",
  focus: "rgba(251, 146, 60, 0.35)",
  border: "#33241C",
  borderLight: "rgba(255, 255, 255, 0.08)",
  borderHover: "#4D362A",
  
  shadow: "0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)",
  shadowHover: "0 8px 28px -4px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(251, 146, 60, 0.35)",
  overlay: "rgba(0, 0, 0, 0.8)",

  opdTokenBg: "rgba(251, 146, 60, 0.15)",
  opdTokenBorder: "rgba(251, 146, 60, 0.4)",
  opdTokenText: "#FB923C",
  riskLowBg: "rgba(52, 211, 153, 0.15)",
  riskLowText: "#34D399",
  riskModerateBg: "rgba(251, 191, 36, 0.15)",
  riskModerateText: "#FDE68A",
  riskHighBg: "rgba(248, 113, 113, 0.15)",
  riskHighText: "#FCA5A5",
  vitalsCardBg: "#18120E",
  vitalsCardBorder: "#33241C",
  cardGlow: "rgba(251, 146, 60, 0.15)",
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
    boxShadow: colors.shadow,
  },

  card: {
    background: colors.surface,
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${colors.border}`,
    boxShadow: colors.shadow,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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
    borderRadius: "12px",
    padding: "6px 14px",
    fontWeight: 800,
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
    color: isDark ? "#070C16" : "#FFFFFF",
    borderRadius: "12px",
    padding: "10px 20px",
    fontWeight: 800,
    border: "none",
    cursor: "pointer",
    boxShadow: isDark ? `0 0 20px ${colors.primaryGlow}` : "0 2px 8px rgba(0,0,0,0.1)",
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
