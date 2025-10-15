type ProfileType = "student" | "teacher"

interface BaseProfile {
  id: number
  name: string
  profileType: ProfileType
  lastUsed: Date
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
