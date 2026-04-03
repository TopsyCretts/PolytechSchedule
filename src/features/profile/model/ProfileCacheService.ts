import type { Profile } from "@/entities/profile"
import type { ProfileDB } from "@/app/store/indexDb/models/ProfileDB.ts"
import { DBRepository, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"

export class ProfileCacheService {
  async getAllProfiles(): Promise<Profile[]> {
    return await DBRepository.getAll(STORE_NAMES.profiles)
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

    return await DBRepository.saveProfile(profileDb)
  }

  async updateProfile(profile: Profile) {
    return await DBRepository.saveProfile({
      ...profile,
      lastUpdateAt: new Date(),
    })
  }

  async removeProfile(id: number) {
    await DBRepository.deleteProfile(id)
    LocalStorageRepository.set(LOCAL_STORAGE_KEY.lastProfileId, null)
  }
}
