interface InstitutesDto {
  items: InstituteDto[]
}

interface InstituteDto {
  id: number
  name: string
  groups: GroupDto[]
}

interface GroupDto {
  groupId: number
  name: string
}

export type { InstituteDto, InstitutesDto, GroupDto }
