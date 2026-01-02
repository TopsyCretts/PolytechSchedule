import "./styles/Calendar.scss"
import {
  add,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isEqual,
  startOfMonth,
  startOfToday,
  startOfWeek,
  sub,
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
import { capitalizeFirstLatter } from "@/shared/lib/capitalizeFirstLatter"
import clsx from "clsx"
import {
  maxWeekStartDate,
  minWeekStartDate,
} from "@/pages/schedule-week-slider/lib/minAndMaxWeekStartDate.ts"

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
      initialDate = startOfToday(),
    },
    ref
  ) => {
    const [startOfCurrentMonth, setStartOfCurrentMonth] = useState(() => {
      const lastDayOfMaxYear = endOfYear(maxWeekStartDate())
      const startOfYear = minWeekStartDate()
      if (isAfter(endOfYear(initialDate!), endOfYear(maxWeekStartDate()))) {
        return startOfMonth(lastDayOfMaxYear)
      } else if (isBefore(initialDate!, startOfYear)) {
        return startOfMonth(startOfYear)
      }
      return startOfMonth(initialDate!)
    })

    const isDateOutOfRange = useCallback((date: Date) => {
      const minWeekStart = minWeekStartDate()
      const maxWeekStart = maxWeekStartDate()
      return (
        isBefore(date, minWeekStart) ||
        isAfter(date, endOfWeek(maxWeekStart, { weekStartsOn: 1 }))
      )
    }, [])

    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate)

    const [isMonthIncrementAvailable, setIsMonthIncrementAvailable] = useState(
      !isDateOutOfRange(
        add(endOfWeek(endOfMonth(startOfCurrentMonth), { weekStartsOn: 1 }), {
          days: 1,
        })
      )
    )

    const [isMonthDecrementAvailable, setIsMonthDecrementAvailable] = useState(
      !isDateOutOfRange(
        sub(startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 }), {
          days: 1,
        })
      )
    )

    useEffect(() => {
      setIsMonthIncrementAvailable(
        !isDateOutOfRange(
          add(endOfWeek(endOfMonth(startOfCurrentMonth), { weekStartsOn: 1 }), {
            days: 1,
          })
        )
      )
      setIsMonthDecrementAvailable(
        !isDateOutOfRange(
          sub(startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 }), {
            days: 1,
          })
        )
      )
    }, [isDateOutOfRange, startOfCurrentMonth])

    useEffect(() => {
      setSelectedDate(initialDate)
    }, [initialDate])

    const handleMonthChange = useCallback(
      (month: Date) => {
        setStartOfCurrentMonth(month)
        onMonthChange(month)
      },
      [onMonthChange]
    )

    const handleSelectedDateChange = useCallback(
      (newDate: Date | null) => {
        if (newDate === null && !isSelectedDateCouldBeNull) {
          return
        }
        const currentMonthNumber = selectedDate?.getMonth()
        const newMonthNumber = newDate?.getMonth()
        if (
          currentMonthNumber !== undefined &&
          newMonthNumber !== undefined &&
          newMonthNumber - currentMonthNumber !== 0
        ) {
          handleMonthChange(startOfMonth(newDate!))
        }
        setSelectedDate(newDate)
        onSelectedDateChange(newDate)
      },
      [
        isSelectedDateCouldBeNull,
        selectedDate,
        onSelectedDateChange,
        handleMonthChange,
      ]
    )

    const handleMonthIncrement = useCallback(() => {
      if (isMonthIncrementAvailable) {
        const firstDayOfNextMonth = add(startOfCurrentMonth, { months: 1 })
        handleMonthChange(firstDayOfNextMonth)
      }
    }, [startOfCurrentMonth, handleMonthChange, isMonthIncrementAvailable])

    const handleMonthDecrement = useCallback(() => {
      if (isMonthDecrementAvailable) {
        const firstDayOfPrevMonth = add(startOfCurrentMonth, { months: -1 })
        handleMonthChange(firstDayOfPrevMonth)
      }
    }, [startOfCurrentMonth, handleMonthChange, isMonthDecrementAvailable])

    const value = useMemo<CalendarContextValues>(
      () => ({
        currentMonth: startOfCurrentMonth,
        selectedDate,
        monthFormat: CALENDAR_SPECIAL_MONTH_FORMAT,
        locale,
        isMonthIncrementAvailable,
        isMonthDecrementAvailable,
      }),
      [
        startOfCurrentMonth,
        selectedDate,
        locale,
        isMonthIncrementAvailable,
        isMonthDecrementAvailable,
      ]
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
        start: startOfWeek(startOfCurrentMonth, {
          weekStartsOn,
        }),
        end: endOfWeek(endOfMonth(startOfCurrentMonth), {
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
            if (isDateOutOfRange(nextDay)) {
              return
            }
            handleSelectedDateChange(nextDay)
          }
        },
        goPreviousDay: () => {
          if (selectedDate) {
            const previousDay = sub(selectedDate, { days: 1 })
            if (isDateOutOfRange(previousDay)) {
              return
            }
            handleSelectedDateChange(previousDay)
          }
        },
        selectDate: handleSelectedDateChange,
        isMonthIncrementAvailable,
        isMonthDecrementAvailable,
        selectedDate,
      }),
      [
        handleMonthIncrement,
        handleMonthDecrement,
        handleSelectedDateChange,
        selectedDate,
        startOfCurrentMonth,
        isMonthIncrementAvailable,
        isMonthDecrementAvailable,
        selectedDate,
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
