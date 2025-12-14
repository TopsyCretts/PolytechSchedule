import "./OutOfDatePopover.scss"
import InfoIcon from "@assets/icons/info.svg?react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"

interface OfflineIndicatorProps {
  className: string
  lastUpdate: Date
  isReversed?: boolean
  titleI18nKey?: string
}

const OutOfDatePopover = ({
  className,
  lastUpdate,
  isReversed,
  titleI18nKey = STRINGS_RES.offline_mode,
}: OfflineIndicatorProps) => {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div
      className={clsx(
        className,
        "out-of-date-popover",
        isOpen && "out-of-date-popover--opened",
        isReversed && "out-of-date-popover--reversed"
      )}
      onClick={toggleIsOpen}
    >
      <button
        className={"out-of-date-popover__toggler"}
        type="button"
      >
        <InfoIcon className={"out-of-date-popover__icon"} />
      </button>
      {isOpen && <div className={"out-of-date-popover__backdrop backdrop"} />}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={"out-of-date-popover__inner"}
            initial={{ width: "0.675rem" }}
            animate={{ width: "auto" }}
            exit={{ width: "0.675rem" }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          >
            <div className={"out-of-date-popover__content"}>
              <h3 className={clsx("out-of-date-popover__title")}>
                {t(titleI18nKey)}
              </h3>
              <div className={clsx("out-of-date-popover__body")}>
                {t(STRINGS_RES.last_update_at)}{" "}
                <time dateTime={"YYYY-MM-DD HH:MM"}>
                  {format(lastUpdate, "yyyy-MM-dd HH:mm")}
                </time>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OutOfDatePopover
