import { useCallback, useMemo, useState } from "react"
import { useDebounce } from "use-debounce"
import type { SearchItem } from "@shared/models/Search.ts"

const useSearchableList = (searchItems: SearchItem[]) => {
  const [searchTerm, setSearchTerm] = useState("")

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return searchItems
    }

    const lowercasedSearch = debouncedSearchTerm.toLowerCase()

    return searchItems.filter((item) =>
      item.searchableValue.toLowerCase().includes(lowercasedSearch)
    )
  }, [searchItems, debouncedSearchTerm])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredItems,
    clearSearch,
  }
}

export { useSearchableList }
