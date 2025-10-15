import type { ProfileType } from "@/domain/models/Profile.ts"
import type { WeekData } from "./WeekData"

interface ScheduleData {
  weeks: WeekData[]
  id: number
  name: string
  type: ProfileType
  view: ScheduleView
  lastUpdate: Date
}

type ScheduleView = "calendar" | "week"

export type { ScheduleData, ScheduleView }
