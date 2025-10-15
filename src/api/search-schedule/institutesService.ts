import { LocalStorageManager } from "@/domain/browser-storages"
import { mainContainer } from "@/mainContainer.ts"
import { InstitutesStore } from "@/domain/institutes/InstitutesStore.ts"
import { getGroupsByInstitutes } from "@/api/search-schedule/requests.ts"
import {
  type InstitutesData,
  toInstituteData,
} from "@/domain/models/Institute.ts"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

const getInstitutes = async () => {
  const savedData = await LocalStorageManager.getInstitutesData()
  const now = Date.now()
  if (savedData !== null && savedData.institutes.length > 0) {
    const isExpired = now - savedData.lastUpdate >= 24 * 60 * 60 * 1000
    if (!isExpired) {
      mainContainer.get(InstitutesStore).setInstitutesData(savedData)
      return savedData.institutes
    }
  }
  const response = await getGroupsByInstitutes()
  const dto = response.data
  const dataArray = dto.items.map((instituteDto) =>
    toInstituteData(instituteDto)
  )
  const newData: InstitutesData = {
    lastUpdate: now,
    institutes: dataArray,
  }
  mainContainer.get(InstitutesStore).setInstitutesData(newData)
  return newData.institutes
}

const getGroupsByInstitutesQueryOptions = () => {
  return queryOptions({
    queryFn: getInstitutes,
    queryKey: ["institutes"],
    select: (data) => data,
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
