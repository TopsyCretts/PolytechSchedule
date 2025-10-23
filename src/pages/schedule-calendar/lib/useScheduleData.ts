import { ScheduleContext } from "@/pages/schedule/ui/SchedulePage/SchedulePage.tsx"
import { useContext } from "react"

const useScheduleData = () => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error(
      "useScheduleData useTheme must be used within ScheduleProvider"
    )
  }
  return context
}

export default useScheduleData
