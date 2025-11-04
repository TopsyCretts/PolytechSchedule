import type { ProfileType } from "@/domain/models/Profile.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import type {
  DayData,
  LessonData,
  ScheduleData,
  ScheduleWeekData,
} from "@/pages/schedule/model/ScheduleData.ts"

interface ScheduleDataDB {
  weeks: ScheduleWeekDataDB[]
  id: number
  name: string
  type: ProfileType
  view: ScheduleView
  lastUpdate: string
}

type ScheduleView = "calendar" | "week"

interface ScheduleWeekDataDB {
  start: string
  end: string
  days: DayDataDB[]
}

interface DayDataDB {
  date: string
  lessons: LessonDataDB[]
}

interface LessonDataDB {
  name: string
  type: LessonType
  start: string
  end: string
  lessonNumber: number
  teachers: Array<TeacherData | string>
  groups: Array<GroupData | string>
  auditory?: string
  isDistant: boolean
  additionalInfo?: string
}

type LessonType = "unknown" | "lecture" | "practical" | "exam" | "laboratory"

export const toScheduleUi = (dbData: ScheduleDataDB): ScheduleData => {
  return {
    ...dbData,
    weeks: dbData.weeks.map((w): ScheduleWeekData => {
      return {
        start: new Date(w.start),
        end: new Date(w.end),
        days: w.days.map((d): DayData => {
          return {
            date: new Date(d.date),
            lessons: d.lessons.map((l): LessonData => {
              return {
                ...l,
                start: new Date(l.start),
                end: new Date(l.end),
              }
            }),
          }
        }),
      }
    }),
    lastUpdate: new Date(dbData.lastUpdate),
  }
}

export type {
  ScheduleDataDB,
  ScheduleWeekDataDB,
  ScheduleView,
  LessonDataDB,
  LessonType,
  DayDataDB,
}
