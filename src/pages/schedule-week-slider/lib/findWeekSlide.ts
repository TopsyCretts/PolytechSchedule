import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import { getDay, isAfter, isEqual, startOfWeek } from "date-fns"

export const findWeekSlide = (
  weekData: ScheduleWeekData[],
  dateToFindWeek: Date
): SelectedWeekSlide => {
  const weekIndex = weekData.findIndex((week) =>
    isEqual(week.start, startOfWeek(dateToFindWeek, { weekStartsOn: 1 }))
  )

  if (weekIndex > -1) {
    return {
      index: weekIndex,
      weekData: weekData[weekIndex],
      activeDateIndex: getDay(dateToFindWeek) - 1,
    }
  }

  const lastWeekIndex = weekData.length - 1

  if (isAfter(dateToFindWeek, weekData[lastWeekIndex].end)) {
    return {
      index: lastWeekIndex,
      weekData: weekData[lastWeekIndex],
      activeDateIndex: 6,
    }
  }

  return {
    index: 0,
    weekData: weekData[0],
    activeDateIndex: 0,
  }
}
