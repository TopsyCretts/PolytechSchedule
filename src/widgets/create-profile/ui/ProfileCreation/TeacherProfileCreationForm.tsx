//import { useProfiles } from "@/domain/hooks/useProfiles.ts"
import { useState } from "react"
import { SearchSelect } from "@shared/ui"
import { AccentButton } from "@shared/ui"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"
import type { ProfileCreationFormProps } from "@widgets/create-profile/ui/ProfileCreation/types.ts"
import { useGetTeachersQuery } from "@/api/search-schedule/teachersService.ts"
import type { SearchItem } from "@/domain/types/Search.ts"
import { useInjection } from "inversify-react"
import { TeachersStore } from "@/domain/teachers/TeachersStore.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import { getScheduleProfileRoute } from "@/pages/schedule/api/profileLoader.ts"
import { useNavigate } from "react-router"

const mapTeachersToSearchItems = (dto: TeacherData[]): SearchItem[] => {
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

  const navigate = useNavigate()

  useGetTeachersQuery()

  const { getTeachers: teachers } = useInjection<TeachersStore>(TeachersStore)

  if (teachers.length === 0) {
    throw new Error("Teacher not found")
  }

  const [teacher, setTeacher] = useState<TeacherData | null>(null)

  const handleTeacherSelection = (newTeacher: SearchItem | null) => {
    if (newTeacher === null) {
      setTeacher(newTeacher)
    } else {
      setTeacher({
        id: Number(newTeacher.id),
        name: newTeacher.searchableValue,
      })
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    navigate(getScheduleProfileRoute(teacher!.id.toString(), "teacher"), {
      replace: true,
    })
  }

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
    >
      <SearchSelect
        id={"teachers"}
        label={t(STRINGS_RES.teacher_other)}
        searchItems={mapTeachersToSearchItems(teachers)}
        placeholder={t(STRINGS_RES.enter_the_name)}
        onSelectedChange={handleTeacherSelection}
      />
      {teacher !== null && (
        <AccentButton
          className={"profile-creation__next-button"}
          type="submit"
          onClick={() => {}}
        >
          {t(STRINGS_RES.next)}
        </AccentButton>
      )}
    </form>
  )
}

export default TeacherProfileCreationForm
