interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  iconType: "cross" | "right-arrow"
  onClick: () => void
}

type IconButtonType = "cross" | "right-arrow"

export type { IconButtonProps, IconButtonType }
