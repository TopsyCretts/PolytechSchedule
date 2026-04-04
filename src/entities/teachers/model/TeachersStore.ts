import { computed, makeAutoObservable } from "mobx"
import type {
  TeacherData,
  TeachersData,
} from "@/shared/api/entities/Teacher.ts"
import { injectable } from "inversify"
import { DBRepository, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import MobXQuery from "@/shared/api/MobXQuery.ts"
import { getTeachersQueryOptions } from "@/entities/teachers"
import { queryClient } from "@/shared/api"

@injectable()
export class TeachersStore {
  private teachersQuery = new MobXQuery(getTeachersQueryOptions, queryClient)

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.init()
  }

  private init() {
    void (async () => {
      const data = await DBRepository.getAll(STORE_NAMES.teachers)
      if (data.length) {
        queryClient.setQueryData(
          getTeachersQueryOptions().queryKey,
          data.sort((a, b) => a.name.localeCompare(b.name, "ru")),
          {
            updatedAt: 0,
          }
        )
      }
    })()
  }

  setTeachersData(data: TeachersData) {
    DBRepository.saveAllTeachers(data.teachers).then()
  }

  @computed
  get getTeachers() {
    return this.teachersQuery.data
  }

  @computed
  get getSuspendedTeachers() {
    return this.teachersQuery.suspendedData
  }

  @computed
  getTeacherById(teacherId: number): TeacherData | null {
    const teachers = this.getTeachers
    if (!teachers) {
      return null
    }
    const teacher = teachers.find((teacher) => teacher.id === teacherId)
    if (teacher === undefined) {
      return null
    }
    return teacher
  }
}
