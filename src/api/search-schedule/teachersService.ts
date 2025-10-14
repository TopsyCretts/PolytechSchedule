import { getTeachers } from "@/api/search-schedule/requests.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { LocalStorageManager } from "@/domain/browserStorages"
import { mainContainer } from "@/mainContainer.ts"
import { TeachersStore } from "@/domain/teachers/TeachersStore.ts"
import type { TeachersData } from "@/domain/models/Teachers.ts"

const getTeachersFromStorageOrRefetch = async () => {
  const savedData = await LocalStorageManager.getTeachersData()
  const now = Date.now()
  if (savedData !== null && savedData.teachers.length > 0) {
    const isExpired = now - savedData.lastUpdate >= 24 * 60 * 60 * 1000
    if (!isExpired) {
      mainContainer.get(TeachersStore).setTeachersData(savedData)
      return savedData.teachers
    }
  }
  const response = await getTeachers()
  const dto = response.data
  const newData: TeachersData = {
    lastUpdate: now,
    teachers: dto.items.map((item) => {
      return { id: String(item.id), name: item.name }
    }),
  }
  mainContainer.get(TeachersStore).setTeachersData(newData)
  return newData.teachers
}

const getTeachersQueryOptions = () => {
  return queryOptions({
    queryFn: getTeachersFromStorageOrRefetch,
    queryKey: ["teachers"],
    select: (data) => data,
    staleTime: 100000,
  })
}

const useGetTeachersQuery = () => useSuspenseQuery(getTeachersQueryOptions())

export { useGetTeachersQuery, getTeachersQueryOptions }
