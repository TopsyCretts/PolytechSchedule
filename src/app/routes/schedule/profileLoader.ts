import type { LoaderFunctionArgs } from "react-router"
import type { ProfileType } from "@/domain/models/Profile.ts"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"
import { APP_ROUTES, routeWithParams } from "@/app/routes/routes.ts"
import { queryClient } from "@shared/api"
import { getGroupsByInstitutesQueryOptions } from "@shared/api/search-schedule/institutesService.ts"
import { getTeachersQueryOptions } from "@shared/api/search-schedule/teachersService.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"

const profileLoader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const type = searchParams.get("type")
  const newProfileId = params.profileId
  if (
    !type ||
    !newProfileId ||
    type.trim() === "" ||
    newProfileId.trim() === ""
  ) {
    throw new Response("Missing required fields", { status: 404 })
  }

  const scheduleType = type.toString() as ProfileType
  const profileId = Number(newProfileId)

  const institutesStore = mainContainer.get(InstitutesStore)
  const teachersStore = mainContainer.get(TeachersStore)

  const isInstitutesInit = await institutesStore.getIsInitialized
  const isTeachersInit = await teachersStore.getIsInitialized

  if (scheduleType === "student" && !isInstitutesInit) {
    await queryClient.prefetchQuery(getGroupsByInstitutesQueryOptions())
  } else if (!isTeachersInit) {
    await queryClient.prefetchQuery(getTeachersQueryOptions())
  }

  const profile = mainContainer
    .get(ProfilesStore)
    .getOrCreateProfile(scheduleType, profileId)

  if (!profile) {
    throw new Response("Profile creation failed", { status: 404 })
  }
  return { profile }
}

const getScheduleProfileRoute = (
  profileId: string,
  scheduleType: ProfileType,
  destination: string = "calendar"
) => {
  return routeWithParams(
    APP_ROUTES.schedule,
    [profileId],
    {
      type: scheduleType,
    },
    destination
  )
}

export { profileLoader, getScheduleProfileRoute }
