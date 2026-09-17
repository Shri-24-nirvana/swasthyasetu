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

  // SwasthyaSetu Medical & Rural Healthcare Tokens
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
// 1. AYUSHMAN TEAL / EMERALD PALETTE (Primary Health Network Theme)
// ============================================================================
export const lightVibrantColors: ThemeColors = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F0FDFA",
  surfaceHover: "#F1F5F9",
  
  text: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  
  primary: "#0D9488", // Teal Primary
  primaryHover: "#0F766E",
  primaryLight: "rgba(13, 148, 136, 0.12)",
  primaryGlow: "rgba(13, 148, 136, 0.25)",
  
  secondary: "#2563EB", // Royal Blue
  success: "#059669",  // Emerald
  warning: "#D97706",  // Amber
  error: "#DC2626",    // Red
  info: "#0284C7",     // Sky Blue
  
  hover: "#F8FAFC",
  focus: "rgba(13, 148, 136, 0.25)",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  borderHover: "#CBD5E1",
  
  shadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)",
  shadowHover: "0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)",
  overlay: "rgba(15, 23, 42, 0.6)",

  opdTokenBg: "#ECFDF5",
  opdTokenBorder: "#A7F3D0",
  opdTokenText: "#065F46",
  riskLowBg: "#DCFCE7",
  riskLowText: "#166534",
  riskModerateBg: "#FEF3C7",
  riskModerateText: "#92400E",
  riskHighBg: "#FEE2E2",
  riskHighText: "#991B1B",
  vitalsCardBg: "#F0FDFA",
  vitalsCardBorder: "rgba(13, 148, 136, 0.2)",
  cardGlow: "rgba(13, 148, 136, 0.08)",
};

export const darkVibrantColors: ThemeColors = {
  background: "#070C12",
  surface: "#0E1724",
  surfaceSecondary: "#131F30",
  surfaceHover: "#162538",
  
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textTertiary: "#94A3B8",
  
  primary: "#2DD4BF", // Luminous Bright Teal
  primaryHover: "#14B8A6",
  primaryLight: "rgba(45, 212, 191, 0.18)",
  primaryGlow: "rgba(45, 212, 191, 0.35)",
  
  secondary: "#38BDF8", // Electric Sky Blue
  success: "#34D399", // Bright Emerald
  warning: "#FBBF24", // Bright Amber
  error: "#F87171",   // Bright Coral
  info: "#60A5FA",    // Bright Blue
  
  hover: "#18283C",
  focus: "rgba(45, 212, 191, 0.35)",
  border: "#1C2D42",
  borderLight: "rgba(255, 255, 255, 0.08)",
  borderHover: "#2A4360",
  
  shadow: "0 4px 24px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)",
  shadowHover: "0 12px 32px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(45, 212, 191, 0.3)",
  overlay: "rgba(0, 0, 0, 0.8)",

  opdTokenBg: "rgba(6, 44, 32, 0.75)",
  opdTokenBorder: "rgba(52, 211, 153, 0.4)",
  opdTokenText: "#6EE7B7",
  riskLowBg: "rgba(6, 44, 32, 0.7)",
  riskLowText: "#6EE7B7",
  riskModerateBg: "rgba(45, 26, 3, 0.7)",
  riskModerateText: "#FDE68A",
  riskHighBg: "rgba(50, 14, 14, 0.7)",
  riskHighText: "#FCA5A5",
  vitalsCardBg: "rgba(12, 28, 36, 0.75)",
  vitalsCardBorder: "rgba(45, 212, 191, 0.25)",
  cardGlow: "rgba(45, 212, 191, 0.15)",
};

// ============================================================================
// 2. SAFFRON / WARM PALETTE (Ayushman Warm Theme)
// ============================================================================
export const lightOrangeColors: ThemeColors = {
  background: "#FAF8F5",
  surface: "#FFFFFF",
  surfaceSecondary: "#FFF7ED",
  surfaceHover: "#FFF1E6",
  
  text: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  
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
  border: "#E2E8F0",
  borderLight: "#FFEDD5",
  borderHover: "#FDBA74",
  
  shadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
  shadowHover: "0 10px 25px -3px rgba(234, 88, 12, 0.1)",
  overlay: "rgba(15, 23, 42, 0.6)",

  opdTokenBg: "#FFF7ED",
  opdTokenBorder: "#FDBA74",
  opdTokenText: "#9A3412",
  riskLowBg: "#DCFCE7",
  riskLowText: "#166534",
  riskModerateBg: "#FEF3C7",
  riskModerateText: "#92400E",
  riskHighBg: "#FEE2E2",
  riskHighText: "#991B1B",
  vitalsCardBg: "#FFF7ED",
  vitalsCardBorder: "rgba(234, 88, 12, 0.25)",
  cardGlow: "rgba(234, 88, 12, 0.08)",
};

export const darkOrangeColors: ThemeColors = {
  background: "#080B10",
  surface: "#101622",
  surfaceSecondary: "#1C1612",
  surfaceHover: "#241D17",
  
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textTertiary: "#94A3B8",
  
  primary: "#FB923C", // Bright Saffron
  primaryHover: "#F97316",
  primaryLight: "rgba(251, 146, 60, 0.18)",
  primaryGlow: "rgba(251, 146, 60, 0.35)",
  
  secondary: "#38BDF8",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  info: "#60A5FA",
  
  hover: "#2A1D15",
  focus: "rgba(251, 146, 60, 0.35)",
  border: "#262C38",
  borderLight: "rgba(255, 255, 255, 0.08)",
  borderHover: "#3E362C",
  
  shadow: "0 4px 24px -2px rgba(0, 0, 0, 0.6)",
  shadowHover: "0 12px 32px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(251, 146, 60, 0.3)",
  overlay: "rgba(0, 0, 0, 0.8)",

  opdTokenBg: "rgba(45, 20, 5, 0.75)",
  opdTokenBorder: "rgba(251, 146, 60, 0.4)",
  opdTokenText: "#FDBA74",
  riskLowBg: "rgba(6, 44, 32, 0.7)",
  riskLowText: "#6EE7B7",
  riskModerateBg: "rgba(45, 26, 3, 0.7)",
  riskModerateText: "#FDE68A",
  riskHighBg: "rgba(50, 14, 14, 0.7)",
  riskHighText: "#FCA5A5",
  vitalsCardBg: "rgba(28, 22, 18, 0.75)",
  vitalsCardBorder: "rgba(251, 146, 60, 0.25)",
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

  card: {
    background: colors.surface,
    borderRadius: "16px",
    padding: "24px",
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
    background: isDark
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`
      : colors.primary,
    color: isDark ? "#090E17" : "#FFFFFF",
    borderRadius: "12px",
    padding: "10px 20px",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: isDark ? `0 0 15px ${colors.primaryGlow}` : "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
  },

  buttonSecondary: {
    background: colors.surfaceSecondary,
    color: colors.primary,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "10px 20px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
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

export const globalStyles = `
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.02); }
}

* {
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;
