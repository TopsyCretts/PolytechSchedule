import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import type { SelectedWeekSlide } from "@/pages/schedule-week-slider/lib/types.ts"
import { getDay, startOfWeek } from "date-fns"
import getWeekDataByWeekStart from "@/pages/schedule-week-slider/lib/getWeekDataByWeekStart.ts"
import { getAvailableDateInRange } from "@/pages/schedule-week-slider/lib/minAndMaxWeekStartDate.ts"

export const findWeekSlide = (
  weeksData: ScheduleWeekData[],
  dateToFindWeek: Date
): SelectedWeekSlide => {
  const availableDateToFindWeek = getAvailableDateInRange(dateToFindWeek)

  const weekStart = startOfWeek(availableDateToFindWeek, { weekStartsOn: 1 })
  const weekData = getWeekDataByWeekStart(weeksData, weekStart)

  return {
    weekData,
    activeDateIndex:
      getDay(availableDateToFindWeek) - 1 < 0
        ? 6
        : getDay(availableDateToFindWeek) - 1,
  }
}
