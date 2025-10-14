import { injectable } from "inversify"
import { action, computed, makeAutoObservable, observable } from "mobx"
import { queryClient } from "@/api"
import type { InstitutesData } from "@/domain/models/Institute.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import { LocalStorageManager } from "@/domain/browserStorages"
import { getGroupsByInstitutesQueryOptions } from "@/api/search-schedule/institutesService.ts"

@injectable()
export class InstitutesStore {
  @observable
  private institutesData: InstitutesData = {
    lastUpdate: new Date().getTime(),
    institutes: [],
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.init()
  }

  @action
  init() {
    queryClient.prefetchQuery(getGroupsByInstitutesQueryOptions()).then()
  }

  @action
  setInstitutesData(data: InstitutesData) {
    this.institutesData = { ...data }
    LocalStorageManager.saveInstitutesData(data)
  }

  getGroupsByInstitute(instituteName: string): GroupData[] | null {
    const institute = this.institutesData.institutes.find(
      (institute) => institute.name === instituteName
    )
    if (institute === undefined) {
      return null
    }
    const groups = institute.groups
    if (groups.length === 0) {
      return null
    }
    return institute.groups
  }

  @computed
  get getInstitutes() {
    return this.institutesData
  }

  getInstituteByGroupId(groupId: string) {
    for (const institute of this.institutesData.institutes) {
      const isInInstitute =
        institute.groups.find((group) => group.id === groupId) !== undefined
      if (isInInstitute) {
        return institute.name
      }
    }
    return null
  }
}
