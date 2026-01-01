import "./ScheduleWeekViewControllerMobile.scss"
import { memo, useMemo } from "react"
import {
  type Day,
  eachDayOfInterval,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isToday,
  type Locale,
  startOfToday,
  startOfWeek,
} from "date-fns"
import clsx from "clsx"
import { Button } from "@/shared/ui"
import { capitalizeFirstLatter } from "@/shared/lib/capitalizeFirstLatter.ts"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"

interface ScheduleWeekViewControllerMobileProps extends BaseComponent {
  startWeekDate: Date
  currentSelectedDayNumber: Day
  locale: Locale
  onWeekDayClick: (weekDay: number) => void
}

const ScheduleWeekViewControllerMobile = memo(
  ({
    className,
    startWeekDate,
    currentSelectedDayNumber,
    locale,
    onWeekDayClick,
  }: ScheduleWeekViewControllerMobileProps) => {
    const weekDays = useMemo(() => {
      return eachDayOfInterval({
        start: startOfWeek(startWeekDate, { weekStartsOn: 1 }),
        end: endOfWeek(startWeekDate, { weekStartsOn: 1 }),
      })
    }, [startWeekDate])

    return (
      <div className={clsx(className, "schedule-week-view-controller-mobile")}>
        {weekDays.map((day, index) => (
          <Button
            key={day.toString()}
            className={clsx(
              "schedule-week-view-controller-mobile__button",
              isToday(day) &&
                "schedule-week-view-controller-mobile__button--today",
              isSameDay(day, weekDays[currentSelectedDayNumber]) &&
                "schedule-week-view-controller-mobile__button--selected",
              isBefore(day, startOfToday()) &&
                "schedule-week-view-controller-mobile__button--past"
            )}
            onClick={() => onWeekDayClick(index)}
            buttonType={"secondary"}
            borderRadiusSize={"sm"}
          >
            <h4
              className={"schedule-week-view-controller-mobile__title text-14"}
            >
              {capitalizeFirstLatter(format(day, "EEEEEE", { locale }))}
            </h4>
            <div
              className={"schedule-week-view-controller-mobile__body text-14"}
            >
              <time dateTime={"MM-DD"}>
                {format(
                  day,
                  isToday(day) ||
                    isSameDay(day, weekDays[currentSelectedDayNumber])
                    ? "dd.MM"
                    : "dd",
                  { locale }
                )}
              </time>
            </div>
          </Button>
        ))}
      </div>
    )
  }
)

export default ScheduleWeekViewControllerMobile
