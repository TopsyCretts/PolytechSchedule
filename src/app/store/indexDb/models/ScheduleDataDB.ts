import type { TeacherData } from "@/shared/api/entities/Teacher.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import type {
  DayData,
  LessonData,
  LessonType,
  ScheduleData,
  ScheduleView,
  ScheduleWeekData,
} from "@/shared/api/entities/ScheduleData.ts"

interface ScheduleDataDB {
  weeks: ScheduleWeekDataDB[]
}

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

export const dbToScheduleData = (dbData: ScheduleDataDB): ScheduleData => {
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
