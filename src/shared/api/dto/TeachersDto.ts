interface TeachersDto {
  isCash: boolean
  items: TeacherDto[]
}

interface TeacherDto {
  id: number
  name: string
}

export type { TeachersDto, TeacherDto }
