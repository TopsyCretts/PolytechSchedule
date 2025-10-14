import type { ThemeObject, ThemeType } from "@/domain/types/Theme.ts"

interface ThemeIconProps {
  theme: ThemeType
}

interface ThemeItemProps {
  themeObject: ThemeObject
}

export type { ThemeObject, ThemeItemProps, ThemeIconProps }
