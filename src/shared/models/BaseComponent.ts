interface BaseComponent {
  className?: string
}

interface BaseComponentWithChildren extends BaseComponent {
  children?: React.ReactNode
}

export type { BaseComponent, BaseComponentWithChildren }
