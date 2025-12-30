import type { LoaderFunctionArgs } from "react-router"
import {
  type Profile,
  PROFILE_TYPE,
  type ProfileType,
} from "@/entities/Profile.ts"
import { mainContainer } from "@/app/store/mainContainer.ts"
import {
  createStudentProfile,
  createTeacherProfile,
  ProfilesStore,
} from "@/app/store/profiles/ProfilesStore.ts"
import { APP_ROUTES, routeWithParams } from "@/app/routes/routes.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import { LocalStorageManager } from "@/app/store/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import { SCHEDULE_VIEW } from "@/entities/ScheduleData.ts"

const profileLoader = async ({ params }: LoaderFunctionArgs) => {
  const newProfileApiId = params.profileApiId
  const newProfileType = params.profileType

  if (!newProfileType && !newProfileApiId) {
    console.log("AWdadwwad")
    throw new Response("Missing required fields", { status: 404 })
  }

  const profileType = newProfileType as ProfileType

  if (!Object.values(PROFILE_TYPE).includes(profileType)) {
    console.log("AWdadwwad")
    throw new Response("Missing required fields", { status: 404 })
  }

  const profileApiId = Number(newProfileApiId)

  const institutesStore = mainContainer.get(InstitutesStore)
  const teachersStore = mainContainer.get(TeachersStore)

  await institutesStore.getIsInitialized
  await teachersStore.getIsInitialized

  const profilesStore = mainContainer.get(ProfilesStore)
  await profilesStore.getIsInitialized

  const savedProfile = profilesStore.getProfile(profileApiId, profileType)

  if (savedProfile) {
    LocalStorageManager.set<number>(
      LOCAL_STORAGE_KEY.lastProfileId,
      savedProfile.id
    )
    profilesStore.setCurrentProfileById(savedProfile.id)
    return { savedProfile }
  }

  const tempProfile: Profile =
    profileType === PROFILE_TYPE.student
      ? createStudentProfile(profileApiId, "", "")
      : createTeacherProfile(profileApiId, "")
  
  profilesStore.setCurrentProfile(tempProfile)

  return { tempProfile }
}

const getScheduleProfileRoute = (
  profileId: string,
  scheduleType: ProfileType,
  destination: string = SCHEDULE_VIEW.calendar
) => {
  return routeWithParams(
    APP_ROUTES.scheduleIndex,
    [scheduleType, profileId],
    undefined,
    destination
  )
}

export { profileLoader, getScheduleProfileRoute }
