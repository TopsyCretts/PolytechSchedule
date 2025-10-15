import "./BurgerMenu.scss"
import clsx from "clsx"
import { useTheme } from "@/domain/hooks"
import { useCallback } from "react"
import type { ThemeType } from "@/domain/types/Theme.ts"
import { Select } from "@shared/ui"
import {
  LANGUAGE_SELECTABLE_VALUES,
  themeArray,
} from "@/constants/contstants.ts"
import "@components/ThemeToggler/ThemeToggler.scss"
import { ThemeItem } from "@components/ThemeToggler/utils"
import BurgerIcon from "@assets/icons/burger.svg?react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"

interface BurgerMenuProps {
  className?: string
}

const handleChangeLanguage = async (lngKey: string) => {
  i18next.changeLanguage(lngKey).then()
}

const BurgerMenu = ({ className }: BurgerMenuProps) => {
  const { t, i18n } = useTranslation()
  const { theme, changeTheme } = useTheme()

  const handleThemeChange = useCallback(
    (value: string) => {
      const themeType = value as ThemeType
      if (themeType !== undefined) {
        changeTheme(themeType)
      } else {
        throw TypeError(`${value} should be a "ThemeType" property"`)
      }
    },
    [changeTheme]
  )

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
        <Select.Header isCross>{t(STRINGS_RES.menu)}</Select.Header>
        <Select.OptionsGroup
          title={t(STRINGS_RES.language_one)}
          onOptionChange={handleChangeLanguage}
          initialSelectedOptionsKeys={[i18n.language]}
          values={[...LANGUAGE_SELECTABLE_VALUES]}
        />
        <Select.OptionsGroup
          title={t(STRINGS_RES.theme)}
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
