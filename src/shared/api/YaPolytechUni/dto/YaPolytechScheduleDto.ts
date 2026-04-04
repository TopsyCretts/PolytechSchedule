import type { TeacherDto } from "@/shared/api/YaPolytechUni/dto/YaPolytechTeachersDto.ts"

interface TeacherScheduleDto {
  teacher: TeacherDto
  items: ScheduleWeekDto[]
}

interface GroupScheduleDto {
  items: ScheduleWeekDto[]
}

interface ScheduleWeekDto {
  number: number
  days: ScheduleDayDto[]
}

interface ScheduleDayDto {
  info: DayInfo
  lessons: ScheduleLessonDto[]
}

interface DayInfo {
  type: number
  weekNumber: number
  date: string
}

interface ScheduleLessonDto {
  groups?: string[]
  number: number
  startAt: string
  endAt: string
  parity?: number
  lessonName: string
  type: number
  isStream: boolean
  isDivision: boolean
  teacherName?: string
  teacherId?: number
  auditoryName?: string
  isDistant?: boolean
  isShort?: boolean
  isLecture?: boolean
  additionalTeacherName?: string
  additionalTeacherId?: number
  subInfo?: string
}

export type {
  TeacherScheduleDto,
  GroupScheduleDto,
  ScheduleWeekDto,
  ScheduleDayDto,
  DayInfo,
  ScheduleLessonDto,
}
