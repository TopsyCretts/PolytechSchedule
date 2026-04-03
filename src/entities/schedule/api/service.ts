import { queryOptions, useQuery } from "@tanstack/react-query"
import { toScheduleData } from "@/entities/schedule/api/mappers.ts"
import type { GroupData } from "@/entities/institute/model/Group.ts"
import type { TeacherData } from "@/entities/teachers/model/Teachers.ts"
import {
  type BaseProfile,
  PROFILE_TYPE,
} from "@/entities/profile/model/Profile.ts"
import { DBRepository } from "@/app/store/indexDb/indexDb.ts"
import { toScheduleUi } from "@/app/store/indexDb/models/ScheduleDataDB.ts"
import type {
  ScheduleData,
  ScheduleDataStatus,
} from "@/entities/schedule/model/ScheduleData.ts"
import {
  PROGRESS_STATUS,
  type ProgressStatus,
} from "@/shared/models/DataStatus.ts"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"

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
      const existingScheduleData = await DBRepository.getSchedule(profile.id)
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

      const api = mainContainer.get(AppApiStore).getApiInstance

      try {
        const response =
          profile.profileType === PROFILE_TYPE.student
            ? await api.getScheduleByGroupId(profile.name)
            : await api.getScheduleByTeacherId(profile.apiId)

        const newScheduleData = await toScheduleData(
          response,
          actualGroups,
          actualTeachers
        )

        if (profile.id > 0) {
          await DBRepository.saveSchedule(profile.id, newScheduleData)
          await mainContainer
            .get(ProfilesManagerStore)
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
