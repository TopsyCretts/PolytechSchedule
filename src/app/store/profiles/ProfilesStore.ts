import { inject, injectable } from "inversify"
import type {
  Profile,
  ProfileType,
  StudentProfile,
  TeacherProfile,
} from "@/domain/models/Profile.ts"
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import { dbService } from "@/app/store/browser-storages/indexDb.ts"

@injectable()
export class ProfilesStore {
  @observable
  private profiles: Profile[] = []

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
    dbService
      .getAll("profiles")
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

  getOrCreateProfile(type: ProfileType, newProfileId: number): Profile | null {
    const existingProfile = this.getProfile(newProfileId)
    if (existingProfile !== null) {
      return existingProfile
    }
    switch (type) {
      case "student": {
        const data = this.institutesStore.getInstituteByGroupId(newProfileId)
        if (data !== null) {
          const newProfile = createStudentProfile(
            newProfileId,
            data.group.name,
            data.institute
          )
          this.addProfile(newProfile)
          return newProfile
        }
        break
      }
      case "teacher": {
        const teacher = this.teachersStore.getTeacherById(newProfileId)
        if (teacher !== null) {
          const newProfile = createTeacherProfile(newProfileId, teacher.name)
          this.addProfile(newProfile)
          return newProfile
        }
        break
      }
    }
    return null
  }

  getProfile(id: number): Profile | null {
    const existingProfile = this.profiles.find((profile) => profile.id === id)
    if (existingProfile !== undefined) {
      return existingProfile
    }
    return null
  }

  @action
  addProfile(newProfile: Profile) {
    const isProfileExists =
      this.profiles.find((profile) => profile.id === newProfile.id) !==
      undefined
    if (isProfileExists) {
      return
    }
    this.profiles = [...this.profiles, newProfile]
    this.saveProfileToDb(newProfile)
  }

  @action
  removeProfileAndReturnClosest(profileId: number) {
    const index = this.profiles.findIndex((profile) => profile.id === profileId)
    const nearestLeftIndex = index - 1

    this.profiles = [
      ...this.profiles.filter((profile) => profile.id !== profileId),
    ]

    const nearestRightIndexAfterRemove = index

    this.removeProfile(profileId)

    if (nearestRightIndexAfterRemove < this.profiles.length) {
      return this.profiles[nearestRightIndexAfterRemove]
    }

    if (nearestLeftIndex >= 0) {
      return this.profiles[nearestLeftIndex]
    }

    return null
  }

  private saveProfileToDb(profile: Profile) {
    dbService
      .saveProfile(profile)
      .then((profile) => console.log(`Profile saved successfully ${profile}`))
  }

  private removeProfile(id: number) {
    {
      dbService
        .deleteProfile(id)
        .then(() => console.log(`Profile deleted successfully `))
    }
  }
}

const createTeacherProfile = (
  id: number,
  teacherName: string
): TeacherProfile => {
  return {
    id: id,
    name: teacherName,
    profileType: "teacher",
    lastUsed: new Date(),
  }
}

const createStudentProfile = (
  id: number,
  name: string,
  institute: string
): StudentProfile => {
  return {
    id: id,
    name,
    profileType: "student",
    institute: institute,
    lastUsed: new Date(),
  }
}
