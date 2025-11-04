import type { SelectStringTogglerProps } from "@shared/ui/Select/types"
import clsx from "clsx"
import { useContext } from "react"
import { SelectContext } from "@shared/ui/Select"
import SelectorArrowsIcon from "@assets/icons/selector-arrows.svg?react"
import "./ScheduleWeekStringToggler.scss"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"

const ScheduleWeekStringToggler = ({
  className,
  children,
}: SelectStringTogglerProps) => {
  const { t } = useTranslation()
  const context = useContext(SelectContext)

  return (
    <div className="schedule-week-string-toggler">
      <div className="schedule-week-string-toggler__header">
        <h2 className="schedule-week-string-toggler__title">
          {t(STRINGS_RES.school_week)}
        </h2>
        <div className="schedule-week-string-toggler__current-item visible-mobile">
          {children}
        </div>
      </div>
      <button
        className={clsx(className, "schedule-week-string-toggler__button")}
        onClick={context?.toggle}
      >
        <div className="schedule-week-string-toggler__current-item hidden-mobile">
          {children}
        </div>
        <SelectorArrowsIcon className="schedule-week-string-toggler__arrows" />
      </button>
    </div>
  )
}

export default ScheduleWeekStringToggler
