import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import {
  type InstitutesData,
  toInstituteData,
} from "@/entities/institute/model/Institute.ts"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { DBRepository, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import axios from "axios"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"

const getInstitutes = async () => {
  const savedData = await DBRepository.getAll(STORE_NAMES.institutes)
  const lastUpdate = LocalStorageRepository.get<number>(
    LOCAL_STORAGE_KEY.institutesLastUpdate
  )
  const institutesStore = mainContainer.get(InstitutesStore)
  const api = mainContainer.get(AppApiStore).getApiInstance
  try {
    const dto = await api.getGroupsByInstitutes()
    const dataArray = dto.items.map((instituteDto) =>
      toInstituteData(instituteDto)
    )
    const newData: InstitutesData = {
      lastUpdate: Date.now(),
      institutes: dataArray,
    }
    institutesStore.setInstitutesData(newData)
    LocalStorageRepository.set<number>(
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
