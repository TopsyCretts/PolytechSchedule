interface InstitutesDto {
  isCash: boolean
  items: InstituteDto[]
}

interface InstituteDto {
  name: string
  groups: string[]
}

export type { InstituteDto, InstitutesDto }
