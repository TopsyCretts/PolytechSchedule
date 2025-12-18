import { LocalStorageManager } from "@/app/store/browser-storages"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { getGroupsByInstitutes } from "@shared/api/search-schedule/requests.ts"
import { type InstitutesData, toInstituteData } from "@/entities/Institute.ts"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { dbService, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import axios from "axios"
import { LOCAL_STORAGE_KEY } from "@shared/constants/contstants.ts"

const getInstitutes = async () => {
  const savedData = await dbService.getAll(STORE_NAMES.institutes)
  const lastUpdate = LocalStorageManager.get<number>(
    LOCAL_STORAGE_KEY.institutesLastUpdate
  )
  const institutesStore = mainContainer.get(InstitutesStore)
  try {
    const response = await getGroupsByInstitutes()
    const dto = response.data
    const dataArray = dto.items.map((instituteDto) =>
      toInstituteData(instituteDto)
    )
    const newData: InstitutesData = {
      lastUpdate: Date.now(),
      institutes: dataArray,
    }
    institutesStore.setInstitutesData(newData)
    LocalStorageManager.set<number>(
      LOCAL_STORAGE_KEY.institutesLastUpdate,
      Date.now()
    )
    return newData.institutes
  } catch (e) {
    if (savedData.length === 0) {
      throw e
    }
    institutesStore.setInstitutesData({
      lastUpdate: lastUpdate ? lastUpdate : null,
      institutes: savedData,
    })
    return savedData
  }
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

const useGetGroupsByInstitutesQuery = () =>
  useQuery(getGroupsByInstitutesQueryOptions())

export {
  getInstitutes,
  getGroupsByInstitutesQueryOptions,
  useGetGroupsByInstitutesQuery,
}
