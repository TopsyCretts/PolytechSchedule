import type { CalendarCellProps } from "@/shared/ui/Calendar/types.ts"
import { format, getMonth, isEqual, isToday } from "date-fns"
import clsx from "clsx"
import "./styles/CalendarCell.scss"
import {
  useCalendar,
  useCalendarActions,
} from "@/shared/ui/Calendar/useCalendar"
import { memo } from "react"
import { isEnterKeyPressed } from "@/shared/lib/isEnterKeyPressed.ts"

const CalendarCell = memo(
  ({
    className,
    cellData,
    dateDisplayFormatDesktop = "d",
  }: CalendarCellProps) => {
    const { selectedDate, currentMonth, locale } = useCalendar()
    const { selectDate } = useCalendarActions()

    const isSelected =
      selectedDate !== null && isEqual(selectedDate, cellData.date)

    return (
      <div
        className={clsx(
          className,
          "calendar-day",
          isToday(cellData.date) && "calendar-day--current",
          isSelected && "calendar-day--selected",
          getMonth(cellData.date) !== getMonth(currentMonth) &&
            "calendar-day--not-current-month"
        )}
        tabIndex={0}
        onClick={() => {
          selectDate(isSelected ? null : cellData.date)
        }}
        onKeyDown={(e) => {
          isEnterKeyPressed(e, () =>
            selectDate(isSelected ? null : cellData.date)
          )
        }}
      >
        <time
          className="calendar-day__header"
          dateTime={format(cellData.date, "MM-dd")}
        >
          {format(cellData.date, dateDisplayFormatDesktop, { locale })}
        </time>
        <div className="calendar-day__body">{cellData.contentToDisplay}</div>
      </div>
    )
  }
)

export default CalendarCell
