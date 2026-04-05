import {
  DatabaseRepository,
  STORE_NAMES,
} from "@/shared/models/browser-storages/indexDb/indexDb.ts"
import type { InstituteData } from "@/shared/api/entities/Institute.ts"
import { inject, injectable } from "inversify"

@injectable()
export class InstituteCacheService {
  constructor(@inject(DatabaseRepository) private db: DatabaseRepository) {}

  async getAllInstitutes() {
    return await this.db.getAll(STORE_NAMES.institutes)
  }

  async saveInstitutes(institutes: InstituteData[]) {
    await this.db.saveAllInstitutes(institutes)
  }
}
