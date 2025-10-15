import type { DayData } from "./DayData.ts"

interface WeekData {
  start: Date
  end: Date
  days: DayData
}

export type { WeekData }
