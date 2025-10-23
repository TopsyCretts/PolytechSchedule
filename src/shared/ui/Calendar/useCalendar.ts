import {
  CalendarActionsContext,
  CalendarContext,
} from "@shared/ui/Calendar/Calendar.tsx"
import { useContext } from "react"

const useCalendar = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendar returns undefined")
  }
  return context
}

const useCalendarActions = () => {
  const context = useContext(CalendarActionsContext)
  if (!context) {
    throw new Error("useCalendar returns undefined")
  }
  return context
}

export { useCalendar, useCalendarActions }
