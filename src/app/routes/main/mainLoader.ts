import { LocalStorageManager } from "@/app/store/browser-storages"
import {
  LOCAL_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from "@shared/constants/contstants.ts"
import { dbService, STORE_NAMES } from "@/app/store/indexDb/indexDb.ts"
import { type LoaderFunctionArgs, redirect } from "react-router"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"

export const mainLoader = async ({ request }: LoaderFunctionArgs) => {
  const lastUsedProfileId = Number(
    LocalStorageManager.get<number>(LOCAL_STORAGE_KEY.lastProfileId)
  )

  const isProfileInit = sessionStorage.getItem(
    SESSION_STORAGE_KEY.isLastProfileInitiated
  )

  if (lastUsedProfileId !== null && isProfileInit === null) {
    const profiles = await dbService.getAll(STORE_NAMES.profiles)
    const profile = profiles.find((p) => p.id === lastUsedProfileId)

    if (profile) {
      const route = getScheduleProfileRoute(
        profile.apiId.toString(),
        profile.profileType
      )

      const baseUrl = request.url.replace(/\/$/, "")
      sessionStorage.setItem(SESSION_STORAGE_KEY.isLastProfileInitiated, "true")
      return redirect(`${baseUrl}${route}`)
    }
  }
}
