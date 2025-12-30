import type { ThemeObject, ThemeType } from "@/shared/models/Theme.ts"

interface ThemeIconProps {
  theme: ThemeType
}

interface ThemeItemProps {
  themeObject: ThemeObject
}

export type { ThemeObject, ThemeItemProps, ThemeIconProps }
