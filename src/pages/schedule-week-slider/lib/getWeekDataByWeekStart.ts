import { add, isEqual, startOfDay } from "date-fns"
import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"

const getWeekDataByWeekStart = (
  weeksData: ScheduleWeekData[],
  weekStart: Date
) => {
  const weekData = weeksData.find((week) =>
    isEqual(startOfDay(weekStart), startOfDay(week.start))
  )
  if (weekData) {
    return weekData
  }
  return {
    start: weekStart,
    end: add(weekStart, { days: 6 }),
    days: [],
  }
}

export default getWeekDataByWeekStart
