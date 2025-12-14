import "./Button.scss"
import clsx from "clsx"
import type { ButtonProps } from "./types.ts"

const Button = ({
  className,
  children,
  isSquare,
  type = "button",
  stopPropagation = true,
  onClick,
  disabled,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        "button",
        isSquare && "button--square",
        disabled && "button--disabled"
      )}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation()
        }
        onClick?.(e)
      }}
      type={type}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  )
}

export default Button
