import "./AccentButton.scss"
import clsx from "clsx"
import type { ButtonProps } from "../Button/types.ts"

type AccentButtonProps = ButtonProps

const AccentButton = ({
  className,
  children,
  onClick,
  type = "button",
  isSquare,
  stopPropagation = true,
  ...restProps
}: AccentButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        "accent-button",
        isSquare && "accent-button--square"
      )}
      onClick={(event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }
        onClick?.(event)
      }}
      type={type}
      {...restProps}
    >
      {children}
    </button>
  )
}

export default AccentButton
