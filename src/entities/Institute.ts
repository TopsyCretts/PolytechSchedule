import type { InstituteDto } from "@/shared/api/search-schedule/dto/InstitutesDto.ts"
import type { SearchItem } from "@/shared/models/Search"
import type { GroupData } from "@/entities/Group"

type InstituteUi = SearchItem

type InstituteName =
  | "Химико-технологический факультет"
  | "Заочная форма обучения"
  | "Заочный форма обучения (отделение УОП)"
  | "Институт архитектуры и дизайна"
  | "Институт инженеров строительства и транспорта"
  | "Институт Магии и Игр"
  | "Институт химии и химической технологии"
  | "Институт экономики и менеджмента"
  | "Институт цифровых систем"
  | "Институт инженерии и машиностроения"
  | "Колледж"

interface InstituteData {
  id: number
  name: string
  groups: GroupData[]
}

interface InstitutesData {
  lastUpdate: number | null
  institutes: InstituteData[]
}

const toInstituteData = (dto: InstituteDto): InstituteData => {
  return {
    id: dto.id,
    name: dto.name,
    groups: dto.groups.map((group) => {
      return {
        id: group.groupId,
        name: group.name,
      }
    }),
  }
}

export {
  type InstituteUi,
  type InstituteName,
  type InstituteData,
  type InstitutesData,
  toInstituteData,
}
