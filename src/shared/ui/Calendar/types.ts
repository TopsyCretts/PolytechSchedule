import type { Locale } from "date-fns"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"

interface CalendarContextValues {
  currentMonth: Date
  selectedDate: Date | null
  monthFormat: string
  locale: Locale
  isMonthIncrementAvailable: boolean
  isMonthDecrementAvailable: boolean
}

interface CalendarContextActions {
  selectDate: (date: Date | null) => void
  decrementMonth: () => void
  incrementMonth: () => void
}

interface CalendarProps extends BaseComponent {
  initialDate: Date | null
  dataToDisplay: CalendarData
  onMonthChange: (month: Date) => void
  onSelectedDateChange: (date: Date | null) => void
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  isSelectedDateCouldBeNull?: boolean
  locale?: Locale
}

type CalendarRef = {
  goNextMonth: () => void
  goPreviousMonth: () => void
  goNextDay: () => void
  goPreviousDay: () => void
  selectDate: (date: Date | null) => void
  isMonthIncrementAvailable: boolean
  isMonthDecrementAvailable: boolean
  selectedDate: Date | null
}

interface CalendarData {
  weeks: WeekData[]
}

interface CalendarWeekProps {
  className?: string
  weekData: WeekData
}

interface WeekData {
  start: Date
  end: Date
  days?: CellData[]
}

interface CalendarCellProps {
  className?: string
  cellData: CellData
  dateDisplayFormatMobile?: string
  dateDisplayFormatDesktop?: string
  isSelected?: boolean
}

interface CellData {
  date: Date
  contentToDisplay?: React.ReactNode
}

export type {
  CalendarContextValues,
  CalendarContextActions,
  CalendarProps,
  CalendarRef,
  CalendarData,
  CalendarWeekProps,
  WeekData,
  CellData,
  CalendarCellProps,
}
