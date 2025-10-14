import type { LoaderFunctionArgs } from "react-router"
import type { ScheduleType } from "@/domain/models/Profile.ts"
import { mainContainer } from "@/mainContainer.ts"
import { ProfilesStore } from "@/domain/profiles/ProfilesStore.ts"
import { APP_ROUTES, routeWithParams } from "@/routes/routes.ts"

const profileLoader = ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const type = searchParams.get("type")
  const newProfileId = params.profileId
  if (
    !type ||
    !newProfileId ||
    type.toString().trim() === "" ||
    newProfileId.toString().trim() === ""
  ) {
    throw new Response("Missing required fields", { status: 404 })
  }

  const scheduleType = type.toString() as ScheduleType
  const profileIdStr = newProfileId.toString()

  const profile = mainContainer
    .get(ProfilesStore)
    .getOrCreateProfile(scheduleType, profileIdStr)

  if (!profile) {
    throw new Response("Profile creation failed", { status: 404 })
  }
  return { profile }
}

const getScheduleProfileRoute = (
  profileId: string,
  scheduleType: ScheduleType
) => {
  return routeWithParams(APP_ROUTES.schedule, [profileId], {
    type: scheduleType,
  })
}

export { profileLoader, getScheduleProfileRoute }
