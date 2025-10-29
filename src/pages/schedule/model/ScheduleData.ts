import type { ProfileType } from "@/domain/models/Profile.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { GroupData } from "@/domain/models/Group.ts"

interface ScheduleData {
  weeks: ScheduleWeekData[]
  id: number
  name: string
  type: ProfileType
  view: ScheduleView
  lastUpdate: Date
}

type ScheduleView = "calendar" | "week"

interface ScheduleWeekData {
  start: Date
  end: Date
  days: DayData[]
}

interface DayData {
  date: Date
  lessons: LessonData[]
}

interface LessonData {
  name: string
  type: LessonType
  start: Date
  end: Date
  lessonNumber: number
  teachers: Array<TeacherData | string>
  groups: Array<GroupData | string>
  auditory?: string
  isDistant: boolean
  additionalInfo?: string
}

type LessonType = "unknown" | "lecture" | "practical" | "exam" | "laboratory"

export type {
  ScheduleData,
  ScheduleWeekData,
  ScheduleView,
  LessonData,
  LessonType,
  DayData,
}
