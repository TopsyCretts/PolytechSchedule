import type { GroupData } from "@/shared/api/entities/Group.ts"

interface InstituteData {
  id: number
  name: string
  groups: GroupData[]
}

interface InstitutesData {
  lastUpdate: number | null
  institutes: InstituteData[]
}

export { type InstituteData, type InstitutesData }
