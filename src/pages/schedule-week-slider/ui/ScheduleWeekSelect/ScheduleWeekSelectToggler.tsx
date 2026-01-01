import type { SelectStringTogglerProps } from "@/shared/ui/Select/types"
import clsx from "clsx"
import { useContext } from "react"
import { SelectContext } from "@/shared/ui/Select"
import SelectorArrowsIcon from "@/assets/icons/selector-arrows.svg?react"
import "./ScheduleWeekSelectToggler.scss"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings"
import { Button } from "@/shared/ui"

const ScheduleWeekSelectToggler = ({
  className,
  children,
}: SelectStringTogglerProps) => {
  const { t } = useTranslation()
  const context = useContext(SelectContext)

  return (
    <Button
      className={clsx(className, "schedule-week-select-toggler")}
      buttonType={"action"}
      onClick={context?.toggle}
    >
      <SelectorArrowsIcon className="schedule-week-select-toggler__arrows" />
      <div className="schedule-week-select-toggler__body">
        <h2 className="schedule-week-select-toggler__title">
          {t(STRINGS_RES.school_week)}
        </h2>
        <div className="schedule-week-select-toggler__current-item">
          {children}
        </div>
      </div>
    </Button>
  )
}

export default ScheduleWeekSelectToggler
