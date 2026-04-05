import { inject, injectable } from "inversify"
import { DatabaseRepository } from "@/shared/models/browser-storages/indexDb/indexDb.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"
import {
  UNIVERSITY_NAMES,
  type UniversityName,
} from "@/shared/constants/contstants.ts"
import type { BaseApi } from "@/shared/api/BaseApi.ts"
import { YaPolytechUniApi } from "@/shared/api/YaPolytechUni/YaPolytechUniApi.ts"

@injectable()
export class MultiUniServiceStore {
  constructor(
    @inject(DatabaseRepository) private database: DatabaseRepository,
    @inject(AppApiStore) private appApiStore: AppApiStore
  ) {}

  setUpUniversityConfig(university: UniversityName): void {
    this.database.setDbName = university
    let apiInstance: BaseApi
    switch (university) {
      case UNIVERSITY_NAMES.yaPolytechDb:
        apiInstance = new YaPolytechUniApi()
        break
      default:
        apiInstance = new YaPolytechUniApi()
        break
    }
    this.appApiStore.setApiInstance = apiInstance
  }
}
