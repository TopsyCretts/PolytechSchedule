import { axiosClient } from "@/api"
import type {
  GroupScheduleDto,
  TeacherScheduleDto,
} from "@/pages/schedule/api/dto/ScheduleDto.ts"

const getScheduleByGroupId = async (groupId: number) =>
  axiosClient.get<GroupScheduleDto>(`/schedule/group/${groupId}`)

const getScheduleByTeacherId = (teacherId: number) =>
  axiosClient.get<TeacherScheduleDto>(`/schedule/teacher/${teacherId}`)

export { getScheduleByGroupId, getScheduleByTeacherId }
