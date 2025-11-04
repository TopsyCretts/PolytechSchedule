import { getTeachers } from "@shared/api/search-schedule/requests.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { LocalStorageManager } from "@/app/store/browser-storages"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import type { TeachersData } from "@/domain/models/Teachers.ts"
import { dbService } from "@/app/store/browser-storages/indexDb.ts"
import axios from "axios"

const getTeachersFromStorageOrRefetch = async () => {
  const savedData = await dbService.getAll("teachers")
  const lastUpdate = LocalStorageManager.get<number>("teachersLastUpdate")
  const now = Date.now()
  const teachersStore = mainContainer.get<TeachersStore>(TeachersStore)
  try {
    const response = await getTeachers()
    const dto = response.data
    const newData: TeachersData = {
      lastUpdate: now,
      teachers: dto.items,
    }
    teachersStore.setTeachersData(newData)
    LocalStorageManager.set("teachersLastUpdate", now)
    return newData.teachers
  } catch (e) {
    if (axios.isAxiosError(e) && !e.response) {
      console.log(e)
      if (savedData.length === 0) {
        console.log("Empty saved data")
        throw e
      }
      teachersStore.setTeachersData({
        lastUpdate: lastUpdate ? lastUpdate : Date.now(),
        teachers: savedData,
      })
      return savedData
    }
    throw e
  }
}

const getTeachersQueryOptions = () => {
  return queryOptions({
    queryFn: getTeachersFromStorageOrRefetch,
    queryKey: ["teachers"],
    select: (data) => data,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return failureCount < 1
      }
      return failureCount < 2
    },
    staleTime: 100000,
  })
}

const useGetTeachersQuery = () => useSuspenseQuery(getTeachersQueryOptions())

export { useGetTeachersQuery, getTeachersQueryOptions }
