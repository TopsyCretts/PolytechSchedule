import { injectable } from "inversify"
import { action, computed, makeAutoObservable } from "mobx"
import type {
  InstituteData,
  InstitutesData,
} from "@/shared/api/entities/Institute.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import { DBRepository, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import MobXQuery from "@/shared/api/MobXQuery.ts"
import { getGroupsByInstitutesQueryOptions } from "@/entities/institute/api/institutesService.ts"
import { queryClient } from "@/shared/api"

@injectable()
export class InstitutesStore {
  private institutesQuery = new MobXQuery(
    getGroupsByInstitutesQueryOptions,
    queryClient
  )

  @computed
  get getSuspendedInstitutes() {
    return this.institutesQuery.suspendedData
  }
  @computed
  get getInstitutes() {
    return this.institutesQuery.data
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    void (async () => {
      const data = await DBRepository.getAll(STORE_NAMES.institutes)
      if (data.length) {
        queryClient.setQueryData(
          getGroupsByInstitutesQueryOptions().queryKey,
          data.sort((a, b) => a.name.localeCompare(b.name, "ru")),
          { updatedAt: 0 }
        )
      }
    })()
  }

  @action
  setInstitutesData(data: InstitutesData) {
    DBRepository.saveAllInstitutes(data.institutes).then()
  }

  getGroupsByInstitute(institute: InstituteData): GroupData[] | null {
    const groups = institute.groups
    if (groups.length === 0) {
      return null
    }
    return institute.groups
  }

  getAllGroups(institutes: InstituteData[]): GroupData[] {
    return institutes.map((institute) => institute.groups).flat()
  }

  @computed
  getInstituteByGroupId(groupId: number) {
    const institutes = this.getInstitutes
    if (institutes) {
      for (const institute of institutes) {
        const group = institute.groups.find((group) => group.id === groupId)
        if (group !== undefined) {
          return { institute: institute.name, group }
        }
      }
      return null
    }
  }
}
