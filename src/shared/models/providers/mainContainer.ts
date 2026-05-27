import { Container } from "inversify"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { AppApiStore } from "@/shared/api/AppApiStore.ts"
import { TeachersStore } from "@/entities/teachers"
import { ProfileCacheService } from "@/features/profile/model/ProfileCacheService.ts"
import { InstituteCacheService } from "@/entities/institute/model/InstituteCacheService.ts"
import { TeachersCacheService } from "@/entities/teachers/model/TeachersCacheService.ts"
import { MultiUniServiceStore } from "@/features/multi-uni/MultiUniServiceStore.ts"
import { DatabaseRepository } from "@/shared/models/browser-storages/indexDb/indexDb.ts"

const mainContainer = new Container({
  autoBindInjectable: true,
})

mainContainer.bind(AppApiStore).toSelf().inSingletonScope()
mainContainer.bind(DatabaseRepository).toSelf().inSingletonScope()
mainContainer.bind(MultiUniServiceStore).toSelf().inSingletonScope()

mainContainer.bind(InstituteCacheService).toSelf().inSingletonScope()
mainContainer.bind(InstitutesStore).toSelf().inSingletonScope()

mainContainer.bind(TeachersCacheService).toSelf().inSingletonScope()
mainContainer.bind(TeachersStore).toSelf().inSingletonScope()

mainContainer.bind(ProfileCacheService).toSelf().inSingletonScope()
mainContainer.bind(ProfilesManagerStore).toSelf().inSingletonScope()

export { mainContainer }
