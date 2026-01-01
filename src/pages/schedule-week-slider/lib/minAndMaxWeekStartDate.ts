import { generateAvailableYearsWithWeeks } from "@/pages/schedule-week-slider/lib/generateAvailableYearsWithWeeks.ts"
import { endOfWeek, isAfter, isBefore, parse } from "date-fns"
import { ru } from "date-fns/locale"

const START_WEEK_FORMAT = "yyyy-MM-dd"

const minWeekStartDate = () => {
  const minYear = generateAvailableYearsWithWeeks(START_WEEK_FORMAT, ru)[0]
  return parse(minYear.weeks[0].key, START_WEEK_FORMAT, new Date())
}

const maxWeekStartDate = () => {
  const years = generateAvailableYearsWithWeeks(START_WEEK_FORMAT, ru)
  const maxYear = years[years.length - 1]
  const weeks = maxYear.weeks
  return parse(weeks[weeks.length - 1].key, START_WEEK_FORMAT, new Date())
}

const getAvailableDateInRange = (dateToCompare: Date) => {
  let availableDateToFindWeek
  const minWeekStart = minWeekStartDate()
  const maxDay = endOfWeek(maxWeekStartDate(), { weekStartsOn: 1 })
  if (isBefore(dateToCompare, minWeekStart)) {
    availableDateToFindWeek = minWeekStart
  } else if (isAfter(dateToCompare, maxDay)) {
    availableDateToFindWeek = maxDay
  } else {
    availableDateToFindWeek = dateToCompare
  }

  return availableDateToFindWeek
}

export { minWeekStartDate, maxWeekStartDate, getAvailableDateInRange }
