import type { InstitutesDto } from "@/shared/api/dto/InstitutesDto.ts"
import type { TeachersDto } from "@/shared/api/dto/TeachersDto.ts"
import type {
  GroupScheduleDto,
  TeacherScheduleDto,
} from "@/shared/api/dto/ScheduleDto.ts"
import type { AxiosInstance } from "axios"

export abstract class BaseApi {
  protected constructor(protected axiosClient: AxiosInstance) {}

  abstract getGroupsByInstitutes(): Promise<InstitutesDto>
  abstract getTeachers(): Promise<TeachersDto>
  abstract getScheduleByGroupId(groupId: string): Promise<GroupScheduleDto>
  abstract getScheduleByTeacherId(
    teacherId: string | number
  ): Promise<TeacherScheduleDto>
}
