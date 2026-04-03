import { SearchSelect, Spinner } from "@/shared/ui"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import type { ProfileCreationFormProps } from "@/features/profile/model/types.ts"
import { useGetTeachersQuery } from "@/entities/teachers/api/teachersService.ts"
import type { SearchItem } from "@/shared/models/Search.ts"
import { useInjection } from "inversify-react"
import { TeachersStore } from "@/entities/teachers/model/TeachersStore.ts"
import type { TeacherData } from "@/entities/teachers/model/Teachers.ts"
import { generatePath, useNavigate } from "react-router"
import { PROFILE_TYPE } from "@/entities/profile/model/Profile.ts"
import RetryFallback from "@/widgets/RetryFallback"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { observer } from "mobx-react-lite"
import { APP_ROUTES } from "@/shared/constants/routes.ts"

const mapTeachersToSearchItems = (dto: TeacherData[]): SearchItem[] => {
  return dto.map((item) => {
    return {
      id: String(item.id),
      searchableValue: item.name,
      type: PROFILE_TYPE.teacher,
    }
  })
}

const TeacherProfileCreationForm = observer(
  ({ className }: ProfileCreationFormProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { getOrCreateProfile } = useInjection(ProfilesManagerStore)

    const { isFetching, refetch } = useGetTeachersQuery()

    const { getTeachers: teachers } = useInjection<TeachersStore>(TeachersStore)

    const handleTeacherSelection = async (newTeacher: SearchItem | null) => {
      if (newTeacher === null) {
        return
      }

      await getOrCreateProfile(PROFILE_TYPE.teacher, Number(newTeacher.id))
      navigateToTeacherProfile(newTeacher.id.toString())
    }

    const navigateToTeacherProfile = (teacherId: string) => {
      navigate(
        generatePath(APP_ROUTES.scheduleCalendar, {
          profileApiId: teacherId,
          profileType: PROFILE_TYPE.teacher,
        }),
        {
          replace: true,
        }
      )
    }

    return teachers.length === 0 ? (
      isFetching ? (
        <Spinner className={"profile-creation__loading-fallback"} />
      ) : (
        <RetryFallback
          className={"profile-creation__retry-fallback"}
          onRetry={refetch}
        />
      )
    ) : (
      <form className={className}>
        <SearchSelect
          id={"teachers"}
          className={"profile-creation__teachers-select"}
          label={t(STRINGS_RES.teacher_other)}
          searchItems={mapTeachersToSearchItems(teachers)}
          placeholder={t(STRINGS_RES.enter_the_name)}
          onSelectedChange={handleTeacherSelection}
        />
      </form>
    )
  }
)

export default TeacherProfileCreationForm
