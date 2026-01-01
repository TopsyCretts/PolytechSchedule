import { ScheduleContext } from "@/pages/schedule/ui/ScheduleLayout/ScheduleLayout.tsx"
import { useContext } from "react"

const useScheduleData = () => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error("useScheduleData must be used within ScheduleProvider")
  }
  return context
}

export default useScheduleData
