import type { ScheduleWeekData } from "@/pages/schedule/model/ScheduleData.ts"
import { isEqual, parse } from "date-fns"

export const getWeekByFormatedString = (
  weekString: string,
  formatStr: string,
  weeksData: ScheduleWeekData[]
) => {
  const weekDateStart = parse(weekString, formatStr, new Date())
  const data = weeksData.find((week) => isEqual(week.start, weekDateStart))
  if (data !== undefined) {
    return data
  }
  if (weeksData.length > 0) {
    return weeksData[0]
  }
  return null
}
