import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import { isEqual } from "date-fns"

export const findEqualDayData = (weekData: ScheduleWeekData[], date: Date) => {
  const dayData = weekData
    .map((week) => week.days)
    .flat()
    .find((d) => isEqual(d.date, date))
  if (dayData !== undefined) {
    return dayData
  }
  return { date, lessons: [] }
}
