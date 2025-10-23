import "./RetryFallback.scss"
import clsx from "clsx"
import { AccentButton } from "@shared/ui"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"

interface RetryFallbackProps {
  className?: string
  onRetry: () => void
}

const RetryFallback = ({ className, onRetry }: RetryFallbackProps) => {
  const { t } = useTranslation()

  return (
    <div className={clsx(className, "retry-fallback")}>
      <div className="retry-fallback__body">
        <h3 className="retry-fallback__title">
          {t(STRINGS_RES.something_went_wrong)}
        </h3>
        <AccentButton
          className={"retry-fallback__button"}
          onClick={onRetry}
        >
          {t(STRINGS_RES.retry)}
        </AccentButton>
      </div>
    </div>
  )
}

export default RetryFallback
