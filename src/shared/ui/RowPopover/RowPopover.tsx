import "./RowPopover.scss"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import type { BaseComponentWithChildren } from "@/shared/models/BaseComponent.ts"
import { useTranslation } from "react-i18next"
import useOpenModal from "@/shared/lib/useOpenModal.ts"

interface RowPopover extends BaseComponentWithChildren {
  togglerContent: React.ReactNode
  titleI18nKey?: string
  isReversed?: boolean
}

const RowPopover = ({
  className,
  togglerContent,
  children,
  titleI18nKey,
  isReversed,
}: RowPopover) => {
  const { t } = useTranslation()

  const { isOpen, toggleModal } = useOpenModal()

  return (
    <div
      className={clsx(
        className,
        "row-popover",
        isOpen && "row-popover--opened",
        isReversed && "row-popover--reversed"
      )}
      onClick={toggleModal}
    >
      <button
        className={"row-popover__toggler"}
        type="button"
      >
        {togglerContent}
      </button>
      {isOpen && <div className={"row-popover__backdrop backdrop"} />}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={"row-popover__inner"}
            initial={{ width: "0.675rem" }}
            animate={{ width: "auto" }}
            exit={{ width: "0.675rem" }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          >
            <div className={"row-popover__content"}>
              {titleI18nKey && (
                <h3 className={clsx("row-popover__title")}>
                  {t(titleI18nKey)}
                </h3>
              )}
              {children && (
                <span className={clsx("row-popover__body")}>{children}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RowPopover
