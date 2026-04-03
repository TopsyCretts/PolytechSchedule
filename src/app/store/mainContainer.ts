import { Container } from "inversify"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"
import { TeachersStore } from "@/entities/teachers"

const mainContainer = new Container()

mainContainer.bind(AppApiStore).toSelf().inSingletonScope()
mainContainer.bind(InstitutesStore).toSelf().inSingletonScope()
mainContainer.bind(TeachersStore).toSelf().inSingletonScope()

mainContainer.bind(ProfilesManagerStore).toSelf().inSingletonScope()

export { mainContainer }
