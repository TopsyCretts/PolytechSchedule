import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import ScheduleDayItem from "@shared/ui/ScheduleDayItem"
import DayController from "@shared/ui/DayController"
import { isToday } from "date-fns"
import { useNavigate } from "react-router"
import { useCallback } from "react"
import "./ScheduleDayView.scss"
import clsx from "clsx"

const ScheduleDayView = () => {
  const { currentDayData: day, profileType, locale } = useScheduleData()
  const navigate = useNavigate()

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <main className={clsx("schedule-day-view", "container")}>
      <DayController
        day={day.date}
        locale={locale}
        decrement={handleBack}
        isActive={isToday(day.date)}
        isDecrementActive={true}
      />
      <ScheduleDayItem
        key={day.date.toString()}
        className={"schedule-calendar__day-item"}
        dayData={day}
        locale={locale}
        profileType={profileType}
        isTitleIsHidden={true}
      />
    </main>
  )
}

export default ScheduleDayView
