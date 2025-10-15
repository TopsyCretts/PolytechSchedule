import { axiosClient } from "@/api"

const getScheduleByGroupId = (groupId: string) =>
  axiosClient.get(`/schedule/group/${groupId}`)

const getScheduleByTeacherId = (teacherId: string) =>
  axiosClient.get(`/schedule/teacher/${teacherId}`)

export { getScheduleByGroupId, getScheduleByTeacherId }
