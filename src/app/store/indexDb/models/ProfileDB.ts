import type { ProfileType } from "@/entities/Profile.ts"
import type { ScheduleView } from "@/entities/ScheduleData.ts"

type BaseProfileDB = {
  apiId: number
  name: string
  profileType: ProfileType
  lastUpdateAt: Date | null
  selectedViewType: ScheduleView
}

interface StudentProfileDB extends BaseProfileDB {
  institute: string
}

type ProfileDB = StudentProfileDB | BaseProfileDB

export type { StudentProfileDB, BaseProfileDB, ProfileDB }
