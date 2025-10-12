import "./Button.css"
import clsx from "clsx"
import type { ButtonProps } from "./types"

const Button = ({
  className,
  children,
  isSquare,
  type = "button",
  stopPropagation = true,
  onClick,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      className={clsx(className, "button", isSquare && "button--square")}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation()
        }
        onClick?.(e)
      }}
      type={type}
      {...restProps}
    >
      {children}
    </button>
  )
}

export default Button
