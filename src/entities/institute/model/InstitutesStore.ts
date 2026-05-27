import { inject, injectable } from "inversify"
import { action, computed, makeAutoObservable, observable } from "mobx"
import type {
  InstituteData,
  InstitutesData,
} from "@/shared/api/entities/Institute.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import MobXQuery from "@/shared/api/MobXQuery.ts"
import { getGroupsByInstitutesQueryOptions } from "@/entities/institute/api/institutesService.ts"
import { queryClient } from "@/shared/api"
import { InstituteCacheService } from "@/entities/institute/model/InstituteCacheService.ts"

@injectable()
export class InstitutesStore {
  @observable
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

  async resetError() {
    await this.institutesQuery.resetError()
  }

  constructor(
    @inject(InstituteCacheService)
    private instituteCacheService: InstituteCacheService
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    void (async () => {
      const data = await this.instituteCacheService.getAllInstitutes()
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
    this.instituteCacheService.saveInstitutes(data.institutes).then()
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
