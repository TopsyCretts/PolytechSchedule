import { queryOptions, useQuery } from "@tanstack/react-query"
import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { TeachersStore } from "@/entities/teachers/model/TeachersStore.ts"
import type { TeachersData } from "@/entities/teachers/model/Teachers.ts"
import axios from "axios"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"

const getTeachers = async () => {
  const now = Date.now()
  const teachersStore = mainContainer.get<TeachersStore>(TeachersStore)
  const api = mainContainer.get(AppApiStore)
  const dto = await api.getApiInstance.getTeachers()
  const newData: TeachersData = {
    lastUpdate: now,
    teachers: dto.items,
  }
  teachersStore.setTeachersData(newData)
  LocalStorageRepository.set(LOCAL_STORAGE_KEY.teachersLastUpdate, now)
  return newData.teachers
}

const getTeachersQueryOptions = () => {
  return queryOptions({
    queryFn: getTeachers,
    queryKey: ["teachers"],
    select: (data) => data,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return failureCount < 1
      }
      return failureCount < 2
    },
    refetchOnReconnect: "always",
    networkMode: "always",
  })
}

const useGetTeachersQuery = () => useQuery(getTeachersQueryOptions())

export { useGetTeachersQuery, getTeachersQueryOptions }
