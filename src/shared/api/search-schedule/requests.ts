import { axiosClient } from "@/shared/api/axiosClient"
import type { TeachersDto } from "@/shared/api/search-schedule/dto/TeachersDto"
import type { InstitutesDto } from "@/shared/api/search-schedule/dto/InstitutesDto"

const getGroupsByInstitutes = async () =>
  axiosClient.get<InstitutesDto>("/schedule/actual_groups", {
    params: { additional: true },
  })

const getTeachers = async () =>
  axiosClient.get<TeachersDto>("/schedule/actual_teachers")

export { getGroupsByInstitutes, getTeachers }
