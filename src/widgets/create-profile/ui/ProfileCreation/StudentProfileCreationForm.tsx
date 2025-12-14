import { useTranslation } from "react-i18next"
import { useCallback, useState } from "react"
import { SearchSelect, Spinner } from "@shared/ui"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import type {
  ProfileCreationFormProps,
  StudentProfileCreationValues,
} from "@widgets/create-profile/ui/ProfileCreation/types.ts"
import { toInstituteUi } from "@/entities/Institute.ts"
import type { SearchItem } from "@shared/models/Search.ts"
import { useNavigate } from "react-router"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import { useInjection } from "inversify-react"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { observer } from "mobx-react-lite"
import type { GroupData } from "@/entities/Group.ts"
import { useGetGroupsByInstitutesQuery } from "@shared/api/search-schedule/institutesService.ts"
import { PROFILE_TYPE } from "@/entities/Profile.ts"
import RetryFallback from "@widgets/RetryFallback"

const mapGroupsToSearchItems = (groups: GroupData[] | null): SearchItem[] => {
  if (groups === null) {
    return []
  }
  return groups.map((item) => {
    return {
      id: item.id,
      searchableValue: item.name,
      type: "group",
    }
  })
}

const defaultValues: StudentProfileCreationValues = {
  institute: null,
  group: null,
}

const StudentProfileCreationForm = observer(
  ({ className }: ProfileCreationFormProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { isFetching, isError, refetch } = useGetGroupsByInstitutesQuery()
    const { getInstitutes: institutes, getGroupsByInstitute } =
      useInjection<InstitutesStore>(InstitutesStore)

    const [selectedValues, setSelectedValues] =
      useState<StudentProfileCreationValues>(defaultValues)

    const handleInstituteSelection = useCallback(
      (institute: SearchItem | null) => {
        if (institute === null) {
          setSelectedValues(defaultValues)
        } else {
          setSelectedValues((prev) => ({
            ...prev,
            institute: {
              id: Number(institute.id),
              name: institute.searchableValue,
            },
          }))
        }
      },
      []
    )

    const handleGroupSelection = useCallback((group: SearchItem | null) => {
      if (group !== null) {
        setSelectedValues((prev) => ({
          ...prev,
          group: {
            id: Number(group.id),
            name: group.searchableValue,
          },
        }))
        navigateToStudentProfile(group.id)
      }
    }, [])

    const navigateToStudentProfile = (groupId: number | string) => {
      navigate(
        getScheduleProfileRoute(groupId.toString(), PROFILE_TYPE.student),
        { replace: true }
      )
    }

    return isFetching && institutes.institutes.length === 0 ? (
      <Spinner className={"profile-creation__loading-fallback"} />
    ) : isError && institutes.institutes.length === 0 ? (
      <RetryFallback
        className={"profile-creation__retry-fallback"}
        onRetry={refetch}
      />
    ) : (
      <form className={className}>
        <SearchSelect
          id={"institutes"}
          label={t(STRINGS_RES.institute_other)}
          searchItems={institutes.institutes.map((item) => toInstituteUi(item))}
          placeholder={t(STRINGS_RES.enter_the_institute)}
          onSelectedChange={handleInstituteSelection}
        />
        {selectedValues.institute && (
          <SearchSelect
            id={"groups"}
            label={t(STRINGS_RES.group_other)}
            searchItems={mapGroupsToSearchItems(
              getGroupsByInstitute(selectedValues.institute.id)
            )}
            placeholder={t(STRINGS_RES.enter_the_group)}
            onSelectedChange={handleGroupSelection}
          />
        )}
      </form>
    )
  }
)

export default StudentProfileCreationForm
