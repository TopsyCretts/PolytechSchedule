import { Calendar } from "@/shared/ui"
import CalendarLessons from "@/pages/schedule-calendar/ui/CalendarLessons"
import ScheduleDayItem from "@/entities/schedule/ui/ScheduleDayItem"
import clsx from "clsx"
import "./ScheduleCalendarView.scss"
import { AnimatePresence, motion } from "framer-motion"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"
import { generatePath, useNavigate } from "react-router"
import useMediaQueryListEvent from "@/shared/hooks/useMediaQueryListEvent.ts"
import { useCallback, useRef } from "react"
import type { CalendarRef } from "@/shared/ui/Calendar/types.ts"
import DayController from "@/shared/ui/DayController"
import { format, isToday } from "date-fns"
import DataStatusPopover from "@/widgets/DataStatusPopover"
import { APP_ROUTES } from "@/shared/constants/routes.ts"
import { QUERY_DATE_FORMAT } from "@/shared/constants/contstants.ts"

interface ScheduleCalendarProps {
  className?: string
}

const ScheduleCalendarView = ({ className }: ScheduleCalendarProps) => {
  const navigate = useNavigate()
  const calendar = useRef<CalendarRef>(null)

  const { isMatchesMedia: isLaptop } = useMediaQueryListEvent(
    MATCH_MEDIA.laptop
  )

  const { data, profile, currentDayData, setCurrentDayDataByDate, locale } =
    useScheduleData()

  const navigateToWeek = useCallback(
    (date: Date) => {
      navigate(
        `${generatePath(APP_ROUTES.scheduleWeek, {
          profileType: profile.profileType!,
          profileApiId: profile.apiId.toString(),
        })}?date=${format(date, QUERY_DATE_FORMAT)}`
      )
    },
    [navigate, profile]
  )

  const handleDateSelect = useCallback(
    (date: Date | null) => {
      setCurrentDayDataByDate(date!)
      if (isLaptop) {
        navigateToWeek(date!)
      }
    },
    [isLaptop, navigateToWeek, setCurrentDayDataByDate]
  )

  const handleNextDay = () => {
    calendar.current?.goNextDay()
  }

  const handlePrevDay = () => {
    calendar.current?.goPreviousDay()
  }

  return (
    <section
      className={clsx(className, "container-large", "schedule-calendar-view")}
    >
      <h2 className="visually-hidden">Calendar schedule</h2>
      <div className={"schedule-calendar-view__calendar-wrapper"}>
        <div className={"schedule-calendar-view__popover-wrapper"}>
          <DataStatusPopover
            className={clsx(
              "schedule-calendar-view__popover",
              "hidden-mobile-s"
            )}
            type={"row"}
            isReversed={true}
          />
        </div>
        <Calendar
          ref={calendar}
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
          initialDate={currentDayData.date}
          selectedDate={currentDayData.date}
          isSelectedDateCouldBeNull={isLaptop}
          onSelectedDateChange={handleDateSelect}
        />
      </div>
      <div className={clsx("schedule-calendar-view__day", "hidden-laptop")}>
        <DayController
          className={"schedule-calendar-view__day-controller"}
          day={currentDayData.date}
          locale={locale}
          isActive={isToday(currentDayData.date)}
          decrement={handlePrevDay}
          increment={handleNextDay}
          isDecrementActive={true}
          isIncrementActive={true}
        />
        <AnimatePresence mode={"wait"}>
          <motion.div
            key={currentDayData.date.getTime()}
            className={clsx(
              "schedule-calendar-view__day-item-wrapper",
              "hidden-laptop"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScheduleDayItem
              key={currentDayData.date.toString()}
              className={"schedule-calendar-view__day-item"}
              dayData={currentDayData}
              locale={locale}
              profileType={profile.profileType}
              isTitleIsHidden={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ScheduleCalendarView
