import { InstituteIcon } from "@shared/ui"
import SearchItem from "./SearchItem.tsx"
import StudentIcon from "@assets/icons/student.svg?react"
import TeacherIcon from "@assets/icons/teacher.svg?react"
import type { SearchItemCoreProps } from "../SearchItem/types.ts"
import type { InstituteType } from "@/domain/models/Institute.ts"
import type { JSX } from "react"

interface SearchItemWithType extends SearchItemCoreProps {
  type: InstituteType | "group" | "teacher"
}

const SearchItemWithType = ({ type, ...props }: SearchItemWithType) => {
  let headingIcon: JSX.Element
  switch (type) {
    case "group":
      headingIcon = <StudentIcon />
      break
    case "teacher":
      headingIcon = <TeacherIcon />
      break
    default:
      headingIcon = <InstituteIcon instituteType={type} />
      break
  }

  return (
    <SearchItem
      headingChildren={headingIcon}
      {...props}
    />
  )
}

export default SearchItemWithType
