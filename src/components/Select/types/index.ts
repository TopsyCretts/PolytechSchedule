import type { ButtonProps } from "@components/Button/types"

interface SelectValues {
  isOpen: boolean
  toggle: () => void
}

interface SelectOption {
  key: string
  value: React.ReactNode | string
}

interface SelectProps {
  className?: string
  children: React.ReactNode
}

type SelectButtonTogglerProps = ButtonProps
type SelectStringTogglerProps = ButtonProps

interface SelectContainerProps {
  children: React.ReactNode
  width?: number | string
}

interface SelectHeaderProps {
  children: React.ReactNode
  isCross?: boolean
}

interface SelectListProps {
  values: SelectOption[]
  className?: string
  initialSelectedOptionsKeys?: string[]
  numerated?: boolean
  multiSelection?: boolean
  onOptionChange?: (optionKey: string) => void
  onMultipleChange?: (optionKeys: string[]) => void
}

interface SelectGroupProps extends SelectListProps {
  title?: string
}

interface SelectOptionProps {
  className?: string
  optionKey: string
  children: React.ReactNode
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
