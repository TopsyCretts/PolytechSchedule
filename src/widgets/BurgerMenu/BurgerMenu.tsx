import "./BurgerMenu.scss"
import clsx from "clsx"
import { useCallback } from "react"
import type { ThemeType } from "@shared/models/Theme.ts"
import { Select } from "@shared/ui"
import {
  LANGUAGE_SELECTABLE_VALUES,
  themeArray,
} from "@shared/constants/contstants.ts"
import "@widgets/ThemeToggler/ThemeToggler.scss"
import { ThemeItem } from "@widgets/ThemeToggler/utils"
import BurgerIcon from "@assets/icons/burger.svg?react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import { useTheme } from "@shared/lib/useTheme.ts"

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
        className="buger-menu__button-toggler"
        isSquare
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
