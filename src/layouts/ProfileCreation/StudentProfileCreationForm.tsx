import { useTranslation } from "react-i18next"
import { useState } from "react"
import SearchSelect from "@components/SearchSelect"
import { STRINGS_RES } from "@/constants/strings.ts"
import AccentButton from "@components/AccentButton"
import type { ProfileCreationFormProps } from "@/layouts/ProfileCreation/types.ts"
import { useGetGroupsByInstitutesQuery } from "@/api/search-schedule/service.ts"
import { toInstituteUi } from "@/domain/models/Institute.ts"
import type { SearchItem } from "@/domain/types/Search.ts"
import type { InstituteDto } from "@/api/search-schedule/dto/InstitutesDto.ts"

const mapGroupsByIstituteToSearchItems = (
  dto: InstituteDto[],
  institute: string
): SearchItem[] => {
  return dto
    .find((item) => item.name === institute)!
    .groups.map((item) => {
      return {
        id: item,
        searchableValue: item,
        type: "group",
      }
    })
}

const StudentProfileCreationForm = ({
  className,
  onProfileCreation,
}: ProfileCreationFormProps) => {
  const { t } = useTranslation()

  const { data } = useGetGroupsByInstitutesQuery()
  const defaultValues = { institute: null, group: null }

  const [selectedValues, setSelectedValues] = useState<{
    institute: string | null
    group: string | null
  }>(defaultValues)

  const handleInstituteSelection = (institute: string | null) => {
    if (institute === null) {
      setSelectedValues(defaultValues)
    } else {
      setSelectedValues((prev) => ({ ...prev, institute }))
    }
  }

  const handleGroupSelection = (group: string | null) => {
    setSelectedValues((prev) => ({ ...prev, group }))
  }

  return (
    <form className={className}>
      <SearchSelect
        id={"institutes"}
        label={t(STRINGS_RES.institute_other)}
        searchItems={data.map((item) => toInstituteUi(item))}
        placeholder={t(STRINGS_RES.enter_the_institute)}
        onSelectedChange={handleInstituteSelection}
      />
      {selectedValues.institute && (
        <SearchSelect
          id={"groups"}
          label={t(STRINGS_RES.group_other)}
          searchItems={mapGroupsByIstituteToSearchItems(
            data,
            selectedValues.institute
          )}
          placeholder={t(STRINGS_RES.enter_the_group)}
          onSelectedChange={handleGroupSelection}
        />
      )}
      {selectedValues.group !== null && (
        <AccentButton
          className={"profile-creation__next-button h3"}
          onClick={() => {}}
        >
          Next
        </AccentButton>
      )}
    </form>
  )
}

export default StudentProfileCreationForm
