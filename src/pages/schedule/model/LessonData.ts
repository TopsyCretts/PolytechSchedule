import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { GroupData } from "@/domain/models/Group.ts"

interface LessonData {
  name: string
  type: LessonType
  start: Date
  end: Date
  lessonNumber: number
  teachers: TeacherData[]
  groups: GroupData | string
  auditory: string
  isDistant: boolean
}

type LessonType = "default"

export type { LessonData, LessonType }
