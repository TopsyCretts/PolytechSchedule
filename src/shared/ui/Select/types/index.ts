import type { RefObject } from "react"
import type {
  BaseComponent,
  BaseComponentWithChildren,
} from "@shared/models/BaseComponent.ts"

interface SelectValues {
  isOpen: boolean
  toggle: () => void
}

interface SelectOption {
  key: string
  value: React.ReactNode | string
}

type SelectProps = BaseComponentWithChildren

type SelectButtonTogglerProps = BaseComponentWithChildren

type SelectStringTogglerProps = BaseComponentWithChildren

interface SelectContainerProps {
  children: React.ReactNode
  width?: number | string
  ref?: RefObject<HTMLDivElement | null>
}

interface SelectHeaderProps {
  children: React.ReactNode
  isCross?: boolean
}

interface SelectListProps extends BaseComponent {
  values: SelectOption[]
  initialSelectedOptionsKeys?: string[]
  numerated?: boolean
  multiSelection?: boolean
  onOptionChange?: (optionKey: string) => void
  onMultipleChange?: (optionKeys: string[]) => void
}

interface SelectGroupProps extends SelectListProps {
  title?: string
}

interface SelectOptionProps extends BaseComponentWithChildren{
  optionKey: string
  isSelected: boolean
  numerated?: boolean
  onOptionClick?: (optionKey: string) => void
}

export type {
  SelectValues,
  SelectProps,
  SelectButtonTogglerProps,
  SelectStringTogglerProps,
  SelectContainerProps,
  SelectHeaderProps,
  SelectListProps,
  SelectGroupProps,
  SelectOption,
  SelectOptionProps,
}
