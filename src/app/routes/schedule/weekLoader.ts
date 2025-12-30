import { type LoaderFunctionArgs, redirect } from "react-router"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import { type ProfileType } from "@/entities/Profile.ts"

export const weekLoader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiId = params.profileApiId
  const profileType = params.profileType as ProfileType
  const searchParams = new URL(request.url).searchParams

  const isDesktop = MATCH_MEDIA.laptopAbove.matches

  if (isDesktop) {
    const route = getScheduleProfileRoute(apiId!, profileType, "calendar")

    return redirect(`${route}${searchParams.toString()}`)
  }
}

export default weekLoader
