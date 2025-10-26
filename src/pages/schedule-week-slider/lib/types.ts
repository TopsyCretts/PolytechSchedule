import type { ScheduleWeekData } from "@/pages/schedule/model/ScheduleData.ts"
import type { Locale } from "date-fns"
import type { SelectOption } from "@shared/ui/Select/types"

interface ScheduleWeekSelectProps {
  weekData: ScheduleWeekData[]
  startWeekFormat: string
  locale: Locale
  selectedWeekStart: Date
  onSelectedWeekChange: (weekData: ScheduleWeekData) => void
}

interface WeeksByYear {
  year: Date
  weeks: SelectOption[]
}

interface SelectedWeekSlide {
  index: number
  startDate: Date
}

export type { ScheduleWeekSelectProps, WeeksByYear, SelectedWeekSlide }
