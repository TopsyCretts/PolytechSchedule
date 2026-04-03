import { useContext } from "react"
import { OfflineContext } from "@/shared/models/providers/OfflineProvider.tsx"

const useOffline = () => {
  const context = useContext(OfflineContext)
  if (context === null) {
    throw new Error("useOffline must be used within OfflineProvider")
  }
  return context
}

export default useOffline
