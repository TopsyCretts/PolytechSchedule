import "./LanguagePicker.scss"
import clsx from "clsx"
import { Select } from "@/shared/ui"
import LanguageIcon from "@/assets/icons/language.svg?react"
import {
  LANGUAGE_SELECTABLE_VALUES,
  LANGUAGES_KEYS,
} from "@/shared/constants/contstants.ts"
import i18next from "i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { useTranslation } from "react-i18next"

interface LanguagePickerProps {
  className?: string
  isHiding?: boolean
}

const handleChangeLanguage = async (lngKey: string) => {
  i18next.changeLanguage(lngKey).then()
}

const LanguagePicker = ({ className, isHiding }: LanguagePickerProps) => {
  const { t, i18n } = useTranslation()

  return (
    <Select
      className={clsx(
        className,
        "language-picker",
        isHiding && "hidden-mobile-s"
      )}
    >
      <Select.ButtonToggler
        shape={"square"}
        onClick={() => {}}
        title={t(STRINGS_RES.change_language)}
      >
        <LanguageIcon />
      </Select.ButtonToggler>
      <Select.Backdrop />
      <Select.Container>
        <Select.Header isCross>{t(STRINGS_RES.language_one)}</Select.Header>
        <Select.Options
          initialSelectedOptionsKeys={LANGUAGES_KEYS.filter(
            (key) => key === i18n.language
          )}
          values={[...LANGUAGE_SELECTABLE_VALUES]}
          onOptionChange={handleChangeLanguage}
        />
      </Select.Container>
    </Select>
  )
}

export default LanguagePicker
