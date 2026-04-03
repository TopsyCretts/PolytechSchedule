import { BaseApi } from "@/shared/api/BaseApi.ts"
import type { InstitutesDto } from "./dto/InstitutesDto"
import type { GroupScheduleDto, TeacherScheduleDto } from "./dto/ScheduleDto"
import type { TeachersDto } from "./dto/TeachersDto"
import { axiosClient, BASE_URL } from "@/shared/api/axiosClient.ts"

export class YaPolytechUniApi extends BaseApi {
  constructor() {
    super(axiosClient(BASE_URL))
  }
  async getGroupsByInstitutes(): Promise<InstitutesDto> {
    const response = await this.axiosClient.get<InstitutesDto>(
      "/schedule/actual_groups",
      {
        params: { additional: true },
      }
    )

    return response.data
  }
  async getTeachers(): Promise<TeachersDto> {
    const response = await this.axiosClient.get<TeachersDto>(
      "/schedule/actual_teachers"
    )
    return response.data
  }
  async getScheduleByGroupId(groupId: string): Promise<GroupScheduleDto> {
    const response = await this.axiosClient.get<GroupScheduleDto>(
      `/schedule/group/${groupId}`
    )
    return response.data
  }
  async getScheduleByTeacherId(teacherId: string): Promise<TeacherScheduleDto> {
    const response = await this.axiosClient.get<TeacherScheduleDto>(
      `/schedule/teacher/${teacherId}`
    )
    return response.data
  }
}
