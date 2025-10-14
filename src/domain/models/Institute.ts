import type { InstituteDto } from "@/api/search-schedule/dto/InstitutesDto.ts"
import type { SearchItem } from "@/domain/types/Search.ts"
import type { GroupData } from "@/domain/models/Group.ts"

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

type InstituteType =
  | "default"
  | "architecture"
  | "chemical"
  | "correspondence"
  | "civil"
  | "magic"
  | "economic"
  | "digital"
  | "collage"

interface InstituteData {
  id: string
  name: string
  groups: GroupData[]
}

interface InstitutesData {
  lastUpdate: number
  institutes: InstituteData[]
}

const toInstituteData = (dto: InstituteDto): InstituteData => {
  return {
    id: dto.name,
    name: dto.name,
    groups: dto.groups.map((group) => {
      return {
        id: group,
        name: group,
      }
    }),
  }
}

const toInstituteUi = (data: InstituteData): InstituteUi => {
  let instituteType: InstituteType = "default"
  let searchItem: SearchItem = {
    id: data.id,
    type: instituteType,
    searchableValue: data.name,
  }

  const instituteName = data.name as InstituteName

  if (instituteName === undefined) {
    return searchItem
  }

  switch (instituteName) {
    case "Химико-технологический факультет":
      instituteType = "chemical"
      break
    case "Заочная форма обучения":
      instituteType = "correspondence"
      break
    case "Заочный форма обучения (отделение УОП)":
      instituteType = "correspondence"
      break
    case "Институт архитектуры и дизайна":
      instituteType = "architecture"
      break
    case "Институт инженеров строительства и транспорта":
      instituteType = "civil"
      break
    case "Институт Магии и Игр":
      instituteType = "magic"
      break
    case "Институт химии и химической технологии":
      instituteType = "chemical"
      break
    case "Институт инженерии и машиностроения":
      instituteType = "civil"
      break
    case "Институт экономики и менеджмента":
      instituteType = "economic"
      break
    case "Институт цифровых систем":
      instituteType = "digital"
      break
    case "Колледж":
      instituteType = "collage"
      break
  }
  searchItem = { ...searchItem, type: instituteType }
  return searchItem
}

export {
  type InstituteUi,
  type InstituteType,
  type InstituteName,
  type InstituteData,
  type InstitutesData,
  toInstituteData,
  toInstituteUi,
}
