import type { ScheduleWeekData } from "@/entities/schedule/model/ScheduleData.ts"
import type { Locale } from "date-fns"
import type { SelectOption } from "@/shared/ui/Select/types"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"

interface ScheduleWeekSelectProps extends BaseComponent {
  startWeekFormat: string
  locale: Locale
  selectedWeekStart: Date
  onSelectedWeekChange: (weekStartDate: Date) => void
}

interface WeeksByYear {
  year: number
  weeks: SelectOption[]
}

interface SelectedWeekSlide {
  weekData: ScheduleWeekData
  activeDateIndex: number
}

export type { ScheduleWeekSelectProps, WeeksByYear, SelectedWeekSlide }
