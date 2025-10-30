import { axiosClient } from "@shared/api/axiosClient.ts"
import type { TeachersDto } from "@shared/api/search-schedule/dto/TeachersDto.ts"
import type { InstitutesDto } from "@shared/api/search-schedule/dto/InstitutesDto.ts"

const getGroupsByInstitutes = async () =>
  axiosClient.get<InstitutesDto>("/schedule/actual_groups", {
    params: { additional: true },
  })

const getTeachers = async () =>
  axiosClient.get<TeachersDto>("/schedule/actual_teachers")

export { getGroupsByInstitutes, getTeachers }
