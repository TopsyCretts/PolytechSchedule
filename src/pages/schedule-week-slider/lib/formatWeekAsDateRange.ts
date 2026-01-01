import { format, type Locale } from "date-fns"

export const formatWeekAsDateRange = (
  start: Date,
  end: Date,
  locale: Locale
) => {
  const isTheSameMonth = start.getMonth() === end.getMonth()
  if (isTheSameMonth) {
    return `${format(start, "dd")}—${format(end, "dd")} ${format(start, "MMMM", { locale })}`
  }
  return `${format(start, "dd MMM", { locale })}—${format(end, "dd MMM", { locale })}`.replaceAll(
    ".",
    ""
  )
}
