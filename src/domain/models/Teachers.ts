interface TeacherData {
  id: string
  name: string
}

interface TeachersData {
  teachers: TeacherData[]
  lastUpdate: number
}

export { type TeacherData, type TeachersData }
