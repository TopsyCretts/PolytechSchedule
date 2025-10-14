import type { InstituteType } from "@/domain/models/Institute.ts"

interface SearchFieldProps {
  className?: string
  id: string
  label: string
  initialValue?: string
  name?: string
  placeholder: string
  inputHidden?: boolean
  onValueChange?: (value: string) => void
}

interface SearchFormProps extends SearchFieldProps {
  searchItems: SearchItem[]
  onSelectedChange: (selectedItem: SearchItem | null) => void
}

interface SearchItem {
  id: string
  searchableValue: string
  type: SearchItemType
}

interface SearchListProps {
  selectedItem: SearchItem | null
  items: SearchItem[]
  onItemClick: (item: SearchItem) => void
}

interface SearchableState {
  isLoading: boolean
  isError: boolean
  searchItems: SearchItem[]
}

interface SearchContextValues {
  institutes: SearchableState
  teachers: SearchableState
  groups: SearchableState
}

type SearchItemType = InstituteType | "group" | "teacher"

export type {
  SearchFormProps,
  SearchFieldProps,
  SearchItem,
  SearchListProps,
  SearchableState,
  SearchContextValues,
}
