import "./ThemeToggler.scss"
import clsx from "clsx"
import { useTheme } from "@/domain/hooks"
import { ThemeIcon } from "@widgets/ThemeToggler/utils"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import Button from "@shared/ui/Button"

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
        onClick={toggleTheme}
      >
        <ThemeIcon theme={theme} />
      </Button>
    </>
  )
}

export default ThemeToggler
