import type { ScheduleView } from "@/shared/api/entities/ScheduleData.ts"

const PROFILE_TYPE = {
  student: "student",
  teacher: "teacher",
} as const

type ProfileType = keyof typeof PROFILE_TYPE

interface BaseProfile {
  id: number
  apiId: number
  name: string
  profileType: ProfileType
  lastUpdateAt: Date | null
  selectedViewType: ScheduleView
}

interface StudentProfile extends BaseProfile {
  institute: string
}

type TeacherProfile = BaseProfile

type Profile = StudentProfile | TeacherProfile

export type {
  ProfileType,
  BaseProfile,
  StudentProfile,
  TeacherProfile,
  Profile,
}
export { PROFILE_TYPE }
