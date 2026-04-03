interface TeacherData {
  id: number
  name: string
}

interface TeachersData {
  teachers: TeacherData[]
  lastUpdate: number | null
}

export type { TeacherData, TeachersData }
