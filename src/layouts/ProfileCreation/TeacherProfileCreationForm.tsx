//import { useProfiles } from "@/domain/hooks/useProfiles.ts"
import { useState } from "react"
import SearchSelect from "@components/SearchSelect"
import AccentButton from "@components/AccentButton"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"
import type { ProfileCreationFormProps } from "@/layouts/ProfileCreation/types.ts"
import { useGetTeachersQuery } from "@/api/search-schedule/service.ts"
import type { TeacherDto } from "@/api/search-schedule/dto/TeachersDto.ts"
import type { SearchItem } from "@/domain/types/Search.ts"

const mapTeachersToSearchItems = (dto: TeacherDto[]): SearchItem[] => {
  return dto.map((item) => {
    return {
      id: String(item.id),
      searchableValue: item.name,
      type: "teacher",
    }
  })
}

const TeacherProfileCreationForm = ({
  className,
}: ProfileCreationFormProps) => {
  const { t } = useTranslation()

  const { data } = useGetTeachersQuery()

  //const { createTeacherProfile } = useProfiles()

  const [teacherName, setTeacherName] = useState<string | null>(null)

  const handleTeacherSelection = (teacherName: string | null) => {
    setTeacherName(teacherName)
  }

  return (
    <form className={className}>
      <SearchSelect
        id={"teachers"}
        label={t(STRINGS_RES.teacher_other)}
        searchItems={mapTeachersToSearchItems(data)}
        placeholder={t(STRINGS_RES.enter_the_name)}
        onSelectedChange={handleTeacherSelection}
      />
      {teacherName !== null && (
        <AccentButton
          className={"profile-creation__next-button"}
          onClick={() => {}}
        >
          {t(STRINGS_RES.next)}
        </AccentButton>
      )}
    </form>
  )
}

export default TeacherProfileCreationForm
