import { inject, injectable } from "inversify"
import {
  type Profile,
  PROFILE_TYPE,
  type ProfileType,
  type StudentProfile,
  type TeacherProfile,
} from "@/entities/profile/model/Profile.ts"
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { TeachersStore } from "@/entities/teachers/model/TeachersStore.ts"
import { SCHEDULE_VIEW } from "@/entities/schedule/model/ScheduleData.ts"
import { ProfileCacheService } from "@/features/profile/model/ProfileCacheService.ts"

@injectable()
export class ProfilesManagerStore {
  private profileCacheService = new ProfileCacheService()

  @observable
  private profiles: Profile[] = []

  @observable
  private currentProfile: Profile | null = null

  @observable
  private readonly isInitialized: Promise<boolean>

  private resolveInitialized!: (value: boolean) => void
  private rejectInitialized!: () => void

  constructor(
    @inject(InstitutesStore) private institutesStore: InstitutesStore,
    @inject(TeachersStore) private teachersStore: TeachersStore
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.isInitialized = new Promise<boolean>((resolve, reject) => {
      this.resolveInitialized = resolve
      this.rejectInitialized = reject
    })
    this.initProfiles()
  }

  @action
  initProfiles() {
    this.profileCacheService
      .getAllProfiles()
      .then((profiles) => {
        runInAction(() => {
          this.profiles = [...profiles]
          this.resolveInitialized(true)
        })
      })
      .catch(() => {
        this.rejectInitialized()
      })
  }

  @computed
  get getIsInitialized() {
    return this.isInitialized
  }

  @computed
  get getProfiles() {
    return this.profiles
  }

  @computed
  get getCurrentProfile() {
    return this.currentProfile
  }

  @action
  setCurrentProfileById(profileId: number): void {
    const profile = this.profiles.find((profile) => profile.id === profileId)

    if (profile) {
      this.currentProfile = { ...profile }
    }
  }

  @action
  setCurrentProfile(profile: Profile): void {
    this.currentProfile = { ...profile }
  }

  async getOrCreateProfile(
    type: ProfileType,
    newProfileApiId: number
  ): Promise<Profile | null> {
    await this.isInitialized
    const existingProfile = this.getProfile(newProfileApiId, type)
    if (existingProfile !== null) {
      return existingProfile
    }

    switch (type) {
      case PROFILE_TYPE.student: {
        const data = this.institutesStore.getInstituteByGroupId(newProfileApiId)
        if (data !== null) {
          const profileBluePrint = createStudentProfile(
            newProfileApiId,
            data.group.name,
            data.institute
          )
          return await this.addProfile(profileBluePrint)
        }
        break
      }
      case PROFILE_TYPE.teacher: {
        const teacher = this.teachersStore.getTeacherById(newProfileApiId)
        if (teacher !== null) {
          const profileBluePrint = createTeacherProfile(
            newProfileApiId,
            teacher.name
          )
          return await this.addProfile(profileBluePrint)
        }
        break
      }
    }
    return null
  }

  getProfile(apiId: number, profileType: ProfileType): Profile | null {
    const existingProfile = this.profiles.find(
      (profile) =>
        profile.apiId === apiId && profile.profileType === profileType
    )
    if (existingProfile !== undefined) {
      return existingProfile
    }
    return null
  }

  @action
  async addProfile(newProfile: Profile) {
    const newId = await this.profileCacheService.saveNewProfileToDb(newProfile)
    const localProfile = { ...newProfile, id: newId }
    runInAction(() => {
      this.profiles = [...this.profiles, localProfile]
    })
    return localProfile
  }

  @action
  async removeProfileAndReturnClosest(profileId: number) {
    const index = this.profiles.findIndex((profile) => profile.id === profileId)
    const nearestLeftIndex = index - 1

    this.profiles = [
      ...this.profiles.filter((profile) => profile.id !== profileId),
    ]

    const nearestRightIndexAfterRemove = index

    await this.profileCacheService.removeProfile(profileId)

    if (nearestRightIndexAfterRemove < this.profiles.length) {
      return this.profiles[nearestRightIndexAfterRemove]
    }

    if (nearestLeftIndex >= 0) {
      return this.profiles[nearestLeftIndex]
    }

    return null
  }

  async updateLastUpdateTimeById(profileId: number) {
    const profile = this.profiles.find((profile) => profile.id === profileId)
    if (!profile) {
      return 0
    }

    if (this.getCurrentProfile?.id === profileId) {
      this.currentProfile = { ...profile, lastUpdateAt: new Date() }
    }

    return this.profileCacheService.updateProfile({
      ...profile,
      lastUpdateAt: new Date(),
    })
  }
}

export const createTeacherProfile = (
  apiId: number,
  teacherName: string
): TeacherProfile => {
  return {
    id: 0,
    apiId: apiId,
    name: teacherName,
    profileType: PROFILE_TYPE.teacher,
    lastUpdateAt: null,
    selectedViewType: SCHEDULE_VIEW.week,
  }
}

export const createStudentProfile = (
  apiId: number,
  name: string,
  institute: string
): StudentProfile => {
  return {
    id: 0,
    apiId: apiId,
    name,
    profileType: PROFILE_TYPE.student,
    institute: institute,
    lastUpdateAt: null,
    selectedViewType: SCHEDULE_VIEW.week,
  }
}
