import { LocalStorageManager } from "@/app/store/browser-storages"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { getGroupsByInstitutes } from "@shared/api/search-schedule/requests.ts"
import {
  type InstitutesData,
  toInstituteData,
} from "@/domain/models/Institute.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { dbService } from "@/app/store/browser-storages/indexDb.ts"
import axios from "axios"

const getInstitutes = async () => {
  const savedData = await dbService.getAll("institutes")
  const lastUpdate = LocalStorageManager.get<number>("institutesLastUpdate")
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
    LocalStorageManager.set("institutesLastUpdate", Date.now())
    return newData.institutes
  } catch (e) {
    if (axios.isAxiosError(e) && !e.response) {
      console.log(e)
      if (savedData.length === 0) {
        console.log("Empty saved data")
        throw e
      }
      institutesStore.setInstitutesData({
        lastUpdate: lastUpdate ? lastUpdate : Date.now(),
        institutes: savedData,
      })
      return savedData
    }
    throw e
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
    staleTime: 100000,
  })
}

const useGetGroupsByInstitutesQuery = () =>
  useSuspenseQuery(getGroupsByInstitutesQueryOptions())

export {
  getInstitutes,
  getGroupsByInstitutesQueryOptions,
  useGetGroupsByInstitutesQuery,
}
