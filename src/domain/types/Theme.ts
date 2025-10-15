type ThemeType = "dark" | "light"

type ThemeObject = {
  theme: ThemeType
  themeStringI18nKey: string
}

interface ThemeContextValues {
  theme: ThemeType
  isDark: boolean
  toggleTheme: () => void
  changeTheme: (theme: ThemeType) => void
}

export type { ThemeType, ThemeObject, ThemeContextValues }
