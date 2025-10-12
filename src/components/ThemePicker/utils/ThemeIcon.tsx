import type { ThemeIconProps } from "@components/ThemePicker/types"
import type { JSX } from "react"
import MoonIcon from "@assets/icons/moon.svg?react"
import SunIcon from "@assets/icons/sun.svg?react"

const ThemeIcon = ({ theme }: ThemeIconProps) => {
  let content: JSX.Element
  switch (theme) {
    case "light":
      content = <SunIcon />
      break
    case "dark":
      content = <MoonIcon />
      break
  }
  return content
}

export default ThemeIcon
