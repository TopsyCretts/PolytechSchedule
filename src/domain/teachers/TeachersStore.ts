import { action, computed, makeAutoObservable, observable } from "mobx"
import { queryClient } from "@/api"
import { LocalStorageManager } from "@/domain/browserStorages"
import { getTeachersQueryOptions } from "@/api/search-schedule/teachersService.ts"
import type { TeacherData, TeachersData } from "@/domain/models/Teachers.ts"
import { injectable } from "inversify"

@injectable()
export class TeachersStore {
  @observable
  private teachersData: TeachersData = {
    lastUpdate: new Date().getTime(),
    teachers: [],
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.init()
  }

  @action
  init() {
    queryClient.ensureQueryData(getTeachersQueryOptions()).then()
  }

  @action
  setTeachersData(data: TeachersData) {
    this.teachersData = { ...data }
    LocalStorageManager.saveTeachersData(data)
  }

  getTeacherById(teacherId: string): TeacherData | null {
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
