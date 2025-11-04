import { injectable } from "inversify"
import { action, computed, makeAutoObservable, observable } from "mobx"
import { queryClient } from "@shared/api"
import type { InstitutesData } from "@/domain/models/Institute.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import { LocalStorageManager } from "@/app/store/browser-storages"
import { getGroupsByInstitutesQueryOptions } from "@shared/api/search-schedule/institutesService.ts"
import { dbService } from "@/app/store/browser-storages/indexDb.ts"

@injectable()
export class InstitutesStore {
  @observable
  private institutesData: InstitutesData = {
    lastUpdate: new Date().getTime(),
    institutes: [],
  }

  @observable
  private readonly isInitialized: Promise<boolean>

  private resolveInitialized!: (value: boolean) => void
  private rejectInitialized!: () => void

  constructor() {
    this.isInitialized = new Promise<boolean>((resolve, reject) => {
      this.resolveInitialized = resolve
      this.rejectInitialized = reject
    })

    makeAutoObservable(this, {}, { autoBind: true })
    this.init()
  }

  @action
  private init() {
    queryClient
      .prefetchQuery(getGroupsByInstitutesQueryOptions())
      .catch(() => {
        this.rejectInitialized()
      })
      .then(() => {
        this.resolveInitialized(true)
      })
  }

  @computed
  get getIsInitialized() {
    return this.isInitialized
  }

  @action
  setInstitutesData(data: InstitutesData) {
    this.institutesData = { ...data }
    dbService.saveAllInstitutes(data.institutes).then()
    LocalStorageManager.saveInstitutesData(data)
  }

  getGroupsByInstitute(instituteId: number): GroupData[] | null {
    const institute = this.institutesData.institutes.find(
      (institute) => institute.id === instituteId
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

  getAllGroups(institutes: InstitutesData): GroupData[] {
    return institutes.institutes.map((institute) => institute.groups).flat()
  }

  @computed
  get getInstitutes() {
    return this.institutesData
  }

  getInstituteByGroupId(groupId: number) {
    for (const institute of this.institutesData.institutes) {
      const group = institute.groups.find((group) => group.id === groupId)
      if (group !== undefined) {
        return { institute: institute.name, group }
      }
    }
    return null
  }
}
