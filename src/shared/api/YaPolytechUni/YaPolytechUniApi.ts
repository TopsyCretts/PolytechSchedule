import { BaseApi } from "@/shared/api/BaseApi.ts"
import type { YaPolytechInstitutesDto } from "@/shared/api/YaPolytechUni/dto/YaPolytechInstitutesDto.ts"
import type {
  GroupScheduleDto,
  TeacherScheduleDto,
} from "@/shared/api/YaPolytechUni/dto/YaPolytechScheduleDto.ts"
import type { YaPolytechTeachersDto } from "@/shared/api/YaPolytechUni/dto/YaPolytechTeachersDto.ts"
import { axiosClient, BASE_URL } from "@/shared/api/axiosClient.ts"
import { YaPolytechApiMapper } from "@/shared/api/YaPolytechUni/YaPolytechApiMapper.ts"
import type { InstituteData } from "@/shared/api/entities/Institute.ts"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"
import type { ScheduleData } from "@/shared/api/entities/ScheduleData.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"

export class YaPolytechUniApi extends BaseApi {
  apiMapper: YaPolytechApiMapper = new YaPolytechApiMapper()
  constructor() {
    super(axiosClient(BASE_URL))
  }
  async getGroupsByInstitutes(): Promise<InstituteData[]> {
    const response = await this.axiosClient.get<YaPolytechInstitutesDto>(
      "/schedule/actual_groups",
      {
        params: { additional: true },
      }
    )

    return response.data.items.map(this.apiMapper.toInstituteData)
  }
  async getTeachers(): Promise<TeacherData[]> {
    const response = await this.axiosClient.get<YaPolytechTeachersDto>(
      "/schedule/actual_teachers"
    )
    return response.data.items.map(this.apiMapper.toTeacherData)
  }
  async getScheduleByGroupId(
    groupId: string,
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): Promise<ScheduleData> {
    const response = await this.axiosClient.get<GroupScheduleDto>(
      `/schedule/group/${groupId}`
    )
    return this.apiMapper.toScheduleData(
      response.data,
      allActualGroups,
      actualTeachers
    )
  }
  async getScheduleByTeacherId(
    teacherId: string,
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): Promise<ScheduleData> {
    const response = await this.axiosClient.get<TeacherScheduleDto>(
      `/schedule/teacher/${teacherId}`
    )
    return this.apiMapper.toScheduleData(
      response.data,
      allActualGroups,
      actualTeachers
    )
  }
}
