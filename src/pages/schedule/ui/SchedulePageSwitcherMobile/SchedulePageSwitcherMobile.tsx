import "./SchedulePageSwitcherMobile.scss"
import clsx from "clsx"
import useSchedulePageSwitcher from "@/pages/schedule/lib/useSchedulePageSwitcher.ts"
import type { SchedulePageSwitcherPropsMobile } from "@/pages/schedule/model/SchedulePageSwitcherProps.ts"
import { SCHEDULE_VIEW } from "@/entities/ScheduleData.ts"
import CalendarIcon from "@/assets/icons/calendar.svg?react"
import WeekIcon from "@/assets/icons/week.svg?react"
import { Button } from "@shared/ui"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"

const SchedulePageSwitcherMobile = ({
  className,
  isTitleVisible,
}: SchedulePageSwitcherPropsMobile) => {
  const { profile } = useScheduleData()

  const { currentItem, handleSwitch } = useSchedulePageSwitcher(
    profile.apiId,
    profile.profileType
  )

  const iconsClassName = "schedule-page-switcher-mobile__icon"

  return (
    <Button
      className={clsx(className, "schedule-page-switcher-mobile")}
      role={"switch"}
      isSquare={!isTitleVisible}
      onClick={handleSwitch}
    >
      <div className={"schedule-page-switcher-mobile__icon-wrapper"}>
        {currentItem.value === SCHEDULE_VIEW.calendar ? (
          <CalendarIcon className={iconsClassName} />
        ) : (
          <WeekIcon className={iconsClassName} />
        )}
      </div>
      {isTitleVisible && (
        <h3
          className={"schedule-page-switcher-mobile__item-title text-16 bold"}
        >
          {currentItem.label}
        </h3>
      )}
    </Button>
  )
}

export default SchedulePageSwitcherMobile
