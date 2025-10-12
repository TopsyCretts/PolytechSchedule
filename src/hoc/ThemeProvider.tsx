import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import type { ThemeType, ThemeContextValues } from "@/domain/types/Theme.ts"

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextValues | null>(null)

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const storedTheme = localStorage.getItem("theme")
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (storedTheme && (storedTheme as ThemeType) !== undefined) {
      return storedTheme as ThemeType
    }
    return isSystemDark ? "dark" : "light"
  })

  useEffect(() => {
    if ((isSystemDark && storedTheme === null) || storedTheme === "dark") {
      document.body.classList.toggle("dark-mode", true)
    }
  }, [])

  const saveNewThemeValue = useCallback((newTheme: ThemeType) => {
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
    document.body.classList.toggle("dark-mode")
  }, [])

  const toggleTheme = useCallback((newTheme: ThemeType) => {
    saveNewThemeValue(newTheme)
  }, [])

  const value: ThemeContextValues = useMemo(() => {
    return {
      theme,
      toggleTheme,
      isDark: theme === "dark",
    }
  }, [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, ThemeContext }
