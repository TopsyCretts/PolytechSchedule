import { type QueryKey, queryOptions, useQuery } from "@tanstack/react-query"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"
import {
  type BaseProfile,
  PROFILE_TYPE,
} from "@/entities/profile/model/Profile.ts"
import { mainContainer } from "@/shared/models/providers/mainContainer.ts"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"
import { queryClient } from "@/shared/api"
import { ProfileCacheService } from "@/features/profile/model/ProfileCacheService.ts"

const getScheduleByProfileOptions = (
  profile: BaseProfile,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) => {
  const queryKey: QueryKey = [
    "schedule",
    profile.profileType,
    profile.apiId,
    profile.id,
  ]
  return queryOptions({
    queryKey,
    queryFn: async () => {
      const profileCacheService = mainContainer.get(ProfileCacheService)
      const existingScheduleData =
        await profileCacheService.getScheduleByProfileId(profile.id)

      const isCacheValid = existingScheduleData !== undefined

      if (isCacheValid) {
        queryClient.setQueryData(queryKey, existingScheduleData)
      }

      const api = mainContainer.get(AppApiStore).getApiInstance
      const newScheduleData =
        profile.profileType === PROFILE_TYPE.student
          ? await api.getScheduleByGroupId(
              profile.name,
              actualGroups,
              actualTeachers
            )
          : await api.getScheduleByTeacherId(
              profile.apiId,
              actualGroups,
              actualTeachers
            )

      if (profile.id > 0) {
        await profileCacheService.updateProfileSchedule(
          profile.id,
          newScheduleData
        )
        await mainContainer
          .get(ProfilesManagerStore)
          .updateLastUpdateTimeById(profile.id)
      }

      return newScheduleData
    },
    refetchOnWindowFocus: false,
    select: (data) => data,
    retry: (failureCount) => {
      return failureCount < 1
    },
    networkMode: "always",
    refetchOnReconnect: "always",
  })
}

const useGetScheduleByProfileQuery = (
  profile: BaseProfile,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) =>
  useQuery(getScheduleByProfileOptions(profile, actualGroups, actualTeachers))

export { useGetScheduleByProfileQuery, getScheduleByProfileOptions }
