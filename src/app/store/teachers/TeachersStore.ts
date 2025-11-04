import { action, computed, makeAutoObservable, observable } from "mobx"
import { queryClient } from "@shared/api"
import { getTeachersQueryOptions } from "@shared/api/search-schedule/teachersService.ts"
import type { TeacherData, TeachersData } from "@/domain/models/Teachers.ts"
import { injectable } from "inversify"
import { dbService } from "@/app/store/browser-storages/indexDb.ts"

@injectable()
export class TeachersStore {
  @observable
  private teachersData: TeachersData = {
    lastUpdate: new Date().getTime(),
    teachers: [],
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
      .prefetchQuery(getTeachersQueryOptions())
      .then(() => {
        this.resolveInitialized(true)
      })
      .catch(() => {
        this.rejectInitialized()
      })
  }

  @computed
  get getIsInitialized() {
    return this.isInitialized
  }

  @action
  setTeachersData(data: TeachersData) {
    this.teachersData = { ...data }
    dbService.saveAllTeachers(data.teachers).then()
  }

  getTeacherById(teacherId: number): TeacherData | null {
    const teacher = this.teachersData.teachers.find(
      (teacher) => teacher.id === teacherId
    )
    if (teacher === undefined) {
      return null
    }
    return teacher
  }

  @computed
  get getTeachers(): TeacherData[] {
    return this.teachersData.teachers
  }
}
