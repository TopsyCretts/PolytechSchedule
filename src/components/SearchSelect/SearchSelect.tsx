import "./SearchSelect.scss"
import clsx from "clsx"
import SearchField from "@components/SearchField"
import type { SearchFormProps, SearchItem } from "@/domain/types/Search.ts"
import SearchItemWithType from "@components/SearchItem/SearchItemWithType"
import { useState } from "react"
import { useSearchableList } from "@/domain/hooks"
import SearchList from "./SearchList"

const SearchSelect = ({
  className,
  label,
  id,
  searchItems,
  onSelectedChange,
  ...props
}: SearchFormProps) => {
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null)

  const { setSearchTerm, clearSearch, filteredItems } =
    useSearchableList(searchItems)

  const handleItemSelection = (item: SearchItem) => {
    setSelectedItem(item)
    onSelectedChange(item.searchableValue)
    clearSearch()
  }

  const handleItemClear = () => {
    setSelectedItem(null)
    onSelectedChange(null)
    clearSearch()
  }

  return (
    <div
      className={clsx(className, "search-select")}
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <div className="search-select__field">
        <SearchField
          className={"search-select__search-field"}
          label={label}
          id={id}
          inputHidden={selectedItem !== null}
          onValueChange={setSearchTerm}
          {...props}
        />
        {selectedItem !== null && (
          <SearchItemWithType
            type={selectedItem.type}
            title={selectedItem.searchableValue}
            trailingButtonType={"cross"}
            onClick={handleItemClear}
          />
        )}
      </div>
      <SearchList
        selectedItem={selectedItem}
        items={filteredItems}
        onItemClick={handleItemSelection}
      />
    </div>
  )
}

export default SearchSelect
