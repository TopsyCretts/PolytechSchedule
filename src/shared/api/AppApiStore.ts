import { injectable } from "inversify"
import type { BaseApi } from "@/shared/api/BaseApi.ts"
import { YaPolytechUniApi } from "@/shared/api/YaPolytechUni/YaPolytechUniApi.ts"

@injectable()
export class AppApiStore {
  private apiInstance: BaseApi = new YaPolytechUniApi()

  get getApiInstance() {
    return this.apiInstance
  }

  set setApiInstance(apiInstance: BaseApi) {
    this.apiInstance = apiInstance
  }
}
