import "./styles/Calendar.scss"
import {
  add,
  eachDayOfInterval,
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
  CalendarRef,
} from "./types"
import CalendarWeek from "./CalendarWeek"
import {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import CalendarChangeMonth from "./CalendarChangeMonth"
import { ru } from "date-fns/locale"
import { CALENDAR_SPECIAL_MONTH_FORMAT } from "@/shared/constants/contstants"
import { formatDateToSpecialMonthString } from "@/shared/lib/formatDateToSpecialMonthString"
import { capitalizeFirstLatter } from "@/shared/lib/capitalizeFirstLatter"
import clsx from "clsx"

const CalendarContext = createContext<CalendarContextValues | null>(null)
const CalendarActionsContext = createContext<CalendarContextActions | null>(
  null
)

const Calendar = forwardRef<CalendarRef, CalendarProps>(
  (
    {
      className,
      onMonthChange,
      onSelectedDateChange,
      dataToDisplay,
      isSelectedDateCouldBeNull = true,
      weekStartsOn = 1,
      locale = ru,
      initialDate = null,
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = useState(() =>
      formatDateToSpecialMonthString(initialDate ?? startOfToday())
    )

    const firstDayOfCurrentMonth = useMemo(
      () => parse(currentMonth, CALENDAR_SPECIAL_MONTH_FORMAT, new Date()),
      [currentMonth]
    )

    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate)

    useEffect(() => {
      setSelectedDate(initialDate)
    }, [initialDate])

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

    const handleMonthChange = useCallback(
      (month: Date) => {
        const monthString = formatDateToSpecialMonthString(month)
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
      const firstDayOfPrevMonth = add(firstDayOfCurrentMonth, { months: -1 })
      handleMonthChange(firstDayOfPrevMonth)
    }, [firstDayOfCurrentMonth, handleMonthChange])

    const value = useMemo<CalendarContextValues>(
      () => ({
        currentMonth,
        selectedDate,
        monthFormat: CALENDAR_SPECIAL_MONTH_FORMAT,
        locale,
      }),
      [currentMonth, selectedDate, locale]
    )

    const actionValue = useMemo<CalendarContextActions>(
      () => ({
        selectDate: handleSelectedDateChange,
        incrementMonth: handleMonthIncrement,
        decrementMonth: handleMonthDecrement,
      }),
      [handleMonthIncrement, handleSelectedDateChange, handleMonthDecrement]
    )

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

    const weekDaysString = useMemo(
      () =>
        eachDayOfInterval({
          start: startOfWeek(new Date(), { weekStartsOn: 1 }),
          end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        }).map((day) =>
          capitalizeFirstLatter(format(day, "EEEEEE", { locale }))
        ),
      [locale]
    )

    const calendarMethods = useMemo(
      () => ({
        goNextMonth: handleMonthIncrement,
        goPreviousMonth: handleMonthDecrement,
        goNextDay: () => {
          if (selectedDate) {
            const nextDay = add(selectedDate, { days: 1 })
            handleSelectedDateChange(nextDay)
            if (
              format(nextDay, "M") !== format(selectedDate, "M") &&
              format(selectedDate, "M") === format(firstDayOfCurrentMonth, "M")
            ) {
              handleMonthIncrement()
            }
          }
        },
        goPreviousDay: () => {
          if (selectedDate) {
            const previousDay = add(selectedDate, { days: -1 })
            handleSelectedDateChange(previousDay)
            if (
              format(previousDay, "M") !== format(selectedDate, "M") &&
              format(selectedDate, "M") === format(firstDayOfCurrentMonth, "M")
            ) {
              handleMonthDecrement()
            }
          }
        },
        selectDate: handleSelectedDateChange,
      }),
      [
        handleMonthIncrement,
        handleMonthDecrement,
        handleSelectedDateChange,
        selectedDate,
        firstDayOfCurrentMonth,
      ]
    )

    useImperativeHandle(ref, () => calendarMethods, [calendarMethods])

    return (
      <CalendarContext.Provider value={value}>
        <CalendarActionsContext.Provider value={actionValue}>
          <div className={clsx(className, "calendar")}>
            <header className="calendar__header">
              <CalendarChangeMonth className="calendar__month-switch" />
            </header>
            <div className="calendar__inner">
              <div className="calendar__weekdays">
                {weekDaysString.map((day) => (
                  <span key={day}>{day}</span>
                ))}
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
          </div>
        </CalendarActionsContext.Provider>
      </CalendarContext.Provider>
    )
  }
)

export { Calendar, CalendarActionsContext, CalendarContext }
