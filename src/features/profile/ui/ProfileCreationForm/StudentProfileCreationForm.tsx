import { useTranslation } from "react-i18next"
import { useCallback, useState } from "react"
import { SearchSelect, Spinner } from "@/shared/ui"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import type {
  ProfileCreationFormProps,
  StudentProfileCreationValues,
} from "@/features/profile/model/types.ts"
import type { SearchItem } from "@/shared/models/Search.ts"
import { generatePath, useNavigate } from "react-router"
import { useInjection } from "inversify-react"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { observer } from "mobx-react-lite"
import type { GroupData } from "@/entities/institute/model/Group.ts"
import { useGetGroupsByInstitutesQuery } from "@/entities/institute/api/institutesService.ts"
import { PROFILE_TYPE } from "@/entities/profile/model/Profile.ts"
import RetryFallback from "@/widgets/RetryFallback"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { APP_ROUTES } from "@/shared/constants/routes.ts"

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

    const { getOrCreateProfile } = useInjection(ProfilesManagerStore)

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

    const handleGroupSelection = useCallback(
      async (group: SearchItem | null) => {
        if (group !== null) {
          const groupId = Number(group.id)

          setSelectedValues((prev) => ({
            ...prev,
            group: {
              id: groupId,
              name: group.searchableValue,
            },
          }))
          await getOrCreateProfile(PROFILE_TYPE.student, groupId)
          navigateToStudentProfile(group.id)
        }
      },
      []
    )

    const navigateToStudentProfile = (groupId: number | string) => {
      navigate(
        generatePath(APP_ROUTES.scheduleCalendar, {
          profileApiId: groupId.toString(),
          profileType: PROFILE_TYPE.student,
        }),
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
          className={"profile-creation__institutes-select"}
          label={t(STRINGS_RES.institute_other)}
          searchItems={institutes.institutes.map(
            (item): SearchItem => ({
              id: item.id,
              searchableValue: item.name,
              type: "institute",
            })
          )}
          placeholder={t(STRINGS_RES.enter_the_institute)}
          onSelectedChange={handleInstituteSelection}
        />
        {selectedValues.institute && (
          <SearchSelect
            id={"groups"}
            className={"profile-creation__groups-select"}
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
