import type { DayData, ScheduleData } from "@/entities/ScheduleData.ts"
import type { BaseProfile } from "@/entities/Profile.ts"
import type { Locale } from "date-fns"
import type { TeacherData } from "@/entities/Teachers.ts"
import type { GroupData } from "@/entities/Group.ts"
import type { ProgressStatus } from "@/shared/models/DataStatus.ts"

type SchedulePageProps = {
  className?: string
}

type ScheduleLayoutProps = {
  className?: string
  profile: BaseProfile
  teachers: TeacherData[]
  actualGroups: GroupData[]
}

type ScheduleContextValues = {
  data: ScheduleData
  profile: BaseProfile
  currentDayData: DayData
  setCurrentDayDataByDate: (date: Date) => void
  locale: Locale
  status: ProgressStatus
  resetError: () => void
}

export type { SchedulePageProps, ScheduleLayoutProps, ScheduleContextValues }
