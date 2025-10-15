import type { IconButtonType } from "../IconButton/types.ts"

interface SearchItemCoreProps {
  className?: string
  title: string
  trailingButtonType: IconButtonType
  onClick?: () => void
}

export type { SearchItemCoreProps }
