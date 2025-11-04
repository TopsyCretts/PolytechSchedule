import { Calendar } from "@shared/ui"
import CalendarLessons from "@/pages/schedule-calendar/ui/CalendarLessons"
import { useEffect, useState } from "react"
import ScheduleDayItem from "@shared/ui/ScheduleDayItem"
import clsx from "clsx"
import "./ScheduleCalendarView.scss"
import { AnimatePresence, motion } from "framer-motion"
import { useDebounce } from "use-debounce"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import { MATCH_MEDIA } from "@shared/constants/media.ts"
import { useLocation, useNavigate } from "react-router"
import { findEqualDayData } from "@/pages/schedule-calendar/lib/findEqualDayData.ts"

interface ScheduleCalendarProps {
  className?: string
}

const ScheduleCalendarView = ({ className }: ScheduleCalendarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isLaptop, setIsLaptop] = useState(MATCH_MEDIA.laptop.matches)

  const handleLaptopChange = (event: MediaQueryListEvent) => {
    setIsLaptop(event.matches)
  }
  useEffect(() => {
    MATCH_MEDIA.laptop.addEventListener("change", handleLaptopChange)
    return () => {
      MATCH_MEDIA.laptop.removeEventListener("change", handleLaptopChange)
    }
  }, [])

  const { data, profileType, currentDayData, setCurrentDayData, locale } =
    useScheduleData()

  const [debouncedDay] = useDebounce(currentDayData, 200)

  const navigateToDay = () =>
    navigate(`${location.pathname}/day${location.search}`)

  const handleDateSelect = (date: Date | null) => {
    if (date === null) {
      if (isLaptop) {
        navigateToDay()
      }
      return
    }
    const dayData = findEqualDayData(data.weeks, date)
    setCurrentDayData(dayData)
    if (isLaptop) {
      navigateToDay()
    }
  }

  return (
    <section
      className={clsx(className, "schedule-calendar", "container-large")}
    >
      <h2 className="visually-hidden">Calendar schedule</h2>
      <Calendar
        dataToDisplay={{
          weeks: data.weeks.map((week) => {
            return {
              ...week,
              days: week.days.map(({ date, lessons }) => {
                return {
                  date: date,
                  contentToDisplay: <CalendarLessons lessons={lessons} />,
                }
              }),
            }
          }),
        }}
        locale={locale}
        onMonthChange={() => {}}
        initialDate={isLaptop ? null : currentDayData.date}
        isSelectedDateCouldBeNull={isLaptop}
        onSelectedDateChange={handleDateSelect}
      />
      <AnimatePresence>
        {debouncedDay.date.getTime() === currentDayData.date.getTime() && (
          <motion.div
            className={"hidden-laptop"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScheduleDayItem
              key={currentDayData.date.toString()}
              className={"schedule-calendar__day-item"}
              dayData={currentDayData}
              locale={locale}
              profileType={profileType}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ScheduleCalendarView
