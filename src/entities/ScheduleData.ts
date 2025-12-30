import type { TeacherData } from "@/entities/Teachers"
import type { GroupData } from "@/entities/Group"
import type { DataStatus } from "@/shared/models/DataStatus"

const SCHEDULE_VIEW = {
  calendar: "calendar",
  week: "week",
} as const

interface ScheduleData {
  weeks: ScheduleWeekData[]
}

type ScheduleView = keyof typeof SCHEDULE_VIEW

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

const LESSON_TYPE = {
  unknown: "unknown",
  lecture: "lecture",
  practical: "practical",
  exam: "exam",
  laboratory: "laboratory",
} as const

type LessonType = keyof typeof LESSON_TYPE

type ScheduleDataStatus = DataStatus<ScheduleData>

export type {
  ScheduleData,
  ScheduleDataStatus,
  ScheduleWeekData,
  ScheduleView,
  LessonData,
  LessonType,
  DayData,
}

export { SCHEDULE_VIEW, LESSON_TYPE }
