import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import { format, isEqual, type Locale, startOfYear } from "date-fns"
import type { SelectOption } from "@shared/ui/Select/types"
import type { WeeksByYear } from "./types"
import { formatWeekAsDateRange } from "@/pages/schedule-week-slider/lib/formatWeekAsDateRange.ts"

export const mapWeekDataToWeeksByYear = (
  weekData: ScheduleWeekData[],
  formatStr: string,
  locale: Locale
) => {
  const array: WeeksByYear[] = []
  weekOptionsMapper(0, weekData, formatStr, locale, (year) => {
    const existingIndex = array.findIndex((y) => isEqual(y.year, year.year))
    if (existingIndex !== -1) {
      array[existingIndex] = {
        ...array[existingIndex],
        weeks: array[existingIndex].weeks.concat(year.weeks),
      }
    } else {
      array.push(year)
    }
  })
  return array
}

const weekOptionsMapper = (
  initialIndex: number,
  weekData: ScheduleWeekData[],
  formatStr: string,
  locale: Locale,
  onNewYear: (year: WeeksByYear) => void
) => {
  if (initialIndex > weekData.length - 1) {
    return
  }
  const currentYear = startOfYear(weekData[initialIndex].start)
  const weeksOptions: SelectOption[] = []
  for (let i = initialIndex; i < weekData.length; i++) {
    const week = weekData[i]
    const start = week.start

    if (isEqual(startOfYear(start), currentYear)) {
      weeksOptions.push({
        key: format(start, formatStr),
        value: formatWeekAsDateRange(week.start, week.end, locale),
      })
    } else {
      onNewYear({ year: currentYear, weeks: weeksOptions })
      weekOptionsMapper(i, weekData, formatStr, locale, onNewYear)
      return
    }
  }
  onNewYear({ year: currentYear, weeks: weeksOptions })
}
