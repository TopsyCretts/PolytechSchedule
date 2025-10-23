import type { ThemeItemProps } from "@widgets/ThemeToggler/types"
import { ThemeIcon } from "./index.ts"
import { useTranslation } from "react-i18next"

const ThemeItem = ({ themeObject }: ThemeItemProps) => {
  const { t } = useTranslation()
  return (
    <span className={"theme-picker__theme-type"}>
      <ThemeIcon theme={themeObject.theme} />
      {t(themeObject.themeStringI18nKey)}
    </span>
  )
}

export default ThemeItem
