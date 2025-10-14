interface InstitutesDto {
  isCash: boolean
  items: InstituteDto[]
}

interface InstituteDto {
  name: string
  groups: GroupDto[]
}

type GroupDto = string

export type { InstituteDto, InstitutesDto, GroupDto }
