import { injectable } from "inversify"
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx"
import type { InstitutesData } from "@/entities/Institute.ts"
import type { GroupData } from "@/entities/Group.ts"
import { dbService, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import { LocalStorageManager } from "@/app/store/browser-storages"
import { LOCAL_STORAGE_KEY } from "@shared/constants/contstants.ts"

@injectable()
export class InstitutesStore {
  @observable
  private institutesData: InstitutesData = {
    lastUpdate: null,
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

  private init() {
    dbService
      .getAll(STORE_NAMES.institutes)
      .catch(() => {
        this.rejectInitialized()
      })
      .then((institutes) => {
        if (institutes) {
          runInAction(
            () =>
              (this.institutesData = {
                institutes: institutes,
                lastUpdate: LocalStorageManager.get(
                  LOCAL_STORAGE_KEY.institutesLastUpdate
                ),
              })
          )
        }
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
