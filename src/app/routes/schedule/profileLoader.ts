import type { LoaderFunctionArgs } from "react-router"
import { PROFILE_TYPE, type ProfileType } from "@/entities/Profile.ts"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"
import { APP_ROUTES, routeWithParams } from "@/app/routes/routes.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import { LocalStorageManager } from "@/app/store/browser-storages"
import { LOCAL_STORAGE_KEY } from "@shared/constants/contstants.ts"
import { SCHEDULE_VIEW } from "@/entities/ScheduleData.ts"

const profileLoader = async ({ params }: LoaderFunctionArgs) => {
  const newProfileId = params.profileApiId
  const newProfileType = params.profileType

  if (
    !newProfileType ||
    !newProfileId ||
    newProfileType.trim() === "" ||
    newProfileId.trim() === ""
  ) {
    throw new Response("Missing required fields", { status: 404 })
  }

  const profileType = newProfileType as ProfileType

  if (!Object.values(PROFILE_TYPE).includes(profileType)) {
    throw new Response("Missing required fields", { status: 404 })
  }

  const profileId = Number(newProfileId)

  const institutesStore = mainContainer.get(InstitutesStore)
  const teachersStore = mainContainer.get(TeachersStore)

  await institutesStore.getIsInitialized
  await teachersStore.getIsInitialized

  const profilesStore = mainContainer.get(ProfilesStore)
  await profilesStore.getIsInitialized

  const profile = await profilesStore.getOrCreateProfile(profileType, profileId)

  if (!profile) {
    throw new Response("Profile creation failed", { status: 404 })
  }
  LocalStorageManager.set<number>(LOCAL_STORAGE_KEY.lastProfileId, profile.id)
  return { profile }
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
