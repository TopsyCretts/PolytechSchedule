import "./ThemePicker.scss"
import clsx from "clsx"
import Select from "@components/Select"
import { useCallback } from "react"
import { themeArray } from "@/constants/contstants.ts"
import { useTheme } from "@/domain/hooks"
import type { ThemeType } from "@/domain/types/Theme.ts"
import { ThemeIcon, ThemeItem } from "@components/ThemePicker/utils"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"

interface ThemePickerProps {
  className?: string
  isHiding?: boolean
}

const ThemePicker = ({ className, isHiding = false }: ThemePickerProps) => {
  const { t } = useTranslation()

  const { theme, toggleTheme } = useTheme()

  const handleThemeChange = useCallback((value: string) => {
    if ((value as ThemeType) !== undefined) {
      toggleTheme(value as ThemeType)
    } else {
      throw TypeError(`${value} should be a "ThemeType" property"`)
    }
  }, [])

  return (
    <Select
      className={clsx(className, "theme-picker", isHiding && "hidden-mobile-s")}
    >
      <Select.ButtonToggler
        isSquare
        onClick={() => {}}
        title={t(STRINGS_RES.change_theme)}
      >
        <ThemeIcon theme={theme} />
      </Select.ButtonToggler>
      <Select.Backdrop />
      <Select.Container>
        <Select.Header isCross>{t(STRINGS_RES.theme)}</Select.Header>
        <Select.Options
          onOptionChange={handleThemeChange}
          initialSelectedOptionsKeys={[theme]}
          values={themeArray.map((value) => ({
            key: value.theme,
            value: <ThemeItem themeObject={value} />,
          }))}
        />
      </Select.Container>
    </Select>
  )
}

export default ThemePicker
