import { endOfWeek, isEqual, startOfDay } from "date-fns"
import type { ScheduleWeekData } from "@/shared/api/entities/ScheduleData.ts"

const getWeekDataByWeekStart = (
  weeksData: ScheduleWeekData[],
  weekStart: Date
) => {
  const weekData = weeksData.find((week) =>
    isEqual(startOfDay(weekStart), startOfDay(week.start))
  )
  if (weekData) {
    return {
      ...weekData,
      start: weekStart,
      end: endOfWeek(weekStart, { weekStartsOn: 1 }),
    }
  }
  return {
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
    days: [],
  }
}

export default getWeekDataByWeekStart
