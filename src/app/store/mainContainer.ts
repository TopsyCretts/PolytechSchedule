import { Container } from "inversify"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"

const mainContainer = new Container()

mainContainer.bind(InstitutesStore).toSelf().inSingletonScope()
mainContainer.bind(TeachersStore).toSelf().inSingletonScope()

mainContainer.bind(ProfilesStore).toSelf().inSingletonScope()

export { mainContainer }
