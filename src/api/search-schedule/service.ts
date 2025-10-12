import { useSuspenseQuery } from "@tanstack/react-query"
import {
  getGroupsByInstitutes,
  getTeachers,
} from "@/api/search-schedule/requests.ts"

const useGetGroupsByInstitutesQuery = () =>
  useSuspenseQuery({
    queryFn: getGroupsByInstitutes,
    queryKey: ["institutes"],
    select: (data) => data.data.items,
  })

const useGetTeachersQuery = () =>
  useSuspenseQuery({
    queryFn: getTeachers,
    queryKey: ["teachers"],
    select: (data) => data.data.items,
  })

export { useGetTeachersQuery, useGetGroupsByInstitutesQuery }
