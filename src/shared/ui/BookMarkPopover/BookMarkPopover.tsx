import "./BookMarkPopover.scss"
import clsx from "clsx"
import useOpenModal from "@/shared/lib/useOpenModal.ts"
import { AnimatePresence, motion } from "framer-motion"
import type { BaseComponentWithChildren } from "@/shared/models/BaseComponent.ts"
import { useTranslation } from "react-i18next"

interface BookMarkPopoverProps extends BaseComponentWithChildren {
  togglerContent: React.ReactNode
  titleI18nKey?: string
  isReversed?: boolean
}

const BookMarkPopover = ({
  className,
  children,
  titleI18nKey,
  isReversed,
  togglerContent,
}: BookMarkPopoverProps) => {
  const { t } = useTranslation()

  const { isOpen, toggleModal } = useOpenModal()

  return (
    <div
      className={clsx(
        className,
        "book-mark-popover",
        isOpen && "book-mark-popover--opened",
        isReversed && "book-mark-popover--reversed"
      )}
      onClick={toggleModal}
    >
      {isOpen && <div className={"book-mark-popover__backdrop backdrop"} />}
      <div className={"book-mark-popover__inner"}>
        <button
          className={"book-mark-popover__toggler"}
          type="button"
        >
          {togglerContent}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={"book-mark-popover__content"}
              initial={{ width: "0.675rem" }}
              animate={{ width: "auto" }}
              exit={{ width: "0.675rem" }}
              transition={{ duration: 0.2, ease: "easeIn" }}
            >
              {titleI18nKey && (
                <h3 className={clsx("book-mark-popover__title")}>
                  {t(titleI18nKey)}
                </h3>
              )}
              {children && (
                <span className={clsx("book-mark-popover__body")}>
                  {children}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookMarkPopover
