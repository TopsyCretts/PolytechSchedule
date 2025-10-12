import { useContext } from "react"
import { SearchScheduleContext } from "@/hoc/SearchScheduleProvider.tsx"

const useSearchSchedule = () => {
  const context = useContext(SearchScheduleContext)
  if (!context) {
    throw new Error("useTheme must be used within SearchScheduleProvider")
  }
  return context
}

export { useSearchSchedule }
