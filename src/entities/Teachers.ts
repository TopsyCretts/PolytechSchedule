interface TeacherData {
  id: number
  name: string
}

interface TeachersData {
  teachers: TeacherData[]
  lastUpdate: number
}

export type { TeacherData, TeachersData }
