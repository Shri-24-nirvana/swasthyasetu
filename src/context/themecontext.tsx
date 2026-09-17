import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeColors,
  getPaletteColors,
} from "./style";

export type ThemeMode = "light" | "dark" | "system";
export type Theme = ThemeMode;
export type ColorTheme = "green" | "orange";

export interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  colorTheme: ColorTheme;
  isDark: boolean;
  isOrange: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  toggleTheme: () => void;
  toggleColorTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("swasthya-theme") || localStorage.getItem("theme");
      return (saved as ThemeMode) || "light";
    }
    return "light";
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("swasthya-color-theme") as ColorTheme | null;
      return saved ?? "green";
    }
    return "green";
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (theme === "system") {
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  });

  useEffect(() => {
    const updateTheme = () => {
      const shouldBeDark =
        theme === "system"
          ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
          : theme === "dark";

      setIsDark(shouldBeDark);

      const root = document.documentElement;

      // Toggle .dark class
      if (shouldBeDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }

      // Toggle .theme-orange class
      if (colorTheme === "orange") {
        root.classList.add("theme-orange");
        root.setAttribute("data-theme-color", "orange");
      } else {
        root.classList.remove("theme-orange");
        root.setAttribute("data-theme-color", "green");
      }

      // Get active color palette
      const activeColors = getPaletteColors(shouldBeDark, colorTheme);

      // Inject CSS variables to :root for instant global synchronization
      Object.entries(activeColors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, String(value));
      });

      // Synchronize core tailwind/css custom variables
      root.style.setProperty("--brand", activeColors.primary);
      root.style.setProperty("--brand-50", activeColors.surfaceSecondary);
      root.style.setProperty("--brand-600", activeColors.primary);
      root.style.setProperty("--brand-700", activeColors.primaryHover);
      root.style.setProperty("--surface", activeColors.surface);
      root.style.setProperty("--surface-hover", activeColors.surfaceHover);
      root.style.setProperty("--bg", activeColors.background);
      root.style.setProperty("--fg", activeColors.text);
      root.style.setProperty("--muted", activeColors.textSecondary);
      root.style.setProperty("--border", activeColors.border);
      root.style.setProperty("--success", activeColors.success);
      root.style.setProperty("--warning", activeColors.warning);
      root.style.setProperty("--danger", activeColors.error);
    };

    updateTheme();

    if (theme === "system" && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [theme, colorTheme]);

  const handleSetTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("swasthya-theme", newTheme);
  };

  const handleSetColorTheme = (newColor: ColorTheme) => {
    setColorThemeState(newColor);
    localStorage.setItem("swasthya-color-theme", newColor);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = isDark ? "light" : "dark";
    handleSetTheme(nextTheme);
  };

  const toggleColorTheme = () => {
    const nextColor: ColorTheme = colorTheme === "orange" ? "green" : "orange";
    handleSetColorTheme(nextColor);
  };

  const colors = getPaletteColors(isDark, colorTheme);
  const resolvedTheme: "light" | "dark" = isDark ? "dark" : "light";
  const isOrange = colorTheme === "orange";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        colorTheme,
        isDark,
        isOrange,
        colors,
        setTheme: handleSetTheme,
        setColorTheme: handleSetColorTheme,
        toggleTheme,
        toggleColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const isOrange = typeof document !== "undefined" && document.documentElement.classList.contains("theme-orange");
    const colors = getPaletteColors(isDark, isOrange ? "orange" : "green");

    return {
      theme: (isDark ? "dark" : "light") as ThemeMode,
      resolvedTheme: (isDark ? "dark" : "light") as "light" | "dark",
      colorTheme: (isOrange ? "orange" : "green") as ColorTheme,
      isDark,
      isOrange,
      colors,
      setTheme: (t: ThemeMode) => {
        if (t === "dark") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("swasthya-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("swasthya-theme", "light");
        }
      },
      setColorTheme: (c: ColorTheme) => {
        if (c === "orange") {
          document.documentElement.classList.add("theme-orange");
          localStorage.setItem("swasthya-color-theme", "orange");
        } else {
          document.documentElement.classList.remove("theme-orange");
          localStorage.setItem("swasthya-color-theme", "green");
        }
      },
      toggleTheme: () => {
        const currentlyDark = document.documentElement.classList.contains("dark");
        if (currentlyDark) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("swasthya-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("swasthya-theme", "dark");
        }
      },
      toggleColorTheme: () => {
        const currentlyOrange = document.documentElement.classList.contains("theme-orange");
        if (currentlyOrange) {
          document.documentElement.classList.remove("theme-orange");
          localStorage.setItem("swasthya-color-theme", "green");
        } else {
          document.documentElement.classList.add("theme-orange");
          localStorage.setItem("swasthya-color-theme", "orange");
        }
      },
    };
  }
  return context;
};

export default ThemeProvider;
