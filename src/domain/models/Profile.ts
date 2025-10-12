type ScheduleType = "student" | "teacher"

interface BaseProfile {
  id: string
  name: string
  scheduleType: ScheduleType
  lastUsed: Date
}

interface StudentProfile extends BaseProfile {
  institute: string
  group: string
}

interface TeacherProfile extends BaseProfile {
  teacherName: string
}

type Profile = StudentProfile | TeacherProfile

interface ProfilesState {
  profiles: Profile[]
  activeProfileId: string | null
}

export type {
  ScheduleType,
  BaseProfile,
  StudentProfile,
  TeacherProfile,
  Profile,
  ProfilesState,
}
