import { format } from "date-fns"
import { CALENDAR_SPECIAL_MONTH_FORMAT } from "@/constants/contstants.ts"

export const formatDateToSpecialMonthString = (date: Date) => {
  return format(date, CALENDAR_SPECIAL_MONTH_FORMAT)
}
