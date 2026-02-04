import { axiosClient } from "@/shared/api"
import type {
  GroupScheduleDto,
  TeacherScheduleDto,
} from "@/pages/schedule/api/dto/ScheduleDto"

const getScheduleByGroupId = async (groupName: string) =>
  axiosClient.get<GroupScheduleDto>(`/schedule/group/${groupName}`)

const getScheduleByTeacherId = (teacherId: number) =>
  axiosClient.get<TeacherScheduleDto>(`/schedule/teacher/${teacherId}`)

export { getScheduleByGroupId, getScheduleByTeacherId }
