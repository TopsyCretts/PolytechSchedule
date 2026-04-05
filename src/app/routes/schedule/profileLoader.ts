import { type LoaderFunctionArgs, redirect } from "react-router"
import {
  type Profile,
  PROFILE_TYPE,
  type ProfileType,
} from "@/entities/profile/model/Profile.ts"
import { mainContainer } from "@/shared/models/providers/mainContainer.ts"
import {
  createStudentProfile,
  createTeacherProfile,
  ProfilesManagerStore,
} from "@/features/profile/model/ProfilesManagerStore.ts"
import { APP_ROUTES } from "@/shared/constants/routes.ts"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { TeachersStore } from "@/entities/teachers/model/TeachersStore.ts"
import { LocalStorageRepository } from "@/shared/models/browser-storages"
import { LOCAL_STORAGE_KEY } from "@/shared/constants/contstants.ts"

const profileLoader = async ({ params }: LoaderFunctionArgs) => {
  const newProfileApiId = params.profileApiId
  const newProfileType = params.profileType

  if (!newProfileType && !newProfileApiId) {
    throw new Response("Missing required fields", { status: 404 })
  }

  const profileType = newProfileType as ProfileType

  if (!Object.values(PROFILE_TYPE).includes(profileType)) {
    throw new Response("Missing required fields", { status: 404 })
  }

  const profileApiId = Number(newProfileApiId)

  const institutesStore = mainContainer.get(InstitutesStore)
  const teachersStore = mainContainer.get(TeachersStore)

  const profilesStore = mainContainer.get(ProfilesManagerStore)
  await profilesStore.getIsInitialized

  const savedProfile = profilesStore.getProfile(profileApiId, profileType)

  if (savedProfile) {
    LocalStorageRepository.set<number>(
      LOCAL_STORAGE_KEY.lastProfileId,
      savedProfile.id
    )
    profilesStore.setCurrentProfileById(savedProfile.id)
    return { savedProfile }
  }

  const profileName =
    profileType === PROFILE_TYPE.student
      ? institutesStore.getInstituteByGroupId(profileApiId)?.group.name
      : teachersStore.getTeacherById(profileApiId)?.name

  if (profileName === undefined) {
    throw redirect(APP_ROUTES.newProfile)
  }

  const tempProfile: Profile =
    profileType === PROFILE_TYPE.student
      ? createStudentProfile(profileApiId, profileName ?? "", "")
      : createTeacherProfile(profileApiId, profileName ?? "")

  profilesStore.setCurrentProfile(tempProfile)

  return { tempProfile }
}

export { profileLoader }
