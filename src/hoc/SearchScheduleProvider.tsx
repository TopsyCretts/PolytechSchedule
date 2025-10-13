import { createContext, useMemo, useState } from "react"
import type {
  SearchableState,
  SearchContextValues,
} from "@/domain/types/Search.ts"
import { defaultSearchableState } from "@/constants/contstants.ts"
import { searchItemsGroups, searchItemsTeacher } from "@/constants/dev.ts"

interface SearchScheduleProviderProps {
  children: React.ReactNode
}

const SearchScheduleContext = createContext<SearchContextValues | null>(null)

const SearchScheduleProvider = ({ children }: SearchScheduleProviderProps) => {
  const [teachers] = useState<SearchableState>({
    ...defaultSearchableState,
    searchItems: searchItemsTeacher,
  })

  const [institutes] = useState<SearchableState>({
    ...defaultSearchableState,
    searchItems: searchItemsTeacher,
  })

  const [groups] = useState<SearchableState>({
    ...defaultSearchableState,
    searchItems: searchItemsGroups,
  })

  const contextValue: SearchContextValues = useMemo(() => {
    return {
      teachers,
      institutes,
      groups,
    }
  }, [teachers, institutes, groups])

  return (
    <SearchScheduleContext value={contextValue}>
      {children}
    </SearchScheduleContext>
  )
}

export { SearchScheduleContext, SearchScheduleProvider }
