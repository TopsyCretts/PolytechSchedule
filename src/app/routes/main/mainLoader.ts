import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import { DBRepository, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import { generatePath, redirect } from "react-router"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"
import { APP_ROUTES } from "@/shared/constants/routes.ts"

export const mainLoader = async () => {
  const lastUsedProfileId = Number(
    LocalStorageRepository.get<number>(LOCAL_STORAGE_KEY.lastProfileId)
  )

  if (lastUsedProfileId !== null) {
    const profiles = await DBRepository.getAll(STORE_NAMES.profiles)
    if (profiles.length === 0) {
      return
    }
    const profile = profiles.find((p) => p.id === lastUsedProfileId)

    if (profile) {
      const isDesktop = MATCH_MEDIA.laptopAbove.matches
      const route = generatePath(
        isDesktop ? APP_ROUTES.scheduleCalendar : APP_ROUTES.scheduleWeek,
        {
          profileApiId: profile.apiId.toString(),
          profileType: profile.profileType,
        }
      )

      return redirect(`${route}`)
    }
  }
}
