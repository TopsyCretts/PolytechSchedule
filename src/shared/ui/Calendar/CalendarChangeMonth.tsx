import { format } from "date-fns"
import { capitalizeFirstLatter } from "@/shared/lib/capitalizeFirstLatter.ts"
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react"
import clsx from "clsx"
import {
  useCalendar,
  useCalendarActions,
} from "@/shared/ui/Calendar/useCalendar.ts"
import "./styles/CalendarMonthSwitch.scss"
import Button from "@/shared/ui/Button"

interface CalendarChangeMonthProps {
  className?: string
}

const CalendarChangeMonth = ({ className }: CalendarChangeMonthProps) => {
  const { currentMonth, locale } = useCalendar()
  const { decrementMonth, incrementMonth } = useCalendarActions()
  const { isMonthDecrementAvailable, isMonthIncrementAvailable } = useCalendar()
  return (
    <div className={clsx(className, "month-switch")}>
      <Button
        className={"month-switch__left"}
        shape={"square"}
        onClick={decrementMonth}
        disabled={!isMonthDecrementAvailable}
      >
        <ArrowLeftIcon />
      </Button>
      <time
        className="month-switch__title"
        dateTime={format(currentMonth, "yyyy-MM", { locale: locale })}
      >
        <span className="month-switch__month-name">
          {capitalizeFirstLatter(
            format(currentMonth, "LLLL", {
              locale: locale,
            })
          )}
        </span>
        <span className="month-switch__year">
          {format(currentMonth, "yo", {
            locale: locale,
          })}
        </span>
      </time>
      <Button
        className={"month-switch__right"}
        shape={"square"}
        onClick={incrementMonth}
        disabled={!isMonthIncrementAvailable}
      >
        <ArrowLeftIcon />
      </Button>
    </div>
  )
}

export default CalendarChangeMonth
