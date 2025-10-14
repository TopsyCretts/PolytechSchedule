import "./ThemeToggler.scss"
import clsx from "clsx"
import { useTheme } from "@/domain/hooks"
import { ThemeIcon } from "@components/ThemeToggler/utils"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"
import Button from "@components/Button"

interface ThemePickerProps {
  className?: string
  isHiding?: boolean
}

const ThemeToggler = ({ className, isHiding = false }: ThemePickerProps) => {
  const { t } = useTranslation()

  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Button
        isSquare={true}
        className={clsx(className, isHiding && "hidden-mobile-s")}
        title={t(STRINGS_RES.change_theme)}
        onClick={() => toggleTheme(undefined)}
      >
        <ThemeIcon theme={theme} />
      </Button>
    </>
  )
}

export default ThemeToggler
