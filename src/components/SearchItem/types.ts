import type { IconButtonType } from "@components/IconButton/types.ts"

interface SearchItemCoreProps {
  className?: string
  title: string
  trailingButtonType: IconButtonType
  onClick?: () => void
}

export type { SearchItemCoreProps }
