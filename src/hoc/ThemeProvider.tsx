import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import type { ThemeContextValues, ThemeType } from "@/domain/types/Theme.ts"

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextValues | null>(null)

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isSystemDark = useMemo(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }, [])
  const storedTheme = useMemo(() => {
    return localStorage.getItem("theme")
  }, [])
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (storedTheme && (storedTheme as ThemeType) !== undefined) {
      return storedTheme as ThemeType
    }
    return isSystemDark ? "dark" : "light"
  })

  useLayoutEffect(() => {
    if ((isSystemDark && storedTheme === null) || storedTheme === "dark") {
      document.documentElement.classList.toggle("dark-mode", true)
    }
  }, [isSystemDark, storedTheme])

  const saveNewThemeValue = useCallback((newTheme: ThemeType) => {
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark-mode")
  }, [])

  const toggleTheme = useCallback(() => {
    saveNewThemeValue(theme === "dark" ? "light" : "dark")
  }, [saveNewThemeValue, theme])

  const changeTheme = useCallback(
    (newTheme: ThemeType) => {
      saveNewThemeValue(newTheme)
    },
    [saveNewThemeValue]
  )

  const value: ThemeContextValues = useMemo(() => {
    return { theme, isDark: theme === "dark", toggleTheme, changeTheme }
  }, [theme, toggleTheme, changeTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, ThemeContext }
