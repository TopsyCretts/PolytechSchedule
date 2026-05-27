import type {
  DayData,
  ScheduleData,
} from "@/shared/api/entities/ScheduleData.ts"
import type { BaseProfile } from "@/entities/profile/model/Profile.ts"
import type { Locale } from "date-fns"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"

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
  isError: boolean
  isLoading: boolean
  resetError: () => void
}

export type { SchedulePageProps, ScheduleLayoutProps, ScheduleContextValues }
