import {
  DatabaseRepository,
  STORE_NAMES,
} from "@/shared/models/browser-storages/indexDb/indexDb.ts"
import { inject, injectable } from "inversify"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"

@injectable()
export class TeachersCacheService {
  constructor(@inject(DatabaseRepository) private db: DatabaseRepository) {}

  async getAllTeachers() {
    return await this.db.getAll(STORE_NAMES.teachers)
  }

  async saveTeachers(teachers: TeacherData[]) {
    return await this.db.saveAllTeachers(teachers)
  }
}
