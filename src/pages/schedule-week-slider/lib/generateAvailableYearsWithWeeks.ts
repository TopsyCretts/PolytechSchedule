import { add, format, type Locale } from "date-fns"
import type { SelectOption } from "@/shared/ui/Select/types"
import type { WeeksByYear } from "./types"
import { formatWeekAsDateRange } from "@/pages/schedule-week-slider/lib/formatWeekAsDateRange.ts"

export const generateAvailableYearsWithWeeks = (
  formatStr: string,
  locale: Locale
): WeeksByYear[] => {
  const currentYear = new Date().getFullYear()
  const currentYearMondays = getMondaysInYear(currentYear)
  const currentYearWithWeeks = {
    year: currentYear,
    weeks: mapWeeksToSelectOption(currentYearMondays, locale, formatStr),
  }

  const prevYear = currentYear - 1
  const prevYearMondays = getMondaysInYear(prevYear)
  const prevYearWithWeeks = {
    year: prevYear,
    weeks: mapWeeksToSelectOption(prevYearMondays, locale, formatStr),
  }

  const nextYear = currentYear + 1
  const nextYearMondays = getMondaysInYear(nextYear)
  const nextYearWithWeeks = {
    year: nextYear,
    weeks: mapWeeksToSelectOption(nextYearMondays, locale, formatStr),
  }

  return [prevYearWithWeeks, currentYearWithWeeks, nextYearWithWeeks]
}

const mapWeeksToSelectOption = (
  mondays: Date[],
  locale: Locale,
  formatStr: string
): SelectOption[] => {
  return mondays.map((monday): SelectOption => {
    return {
      key: format(monday, formatStr),
      value: formatWeekAsDateRange(monday, add(monday, { days: 6 }), locale),
    }
  })
}

const getMondaysInYear = (year: number): Date[] => {
  const mondays: Date[] = []

  // Начинаем с первого января указанного года
  const currentDate = new Date(year, 0, 1)

  // Переходим к первому понедельнику
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Собираем все понедельники в году
  while (currentDate.getFullYear() === year) {
    // Добавляем копию даты в массив
    mondays.push(new Date(currentDate))
    // Переходим к следующему понедельнику
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return mondays
}
