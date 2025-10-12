import "./IconButton.scss"
import clsx from "clsx"
import CrossIcon from "@assets/icons/cross.svg?react"
import type { JSX } from "react"
import ArrowRightIcon from "@assets/icons/arrow-long-right.svg?react"
import type { IconButtonProps } from "@components/IconButton/types.ts"

const IconButton = ({
  className,
  iconType,
  type = "button",
  onClick,
  ...restProps
}: IconButtonProps) => {
  let icon: JSX.Element
  switch (iconType) {
    case "cross":
      icon = <CrossIcon className="icon-button__icon" />
      break
    case "right-arrow":
      icon = <ArrowRightIcon className="icon-button__icon" />
      break
  }

  return (
    <button
      className={clsx(className, "icon-button")}
      type={type}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      {...restProps}
    >
      {icon}
    </button>
  )
}

export default IconButton
