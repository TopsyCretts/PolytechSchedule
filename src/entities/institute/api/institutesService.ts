import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { mainContainer } from "@/shared/models/providers/mainContainer.ts"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { type InstitutesData } from "@/shared/api/entities/Institute.ts"
import { queryOptions } from "@tanstack/react-query"
import axios from "axios"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"

const getInstitutes = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  const api = mainContainer.get(AppApiStore).getApiInstance
  const data = await api.getGroupsByInstitutes()
  const newData: InstitutesData = {
    lastUpdate: Date.now(),
    institutes: data.sort((a, b) => a.name.localeCompare(b.name, "ru")),
  }
  const institutesStore = mainContainer.get(InstitutesStore)
  institutesStore.setInstitutesData(newData)
  LocalStorageRepository.set<number>(
    LOCAL_STORAGE_KEY.institutesLastUpdate,
    Date.now()
  )
  return newData.institutes
}

const getGroupsByInstitutesQueryOptions = () => {
  return queryOptions({
    queryFn: getInstitutes,
    queryKey: ["institutes"],
    select: (data) => data,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return failureCount < 1
      }
      return failureCount < 2
    },
    networkMode: "always",
    refetchOnReconnect: "always",
  })
}

export { getInstitutes, getGroupsByInstitutesQueryOptions }
