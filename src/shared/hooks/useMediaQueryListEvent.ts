import { useEffect, useState } from "react"

const useMediaQueryListEvent = (mediaQuery: MediaQueryList) => {
  const [isMatchesMedia, setIsMatchesMedia] = useState<boolean>(
    mediaQuery.matches
  )

  const handleMediaQueryChange = (event: MediaQueryListEvent) => {
    setIsMatchesMedia(event.matches)
  }

  useEffect(() => {
    mediaQuery.addEventListener("change", handleMediaQueryChange)
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  })

  return {
    isMatchesMedia,
  }
}
export default useMediaQueryListEvent
