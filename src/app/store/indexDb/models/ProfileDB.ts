import type { ProfileType } from "@/entities/profile/model/Profile.ts"
import type { ScheduleView } from "@/entities/schedule/model/ScheduleData.ts"

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
