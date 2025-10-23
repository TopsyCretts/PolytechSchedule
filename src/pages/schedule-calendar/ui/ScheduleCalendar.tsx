import { Calendar } from "@shared/ui"
import CalendarLessons from "@/pages/schedule-calendar/ui/CalendarLessons"
import { isEqual, startOfToday } from "date-fns"
import { useState } from "react"
import ScheduleDayItem from "@shared/ui/ScheduleDayItem"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { LANGUAGES_MAP } from "@/constants/contstants.ts"
import "./ScheduleCalendar.scss"
import { AnimatePresence, motion } from "framer-motion"
import { useDebounce } from "use-debounce"
import type {
  DayData,
  ScheduleWeekData,
} from "@/pages/schedule/model/ScheduleData.ts"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"

interface ScheduleCalendarProps {
  className?: string
}

const ScheduleCalendar = ({ className }: ScheduleCalendarProps) => {
  const { data, profileType } = useScheduleData()

  const { i18n } = useTranslation()
  const locale = LANGUAGES_MAP[i18n.language].locale

  const [day, setDay] = useState<DayData>(
    findEqualDayData(data.weeks, startOfToday())
  )
  const [debouncedDay] = useDebounce(day, 200)

  const handleDateSelect = (date: Date | null) => {
    if (date === null) {
      return
    }
    const a = document.createElement("a")
    const dayData = findEqualDayData(data.weeks, date)
    setDay(dayData)
    a.href = "#schedule-day"
    a.click()
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
        initialDate={day.date}
        isSelectedDateCouldBeNull={false}
        onSelectedDateChange={handleDateSelect}
      />
      <AnimatePresence>
        {debouncedDay.date.getTime() === day.date.getTime() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScheduleDayItem
              key={day.date.toString()}
              className={"schedule-calendar__day-item"}
              dayData={day}
              locale={locale}
              profileType={profileType}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div id={"schedule-day"}></div>
    </section>
  )
}

export default ScheduleCalendar

const findEqualDayData = (weekData: ScheduleWeekData[], date: Date) => {
  const dayData = weekData
    .map((week) => week.days)
    .flat()
    .find((d) => isEqual(d.date, date))
  if (dayData !== undefined) {
    return dayData
  }
  return { date, lessons: [] }
}
