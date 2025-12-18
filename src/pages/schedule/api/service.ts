import { queryOptions, useQuery } from "@tanstack/react-query"
import {
  getScheduleByGroupId,
  getScheduleByTeacherId,
} from "@/pages/schedule/api/requests.ts"
import { toScheduleData } from "@/pages/schedule/lib/toScheduleData.ts"
import type { GroupData } from "@/entities/Group.ts"
import type { TeacherData } from "@/entities/Teachers.ts"
import { type BaseProfile, PROFILE_TYPE } from "@/entities/Profile.ts"
import { dbService } from "@/app/store/indexDb/indexDb.ts"
import axios from "axios"
import { toScheduleUi } from "@/app/store/indexDb/models/ScheduleDataDB.ts"
import type {
  ScheduleData,
  ScheduleDataStatus,
} from "@/entities/ScheduleData.ts"
import { PROGRESS_STATUS } from "@shared/models/DataStatus.ts"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"

const getScheduleByProfileOptions = (
  profile: BaseProfile,
  onCacheData: (scheduleData: ScheduleDataStatus) => void,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) =>
  queryOptions({
    queryKey: ["schedule", profile.profileType, profile.apiId, profile.id],
    queryFn: async (): Promise<ScheduleDataStatus | undefined> => {
      const existingScheduleData = await dbService.getSchedule(profile.id)
      let existingScheduleDataUi: ScheduleData | null = null

      const isCacheValid = existingScheduleData !== undefined

      if (isCacheValid) {
        existingScheduleDataUi = toScheduleUi(existingScheduleData)
        onCacheData({
          data: existingScheduleDataUi,
          status: PROGRESS_STATUS.loading,
        })
      }

      try {
        const response =
          profile.profileType === PROFILE_TYPE.student
            ? await getScheduleByGroupId(profile.apiId)
            : await getScheduleByTeacherId(profile.apiId)

        const newScheduleData = await toScheduleData(
          response.data,
          actualGroups,
          actualTeachers
        )
        dbService.saveSchedule(profile.id, newScheduleData).then(() => {
          console.log(`Schedule saved successfully ${profile.id}`)
        })

        mainContainer
          .get(ProfilesStore)
          .updateLastUpdateTimeById(profile.id)
          .then(() => {
            console.log(`Schedule ${profile.id}`)
          })

        return { data: newScheduleData, status: PROGRESS_STATUS.success }
      } catch (error) {
        if (axios.isAxiosError(error) && !error.response && isCacheValid) {
          console.log("Using cached data due to network error")
          return {
            data: existingScheduleDataUi!,
            status: PROGRESS_STATUS.error,
          }
        }
        throw error
      }
    },
    refetchOnWindowFocus: false,
    select: (data) => data,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return failureCount < 1
      }
      return failureCount < 2
    },
    networkMode: "always",
    refetchOnReconnect: "always",
  })

const useGetScheduleByProfileQuery = (
  profile: BaseProfile,
  onCacheData: (scheduleData: ScheduleDataStatus) => void,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) =>
  useQuery(
    getScheduleByProfileOptions(
      profile,
      onCacheData,
      actualGroups,
      actualTeachers
    )
  )

export { useGetScheduleByProfileQuery, getScheduleByProfileOptions }
