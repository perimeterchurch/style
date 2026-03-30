"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEY_THEME = "perimeter-style-theme";
const STORAGE_KEY_MODE = "perimeter-style-mode";

interface ThemeContextValue {
  theme: string;
  mode: "light" | "dark";
  setTheme: (theme: string) => void;
  setMode: (mode: "light" | "dark") => void;
  toggleMode: () => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  availableThemes: string[];
  defaultTheme?: string;
  defaultMode?: "light" | "dark";
}

export function ThemeProvider({
  children,
  availableThemes,
  defaultTheme = "",
  defaultMode = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return defaultTheme;
    return localStorage.getItem(STORAGE_KEY_THEME) ?? defaultTheme;
  });
  const [mode, setModeState] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return defaultMode;
    const stored = localStorage.getItem(STORAGE_KEY_MODE);
    return stored === "light" || stored === "dark" ? stored : defaultMode;
  });

  const setTheme = useCallback((t: string) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY_THEME, t);
    if (t) {
      document.documentElement.setAttribute("data-theme", t);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const setMode = useCallback((m: "light" | "dark") => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY_MODE, m);
    document.documentElement.classList.toggle("dark", m === "dark");
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const initialRef = useRef(false);
  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      document.documentElement.classList.toggle("dark", mode === "dark");
      if (theme) {
        document.documentElement.setAttribute("data-theme", theme);
      }
    }
  }, [mode, theme]);

  return (
    <ThemeContext
      value={{ theme, mode, setTheme, setMode, toggleMode, availableThemes }}
    >
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
