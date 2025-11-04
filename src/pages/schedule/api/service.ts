import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import {
  getScheduleByGroupId,
  getScheduleByTeacherId,
} from "@/pages/schedule/api/requests.ts"
import { toScheduleData } from "@/pages/schedule/lib/toScheduleData.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { BaseProfile } from "@/domain/models/Profile.ts"
import { dbService } from "@/app/store/browser-storages/indexDb.ts"
import axios from "axios"
import { toScheduleUi } from "@/app/store/browser-storages/types.ts"

const getScheduleByProfileOptions = (
  profile: BaseProfile,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) =>
  queryOptions({
    queryKey: ["schedule", profile.profileType, profile.id],
    queryFn: async () => {
      const existingScheduleData = await dbService.getSchedule(profile.id)

      const isCacheValid = existingScheduleData !== undefined

      try {
        const response =
          profile.profileType === "student"
            ? await getScheduleByGroupId(profile.id)
            : await getScheduleByTeacherId(profile.id)
        const newScheduleData = await toScheduleData(
          response.data,
          profile,
          actualGroups,
          actualTeachers
        )
        dbService.saveSchedule(newScheduleData).then(() => {
          console.log(`Schedule saved successfully ${newScheduleData.id}`)
        })
        return newScheduleData
      } catch (error) {
        if (axios.isAxiosError(error) && !error.response && isCacheValid) {
          console.log("Using cached data due to network error")
          return toScheduleUi(existingScheduleData!)
        }
        throw error
      }
    },
    select: (data) => data,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return failureCount < 1
      }
      return failureCount < 2
    },
  })

const useGetScheduleByProfileQuery = (
  profile: BaseProfile,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) =>
  useSuspenseQuery(
    getScheduleByProfileOptions(profile, actualGroups, actualTeachers)
  )

export { useGetScheduleByProfileQuery, getScheduleByProfileOptions }
