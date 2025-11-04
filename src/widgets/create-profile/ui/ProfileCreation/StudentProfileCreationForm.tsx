import { useTranslation } from "react-i18next"
import { useCallback, useState } from "react"
import { SearchSelect } from "@shared/ui"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import { AccentButton } from "@shared/ui"
import type { ProfileCreationFormProps } from "@widgets/create-profile/ui/ProfileCreation/types.ts"
import { toInstituteUi } from "@/domain/models/Institute.ts"
import type { SearchItem } from "@/domain/types/Search.ts"
import { useNavigate } from "react-router"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import { useInjection } from "inversify-react"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { observer } from "mobx-react-lite"
import type { GroupData } from "@/domain/models/Group.ts"
import { useGetGroupsByInstitutesQuery } from "@shared/api/search-schedule/institutesService.ts"

const mapGroupsToSearchItems = (groups: GroupData[] | null): SearchItem[] => {
  if (groups === null) {
    throw new Error("Groups not found")
  }
  return groups.map((item) => {
    return {
      id: item.id,
      searchableValue: item.name,
      type: "group",
    }
  })
}

const defaultValues = { institute: null, group: null }

const StudentProfileCreationForm = observer(
  ({ className }: ProfileCreationFormProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    useGetGroupsByInstitutesQuery()
    const { getInstitutes: institutes, getGroupsByInstitute } =
      useInjection<InstitutesStore>(InstitutesStore)

    if (institutes.institutes.length === 0) {
      throw new Error("Institutes not found")
    }

    const [selectedValues, setSelectedValues] = useState<{
      institute: { id: number; name: string } | null
      group: { id: number; name: string } | null
    }>(defaultValues)

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
      }
    }, [])

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault()
      navigate(
        getScheduleProfileRoute(selectedValues.group!.id.toString(), "student"),
        { replace: true }
      )
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={className}
      >
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
        {selectedValues.group !== null && (
          <AccentButton
            className={"profile-creation__next-button h3"}
            type={"submit"}
            onClick={() => {}}
          >
            {t(STRINGS_RES.next)}
          </AccentButton>
        )}
      </form>
    )
  }
)

export default StudentProfileCreationForm
