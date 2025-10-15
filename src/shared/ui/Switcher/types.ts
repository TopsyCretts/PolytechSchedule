interface SwitcherProps {
  className?: string
  currentItem: SwitcherOption
  items: SwitcherOption[]
  onItemChange: (option: SwitcherOption) => void
}

interface SwitcherItemProps {
  item: SwitcherOption
  isSelected: boolean
  onClick: (option: SwitcherOption) => void
}

interface SwitcherOption {
  value: string
  label: string
}

export type { SwitcherProps, SwitcherItemProps }
