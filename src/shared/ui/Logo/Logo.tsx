import "./Logo.scss"
import clsx from "clsx"
import LogoIcon from "@/assets/icons/logo.svg"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"

interface LogoProps {
  className?: string
  isTitle?: boolean
}

const Logo = ({ className, isTitle }: LogoProps) => {
  const { t } = useTranslation()
  return (
    <div
      className={clsx(
        className,
        "logo",
        isTitle && "logo--with-searchableValue"
      )}
    >
      <img
        className="logo__image"
        src={LogoIcon}
        alt={t(STRINGS_RES.polytech)}
        width={44}
        height={44}
        loading="lazy"
      />
      {isTitle && (
        <span className="logo__title">{t(STRINGS_RES.polytech)}</span>
      )}
    </div>
  )
}

export default Logo
