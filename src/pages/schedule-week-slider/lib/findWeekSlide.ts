import type { ScheduleWeekData } from "@/pages/schedule/model/ScheduleData.ts"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import { isEqual, startOfWeek } from "date-fns"

export const findWeekSlide = (
  weekData: ScheduleWeekData[],
  dateToFindWeek: Date
): SelectedWeekSlide => {
  if (weekData.length === 0) {
    throw new Error("HANDLE EMPTY WEEKS")
  }
  const weekIndex = weekData.findIndex((week) =>
    isEqual(week.start, startOfWeek(dateToFindWeek, { weekStartsOn: 1 }))
  )

  if (weekIndex > -1) {
    return {
      index: weekIndex,
      startDate: weekData[weekIndex].start,
    }
  }

  return {
    index: 0,
    startDate: weekData[0].start,
  }
}
