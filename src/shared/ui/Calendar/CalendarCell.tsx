import type { CalendarCellProps } from "@shared/ui/Calendar/types.ts"
import { format, getMonth, isEqual, isToday, parse } from "date-fns"
import clsx from "clsx"
import "./styles/CalendarCell.scss"
import {
  useCalendar,
  useCalendarActions,
} from "@shared/ui/Calendar/useCalendar.ts"
import { memo } from "react"
import { capitalizeFirstLatter } from "@shared/lib/capitalizeFirstLatter.ts"

const CalendarCell = memo(
  ({
    className,
    cellData,
    dateDisplayFormatDesktop = "d",
    dateDisplayFormatMobile = "d, EEEEEE",
  }: CalendarCellProps) => {
    const { selectedDate, currentMonth, monthFormat, locale } = useCalendar()
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
          getMonth(cellData.date) !==
            getMonth(parse(currentMonth, monthFormat, new Date())) &&
            "calendar-day--not-current-month"
        )}
        onClick={() => {
          selectDate(isSelected ? null : cellData.date)
        }}
      >
        <time
          className="calendar-day__header-desktop"
          dateTime={format(cellData.date, dateDisplayFormatDesktop, { locale })}
        >
          {format(cellData.date, dateDisplayFormatDesktop, { locale })}
        </time>
        <time
          className="calendar-day__header-mobile"
          dateTime={format(cellData.date, dateDisplayFormatMobile, { locale })}
        >
          {format(cellData.date, dateDisplayFormatMobile, { locale })
            .split(", ")
            .map((str, i) => {
              if (i === 1) {
                return capitalizeFirstLatter(str)
              }
              return str
            })
            .concat()
            .join(", ")}
        </time>
        <div className="calendar-day__body">{cellData.contentToDisplay}</div>
      </div>
    )
  }
)

export default CalendarCell
