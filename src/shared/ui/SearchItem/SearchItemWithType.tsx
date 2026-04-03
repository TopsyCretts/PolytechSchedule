import SearchItem from "./SearchItem"
import StudentIcon from "@/shared/assets/icons/student.svg?react"
import TeacherIcon from "@/shared/assets/icons/teacher.svg?react"
import type { SearchItemCoreProps } from "../SearchItem/types"
import type { JSX } from "react"

interface SearchItemWithType extends SearchItemCoreProps {
  type: "institute" | "group" | "teacher"
}

const SearchItemWithType = ({ type, ...props }: SearchItemWithType) => {
  let headingIcon: JSX.Element
  switch (type) {
    case "teacher":
      headingIcon = <TeacherIcon />
      break
    default:
      headingIcon = <StudentIcon />
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
