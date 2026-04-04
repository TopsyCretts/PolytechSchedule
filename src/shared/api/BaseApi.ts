import type { AxiosInstance } from "axios"
import type { ApiMapper } from "@/shared/api/ApiMapper.ts"
import type { InstituteData } from "@/shared/api/entities/Institute.ts"
import type { ScheduleData } from "@/shared/api/entities/ScheduleData.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"

export abstract class BaseApi {
  protected abstract apiMapper: ApiMapper
  protected constructor(protected axiosClient: AxiosInstance) {}

  abstract getGroupsByInstitutes(): Promise<InstituteData[]>
  abstract getTeachers(): Promise<TeacherData[]>
  abstract getScheduleByGroupId(
    groupId: string,
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): Promise<ScheduleData>
  abstract getScheduleByTeacherId(
    teacherId: string | number,
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): Promise<ScheduleData>
}
