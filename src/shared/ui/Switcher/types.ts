interface SwitcherProps<T extends string> {
  className?: string
  currentItem: SwitcherOption<T>
  items: SwitcherOption<T>[]
  onItemChange: (option: SwitcherOption<T>) => void
}

interface SwitcherItemProps<T extends string> {
  item: SwitcherOption<T>
  isSelected: boolean
  onClick: (option: SwitcherOption<T>) => void
}

interface SwitcherOption<T extends string> {
  value: T
  label: string
}

export type { SwitcherProps, SwitcherItemProps, SwitcherOption }
