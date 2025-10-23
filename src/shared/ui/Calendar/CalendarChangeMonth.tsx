import { Button } from "@shared/ui"
import { format, parse } from "date-fns"
import { capitalizeFirstLatter } from "@shared/lib/capitalizeFirstLatter.ts"
import { ru } from "date-fns/locale"
import ArrowLeftIcon from "@assets/icons/arrow-left.svg?react"
import clsx from "clsx"
import {
  useCalendar,
  useCalendarActions,
} from "@shared/ui/Calendar/useCalendar.ts"
import "./styles/CalendarMonthSwitch.scss"

interface CalendarChangeMonthProps {
  className?: string
}

const CalendarChangeMonth = ({ className }: CalendarChangeMonthProps) => {
  const { monthFormat, currentMonth, locale } = useCalendar()
  const { decrementMonth, incrementMonth } = useCalendarActions()

  const month = parse(currentMonth, monthFormat, new Date())

  return (
    <div className={clsx(className, "month-switch")}>
      <Button
        className={"month-switch__left"}
        isSquare
        onClick={decrementMonth}
      >
        <ArrowLeftIcon />
      </Button>
      <time
        className="month-switch__title"
        dateTime={format(month, "LLLL yyyy", { locale: ru })}
      >
        <span className="month-switch__month-name h2">
          {capitalizeFirstLatter(
            format(month, "LLLL", {
              locale: locale,
            })
          )}
        </span>
        <span className="month-switch__year">
          {format(month, "yo", {
            locale: locale,
          })}
        </span>
      </time>
      <Button
        className={"month-switch__right"}
        isSquare
        onClick={incrementMonth}
      >
        <ArrowLeftIcon />
      </Button>
    </div>
  )
}

export default CalendarChangeMonth
