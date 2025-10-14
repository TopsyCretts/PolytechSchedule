import { inject, injectable } from "inversify"
import type {
  Profile,
  ScheduleType,
  StudentProfile,
  TeacherProfile,
} from "@/domain/models/Profile.ts"
import { action, computed, makeAutoObservable, observable } from "mobx"
import { PROFILES_KEY } from "@/constants/contstants.ts"
import { InstitutesStore } from "@/domain/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/domain/teachers/TeachersStore.ts"

@injectable()
export class ProfilesStore {
  @observable
  private profiles: Profile[] = []

  constructor(
    @inject(InstitutesStore) private institutesStore: InstitutesStore,
    @inject(TeachersStore) private teachersStore: TeachersStore
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.initProfiles()
  }

  @action
  initProfiles() {
    const profilesString = localStorage.getItem(PROFILES_KEY)
    if (profilesString === null) {
      return
    }
    const profiles: Profile[] = JSON.parse(profilesString)
    this.profiles = [...profiles]
  }

  @computed
  get getProfiles() {
    return this.profiles
  }

  getOrCreateProfile(type: ScheduleType, newProfileId: string): Profile | null {
    const id = String(newProfileId)
    const existingProfile = this.getProfile(newProfileId)
    if (existingProfile !== null) {
      return existingProfile
    }
    switch (type) {
      case "student": {
        const institute = this.institutesStore.getInstituteByGroupId(id)
        if (institute !== null) {
          const newProfile = createStudentProfile(id, institute)
          this.addProfile(newProfile)
          return newProfile
        }
        break
      }
      case "teacher": {
        const teacher = this.teachersStore.getTeacherById(id)
        console.log(teacher)
        if (teacher !== null) {
          const newProfile = createTeacherProfile(id, teacher.name)
          this.addProfile(newProfile)
          return newProfile
        }
        break
      }
    }
    return null
  }

  getProfile(id: string): Profile | null {
    const existingProfile = this.profiles.find((profile) => profile.id === id)
    if (existingProfile !== undefined) {
      return existingProfile
    }
    return null
  }

  @action
  addProfile(profile: Profile) {
    this.profiles = [...this.profiles, profile]
    this.saveProfilesToLocalStorage(this.profiles)
  }

  @action
  removeProfile(profileId: string) {
    const index = this.profiles.findIndex((profile) => profile.id === profileId)
    const nearestIndex = index - 1

    this.profiles = [
      ...this.profiles.filter((profile) => profile.id !== profileId),
    ]
    this.saveProfilesToLocalStorage(this.profiles)
    if (nearestIndex >= 0) {
      return this.profiles[nearestIndex]
    }
    return null
  }

  private saveProfilesToLocalStorage(profiles: Profile[]) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  }
}

const createTeacherProfile = (
  id: string,
  teacherName: string
): TeacherProfile => {
  return {
    id: id,
    name: teacherName,
    scheduleType: "teacher",
    lastUsed: new Date(),
  }
}

const createStudentProfile = (
  id: string,
  institute: string
): StudentProfile => {
  return {
    id: id,
    name: id,
    scheduleType: "student",
    institute: institute,
    lastUsed: new Date(),
  }
}
