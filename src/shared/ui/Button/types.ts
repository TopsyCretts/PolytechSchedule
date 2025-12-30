type Shape = "square" | "circle" | "default"

type ButtonType = "primary" | "secondary" | "action"

type BorderRadiusSize = "xs" | "sm" | "md" | "lg" | "xl"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: Shape
  buttonType?: ButtonType
  borderRadiusSize?: BorderRadiusSize
  isBorderless?: boolean
  stopPropagation?: boolean
}

export type { ButtonProps }
