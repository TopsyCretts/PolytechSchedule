import "./RetryFallback.scss"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings"
import { Button } from "@/shared/ui"

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
        <Button
          className={"retry-fallback__button"}
          buttonType={"primary"}
          onClick={onRetry}
        >
          {t(STRINGS_RES.retry)}
        </Button>
      </div>
    </div>
  )
}

export default RetryFallback
