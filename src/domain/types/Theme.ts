type ThemeType = "dark" | "light"

type ThemeObject = {
  theme: ThemeType
  themeStringI18nKey: string
}

interface ThemeContextValues {
  theme: ThemeType
  toggleTheme: (theme: ThemeType) => void
  isDark: boolean
}

export type { ThemeType, ThemeObject, ThemeContextValues }
