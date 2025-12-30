import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import type { Locale } from "date-fns"
import type { SelectOption } from "@/shared/ui/Select/types"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"

interface ScheduleWeekSelectProps extends BaseComponent {
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
  weekData: ScheduleWeekData
  activeDateIndex: number
}

export type { ScheduleWeekSelectProps, WeeksByYear, SelectedWeekSlide }
