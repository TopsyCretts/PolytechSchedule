import "./styles/Calendar.scss"
import clsx from "clsx"
import {
  add,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns"
import type {
  CalendarContextActions,
  CalendarContextValues,
  CalendarProps,
} from "./types.ts"
import CalendarWeek from "./CalendarWeek.tsx"
import { createContext, useCallback, useMemo, useState } from "react"
import CalendarChangeMonth from "./CalendarChangeMonth.tsx"
import { ru } from "date-fns/locale"

const MONTH_FORMAT = "MMMM-yyyy" as const

const CalendarContext = createContext<CalendarContextValues | null>(null)

const CalendarActionsContext = createContext<CalendarContextActions | null>(
  null
)
const formatDateToMonth = (date: Date) => {
  return format(date, MONTH_FORMAT)
}

const Calendar = ({
  onMonthChange,
  onSelectedDateChange,
  dataToDisplay,
  isSelectedDateCouldBeNull = true,
  weekStartsOn = 1,
  locale = ru,
  initialMonth = null,
  initialDate = null,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (initialMonth !== null) {
      return initialMonth
    }
    return formatDateToMonth(startOfToday())
  })

  const firstDayOfCurrentMonth = useMemo(
    () => parse(currentMonth, MONTH_FORMAT, new Date()),
    [currentMonth]
  )

  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate)

  const handleSelectedDateChange = useCallback(
    (newDate: Date | null) => {
      if (newDate === null && !isSelectedDateCouldBeNull) {
        return
      }
      setSelectedDate(newDate)
      onSelectedDateChange(newDate)
    },
    [onSelectedDateChange, isSelectedDateCouldBeNull]
  )

  const value: CalendarContextValues = useMemo(() => {
    return {
      currentMonth,
      selectedDate,
      monthFormat: MONTH_FORMAT,
      locale,
    }
  }, [currentMonth, selectedDate, locale])

  const handleMonthChange = useCallback(
    (month: Date) => {
      const monthString = formatDateToMonth(month)
      setCurrentMonth(monthString)
      onMonthChange(monthString)
    },
    [onMonthChange]
  )

  const handleMonthIncrement = useCallback(() => {
    const firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: 1 })
    handleMonthChange(firstDayOfNextMonth)
  }, [firstDayOfCurrentMonth, handleMonthChange])

  const handleMonthDecrement = useCallback(() => {
    const firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: -1 })
    handleMonthChange(firstDayOfNextMonth)
  }, [firstDayOfCurrentMonth, handleMonthChange])

  const actionValue: CalendarContextActions = useMemo(() => {
    return {
      selectDate: handleSelectedDateChange,
      incrementMonth: handleMonthIncrement,
      decrementMonth: handleMonthDecrement,
    }
  }, [handleMonthIncrement, handleSelectedDateChange, handleMonthDecrement])

  const weeks = eachWeekOfInterval(
    {
      start: startOfWeek(startOfMonth(firstDayOfCurrentMonth), {
        weekStartsOn,
      }),
      end: endOfWeek(endOfMonth(firstDayOfCurrentMonth), {
        weekStartsOn,
      }),
    },
    { weekStartsOn }
  )

  return (
    <CalendarContext.Provider value={value}>
      <CalendarActionsContext.Provider value={actionValue}>
        <div className={clsx("calendar")}>
          <header className="calendar__header">
            <CalendarChangeMonth className={"calendar__month-switch"} />
          </header>
          <div className="calendar__inner">
            <div className="calendar__weekdays">
              <span>Пн</span>
              <span>Вт</span>
              <span>Ср</span>
              <span>Чт</span>
              <span>Пт</span>
              <span>Сб</span>
              <span>Вс</span>
            </div>
          </div>
          <div className="calendar__body">
            {weeks.map((date) => (
              <CalendarWeek
                key={date.toString()}
                weekData={{
                  start: date,
                  end: add(endOfWeek(date), { days: 1 }),
                  days: dataToDisplay.weeks.find((week) =>
                    isEqual(date, week.start)
                  )?.days,
                }}
              />
            ))}
          </div>
        </div>
      </CalendarActionsContext.Provider>
    </CalendarContext.Provider>
  )
}

export { Calendar, CalendarActionsContext, CalendarContext, formatDateToMonth }
