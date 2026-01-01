import "./Button.scss"
import clsx from "clsx"
import type { ButtonProps } from "./types.ts"

const Button = ({
  className,
  children,
  shape = "default",
  buttonType = "action",
  borderRadiusSize = "md",
  type = "button",
  stopPropagation = true,
  isBorderless = false,
  onClick,
  disabled,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        "button",
        `button--${buttonType}`,
        shape === "square" && "button--square",
        `border-radius-${borderRadiusSize}`,
        isBorderless && "button--borderless"
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
