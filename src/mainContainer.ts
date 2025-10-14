import { Container } from "inversify"
import { InstitutesStore } from "@/domain/institutes/InstitutesStore.ts"
import { ProfilesStore } from "@/domain/profiles/ProfilesStore.ts"
import { TeachersStore } from "@/domain/teachers/TeachersStore.ts"

const mainContainer = new Container()

mainContainer.bind(InstitutesStore).toSelf().inSingletonScope()
mainContainer.bind(TeachersStore).toSelf().inSingletonScope()

mainContainer.bind(ProfilesStore).toSelf().inSingletonScope()

export { mainContainer }
