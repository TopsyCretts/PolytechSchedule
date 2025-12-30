interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  iconType: IconButtonType
  onClick: () => void
}

type IconButtonType = "cross" | "right-arrow"

export type { IconButtonProps, IconButtonType }
