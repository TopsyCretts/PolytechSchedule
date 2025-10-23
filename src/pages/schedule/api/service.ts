import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import {
  getScheduleByGroupId,
  getScheduleByTeacherId,
} from "@/pages/schedule/api/requests.ts"
import { toScheduleData } from "@/pages/schedule/lib/toScheduleData.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { BaseProfile } from "@/domain/models/Profile.ts"

const getScheduleByProfileOptions = (
  profile: BaseProfile,
  actualGroups: GroupData[],
  actualTeachers: TeacherData[]
) =>
  queryOptions({
    queryKey: ["schedule", profile.profileType, profile.id],
    queryFn: async () => {
      const response =
        profile.profileType === "student"
          ? await getScheduleByGroupId(profile.id)
          : await getScheduleByTeacherId(profile.id)
      return await toScheduleData(
        response.data,
        profile,
        actualGroups,
        actualTeachers
      )
    },
    select: (data) => data,
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
