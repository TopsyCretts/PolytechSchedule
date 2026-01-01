import { LocalStorageManager } from "@/app/store/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"
import { dbService, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import { redirect } from "react-router"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"

export const mainLoader = async () => {
  const lastUsedProfileId = Number(
    LocalStorageManager.get<number>(LOCAL_STORAGE_KEY.lastProfileId)
  )

  if (lastUsedProfileId !== null) {
    const profiles = await dbService.getAll(STORE_NAMES.profiles)
    if (profiles.length === 0) {
      return
    }
    const profile = profiles.find((p) => p.id === lastUsedProfileId)

    if (profile) {
      const isDesktop = MATCH_MEDIA.laptopAbove.matches

      const route = getScheduleProfileRoute(
        profile.apiId.toString(),
        profile.profileType,
        isDesktop ? "calendar" : "week"
      )

      return redirect(`${route}`)
    }
  }
}
