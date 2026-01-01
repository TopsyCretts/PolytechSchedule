const THEME_TYPE = {
  dark: "dark",
  light: "light",
} as const

type ThemeType = keyof typeof THEME_TYPE

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
export { THEME_TYPE }
