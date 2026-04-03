import type { InstituteDto } from "@/shared/api/dto/InstitutesDto.ts"
import type { GroupData } from "@/entities/institute/model/Group.ts"

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

export { type InstituteData, type InstitutesData, toInstituteData }
