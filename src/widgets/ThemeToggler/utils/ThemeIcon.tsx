import type { ThemeIconProps } from "@/widgets/ThemeToggler/types"
import type { JSX } from "react"
import MoonIcon from "@/assets/icons/moon.svg?react"
import SunIcon from "@/assets/icons/sun.svg?react"
import { THEME_TYPE } from "@/shared/models/Theme.ts"

const ThemeIcon = ({ theme }: ThemeIconProps) => {
  let content: JSX.Element
  switch (theme) {
    case THEME_TYPE.light: {
      content = <SunIcon />
      break
    }
    case THEME_TYPE.dark: {
      content = <MoonIcon />
      break
    }
  }
  return content
}

export default ThemeIcon
