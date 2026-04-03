import { createContext, useCallback, useEffect, useState } from "react"

type OfflineValues = {
  isOffline: boolean
}

const OfflineContext = createContext<OfflineValues | null>(null)

const OfflineProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOffline, setIsOffline] = useState(false)

  const handleOffline = useCallback(() => {
    setIsOffline(true)
  }, [])

  const handleOnline = useCallback(() => {
    setIsOffline(false)
  }, [])

  useEffect(() => {
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.addEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  })

  return (
    <OfflineContext.Provider value={{ isOffline: isOffline }}>
      {children}
    </OfflineContext.Provider>
  )
}

export { OfflineProvider, OfflineContext }
