interface YaPolytechTeachersDto {
  isCash: boolean
  items: TeacherDto[]
}

interface TeacherDto {
  id: number
  name: string
}

export type { YaPolytechTeachersDto, TeacherDto }
