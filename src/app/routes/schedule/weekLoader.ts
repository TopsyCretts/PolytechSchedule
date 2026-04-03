import { generatePath, type LoaderFunctionArgs, redirect } from "react-router"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"
import { type ProfileType } from "@/entities/profile/model/Profile.ts"
import { APP_ROUTES } from "@/shared/constants/routes.ts"

export const weekLoader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiId = params.profileApiId
  const profileType = params.profileType as ProfileType
  const searchParams = new URL(request.url).searchParams

  const isDesktop = MATCH_MEDIA.laptopAbove.matches

  if (isDesktop) {
    const route = generatePath(APP_ROUTES.scheduleCalendar, {
      profileType,
      profileApiId: apiId!,
    })

    return redirect(`${route}${searchParams.toString()}`)
  }
}

export default weekLoader
