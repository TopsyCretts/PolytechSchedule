import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx"
import type {
  TeacherData,
  TeachersData,
} from "@/entities/teachers/model/Teachers.ts"
import { injectable } from "inversify"
import { DBRepository, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"

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

  private init() {
    DBRepository.getAll(STORE_NAMES.teachers)
      .catch(() => {
        this.rejectInitialized()
      })
      .then((teachers) => {
        if (teachers) {
          runInAction(
            () =>
              (this.teachersData = {
                teachers: teachers,
                lastUpdate: LocalStorageRepository.get(
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
  setTeachersData(data: TeachersData) {
    this.teachersData = { ...data }
    DBRepository.saveAllTeachers(data.teachers).then()
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
