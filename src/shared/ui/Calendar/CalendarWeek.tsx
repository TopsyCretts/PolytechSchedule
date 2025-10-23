import CalendarCell from "@shared/ui/Calendar/CalendarCell.tsx"
import type { CalendarWeekProps } from "@shared/ui/Calendar/types.ts"
import "./styles/CalendarWeek.scss"
import clsx from "clsx"
import { eachDayOfInterval, isEqual } from "date-fns"
import { memo } from "react"

const CalendarWeek = memo(({ className, weekData }: CalendarWeekProps) => {
  const weekDays = eachDayOfInterval({
    start: weekData.start,
    end: weekData.end,
  })

  return (
    <div className={clsx(className, "calendar-week")}>
      <ul className="calendar-week__list">
        {weekDays.map((date) => (
          <li
            key={date.toString()}
            className="calendar-week__item"
          >
            <CalendarCell
              cellData={{
                date: date,
                contentToDisplay: weekData.days?.find((dayData) =>
                  isEqual(dayData.date, date)
                )?.contentToDisplay,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
})

export default CalendarWeek
