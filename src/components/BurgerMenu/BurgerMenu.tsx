import "./BurgerMenu.scss"
import clsx from "clsx"
import { useTheme } from "@/domain/hooks"
import { useCallback } from "react"
import type { ThemeType } from "@/domain/types/Theme.ts"
import Select from "@components/Select"
import { themeArray } from "@/constants/contstants.ts"
import "@components/ThemePicker/ThemePicker.scss"
import { ThemeItem } from "@components/ThemePicker/utils"
import BurgerIcon from "@assets/icons/burger.svg?react"

interface BurgerMenuProps {
  className?: string
}

const values = ["Russian", "English"]

const BurgerMenu = ({ className }: BurgerMenuProps) => {
  const { theme, toggleTheme } = useTheme()

  const handleThemeChange = useCallback((value: string) => {
    if ((value as ThemeType) !== undefined) {
      toggleTheme(value as ThemeType)
    } else {
      throw TypeError(`${value} should be a "ThemeType" property"`)
    }
  }, [])

  return (
    <Select className={clsx(className, "burger-menu", "visible-mobile-s")}>
      <Select.ButtonToggler
        isSquare
        onClick={() => {}}
      >
        <BurgerIcon />
      </Select.ButtonToggler>
      <Select.Backdrop />
      <Select.Container>
        <Select.Header isCross>Menu</Select.Header>
        <Select.OptionsGroup
          title="Language"
          onOptionChange={() => {}}
          initialSelectedOptionsKeys={[theme]}
          values={values.map((value) => ({
            key: value,
            value: value,
          }))}
        />
        <Select.OptionsGroup
          title="Theme"
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

export default BurgerMenu
