import { SearchSelect, Spinner } from "@/shared/ui"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import type { ProfileCreationFormProps } from "@/widgets/create-profile/ui/ProfileCreation/types.ts"
import { useGetTeachersQuery } from "@/shared/api/search-schedule/teachersService.ts"
import type { SearchItem } from "@/shared/models/Search.ts"
import { useInjection } from "inversify-react"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import type { TeacherData } from "@/entities/Teachers.ts"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import { useNavigate } from "react-router"
import { PROFILE_TYPE } from "@/entities/Profile.ts"
import RetryFallback from "@/widgets/RetryFallback"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"

const mapTeachersToSearchItems = (dto: TeacherData[]): SearchItem[] => {
  return dto.map((item) => {
    return {
      id: String(item.id),
      searchableValue: item.name,
      type: PROFILE_TYPE.teacher,
    }
  })
}

const TeacherProfileCreationForm = ({
  className,
}: ProfileCreationFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { getOrCreateProfile } = useInjection(ProfilesStore)

  const { isError, isFetching, refetch } = useGetTeachersQuery()

  const { getTeachers: teachers } = useInjection<TeachersStore>(TeachersStore)

  const handleTeacherSelection = async (newTeacher: SearchItem | null) => {
    if (newTeacher === null) {
      return
    }

    await getOrCreateProfile(PROFILE_TYPE.teacher, Number(newTeacher.id))
    navigateToTeacherProfile(newTeacher.id.toString())
  }

  const navigateToTeacherProfile = (teacherId: string) => {
    navigate(getScheduleProfileRoute(teacherId, PROFILE_TYPE.teacher), {
      replace: true,
    })
  }

  return isFetching && teachers.length === 0 ? (
    <Spinner className={"profile-creation__loading-fallback"} />
  ) : isError ? (
    <RetryFallback
      className={"profile-creation__retry-fallback"}
      onRetry={refetch}
    />
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

export default TeacherProfileCreationForm
