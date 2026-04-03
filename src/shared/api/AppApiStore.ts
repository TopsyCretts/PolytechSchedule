import { injectable } from "inversify"
import type { BaseApi } from "@/shared/api/BaseApi.ts"
import { computed } from "mobx"
import { YaPolytechUniApi } from "@/shared/api/YaPolytechUniApi.ts"

@injectable()
export class AppApiStore {
  private apiInstance: BaseApi = new YaPolytechUniApi()

  constructor() {}

  @computed
  get getApiInstance() {
    return this.apiInstance
  }

  @computed
  set setApiInstance(apiInstance: BaseApi) {
    this.apiInstance = apiInstance
  }
}
