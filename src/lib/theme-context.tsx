"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

interface ThemeContextValue {
  theme: string
  mode: "light" | "dark"
  setTheme: (theme: string) => void
  setMode: (mode: "light" | "dark") => void
  toggleMode: () => void
  availableThemes: string[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  availableThemes: string[]
  defaultTheme?: string
  defaultMode?: "light" | "dark"
}

export function ThemeProvider({
  children,
  availableThemes,
  defaultTheme = "",
  defaultMode = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState(defaultTheme)
  const [mode, setModeState] = useState<"light" | "dark">(defaultMode)

  const setTheme = useCallback((t: string) => {
    setThemeState(t)
    if (t) {
      document.documentElement.setAttribute("data-theme", t)
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
  }, [])

  const setMode = useCallback((m: "light" | "dark") => {
    setModeState(m)
    document.documentElement.classList.toggle("dark", m === "dark")
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light")
  }, [mode, setMode])

  const initialModeRef = useRef(false)
  useEffect(() => {
    if (!initialModeRef.current) {
      initialModeRef.current = true
      document.documentElement.classList.toggle("dark", defaultMode === "dark")
    }
  }, [defaultMode])

  return (
    <ThemeContext value={{ theme, mode, setTheme, setMode, toggleMode, availableThemes }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
