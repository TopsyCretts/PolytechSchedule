import { queryOptions, useQuery } from "@tanstack/react-query"
import {
  getScheduleByGroupId,
  getScheduleByTeacherId,
} from "@/pages/schedule/api/requests.ts"
import { toScheduleData } from "@/pages/schedule/api/toScheduleData.ts"
import type { GroupData } from "@/entities/Group.ts"
import type { TeacherData } from "@/entities/Teachers.ts"
import { type BaseProfile, PROFILE_TYPE } from "@/entities/Profile.ts"
import { dbService } from "@/app/store/indexDb/indexDb.ts"
import { toScheduleUi } from "@/app/store/indexDb/models/ScheduleDataDB.ts"
import type { ScheduleData, ScheduleDataStatus } from "@/entities/ScheduleData"
import {
  PROGRESS_STATUS,
  type ProgressStatus,
} from "@/shared/models/DataStatus"
import { mainContainer } from "@/app/store/mainContainer"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore"

const getScheduleByProfileOptions = (
  profile: BaseProfile,
  onCacheData: (scheduleData: ScheduleDataStatus) => void,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[],
  initialStatus: ProgressStatus
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
          status:
            initialStatus === PROGRESS_STATUS.error
              ? initialStatus
              : PROGRESS_STATUS.loading,
        })
      }

      try {
        const response =
          profile.profileType === PROFILE_TYPE.student
            ? await getScheduleByGroupId(profile.name)
            : await getScheduleByTeacherId(profile.apiId)

        const newScheduleData = await toScheduleData(
          response.data,
          actualGroups,
          actualTeachers
        )

        if (profile.id > 0) {
          await dbService.saveSchedule(profile.id, newScheduleData)
          await mainContainer
            .get(ProfilesStore)
            .updateLastUpdateTimeById(profile.id)
        }

        return { data: newScheduleData, status: PROGRESS_STATUS.success }
      } catch (error) {
        if (isCacheValid) {
          onCacheData({
            data: existingScheduleDataUi!,
            status: PROGRESS_STATUS.error,
          })
        }
        throw error
      }
    },
    refetchOnWindowFocus: false,
    select: (data) => data,
    retry: (failureCount) => {
      return failureCount < 1
    },
    networkMode: "always",
    refetchOnReconnect: "always",
  })

const useGetScheduleByProfileQuery = (
  profile: BaseProfile,
  onCacheData: (scheduleData: ScheduleDataStatus) => void,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[],
  initialStatus: ProgressStatus
) =>
  useQuery(
    getScheduleByProfileOptions(
      profile,
      onCacheData,
      actualGroups,
      actualTeachers,
      initialStatus
    )
  )

export { useGetScheduleByProfileQuery, getScheduleByProfileOptions }
