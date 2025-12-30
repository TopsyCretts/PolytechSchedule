import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import {
  THEME_TYPE,
  type ThemeContextValues,
  type ThemeType,
} from "@/shared/models/Theme.ts"
import { LocalStorageManager } from "@/app/store/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextValues | null>(null)

const DARK = THEME_TYPE.dark
const LIGHT = THEME_TYPE.light

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isSystemDark = useMemo(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }, [])
  const storedTheme = useMemo(() => {
    return LocalStorageManager.get<string>(LOCAL_STORAGE_KEY.theme)
  }, [])
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (storedTheme !== null && (storedTheme as ThemeType) !== undefined) {
      return storedTheme as ThemeType
    }
    return isSystemDark ? DARK : LIGHT
  })

  useLayoutEffect(() => {
    if ((isSystemDark && storedTheme === null) || storedTheme === DARK) {
      document.documentElement.classList.toggle("dark-mode", true)
    }
  }, [isSystemDark, storedTheme])

  const saveNewThemeValue = useCallback((newTheme: ThemeType) => {
    LocalStorageManager.set(LOCAL_STORAGE_KEY.theme, newTheme)
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark-mode")
  }, [])

  const toggleTheme = useCallback(() => {
    saveNewThemeValue(theme === DARK ? LIGHT : DARK)
  }, [saveNewThemeValue, theme])

  const changeTheme = useCallback(
    (newTheme: ThemeType) => {
      saveNewThemeValue(newTheme)
    },
    [saveNewThemeValue]
  )

  const value: ThemeContextValues = useMemo(() => {
    return {
      theme,
      isDark: theme === DARK,
      toggleTheme,
      changeTheme,
    }
  }, [theme, toggleTheme, changeTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, ThemeContext }
