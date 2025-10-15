import { injectable } from "inversify"
import { action, computed, makeAutoObservable, observable } from "mobx"
import { queryClient } from "@/api"
import type { InstitutesData } from "@/domain/models/Institute.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import { LocalStorageManager } from "@/domain/browser-storages"
import { getGroupsByInstitutesQueryOptions } from "@/api/search-schedule/institutesService.ts"

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
