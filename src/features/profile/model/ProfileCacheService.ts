import type { Profile } from "@/entities/profile"
import type { ProfileDB } from "@/shared/models/browser-storages/indexDb/types/ProfileDB.ts"
import {
  DatabaseRepository,
  STORE_NAMES,
} from "@/shared/models/browser-storages/indexDb/indexDb.ts"
import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import type { ScheduleData } from "@/shared/api/entities/ScheduleData.ts"
import { inject, injectable } from "inversify"
import { dbToScheduleData } from "@/shared/models/browser-storages/indexDb/types/ScheduleDataDB.ts"

@injectable()
export class ProfileCacheService {
  constructor(@inject(DatabaseRepository) private db: DatabaseRepository) {}

  async getAllProfiles(): Promise<Profile[]> {
    return await this.db.getAll(STORE_NAMES.profiles)
  }

  async saveNewProfileToDb(profile: Profile) {
    let profileDb: ProfileDB = {
      name: profile.name,
      apiId: profile.apiId,
      profileType: profile.profileType,
      lastUpdateAt: profile.lastUpdateAt ? profile.lastUpdateAt : null,
      selectedViewType: profile.selectedViewType,
    }
    if ("institute" in profile) {
      profileDb = { ...profileDb, institute: profile.institute }
    }

    return await this.db.saveProfile(profileDb)
  }

  async updateProfile(profile: Profile) {
    return await this.db.saveProfile({
      ...profile,
      lastUpdateAt: new Date(),
    })
  }

  async removeProfile(id: number) {
    await this.db.deleteProfile(id)
    LocalStorageRepository.set(LOCAL_STORAGE_KEY.lastProfileId, null)
  }

  async getScheduleByProfileId(profileId: number) {
    const schedule = await this.db.getSchedule(profileId)
    if (!schedule) {
      return undefined
    }
    return dbToScheduleData(schedule)
  }

  async updateProfileSchedule(profileId: number, schedule: ScheduleData) {
    await this.db.saveSchedule(profileId, schedule)
  }
}
