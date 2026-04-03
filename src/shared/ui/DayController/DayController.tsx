import "./DayController.scss"
import clsx from "clsx"
import { format, type Locale } from "date-fns"
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react"
import Button from "@/shared/ui/Button"

interface DayControllerProps {
  className?: string
  day: Date
  locale: Locale
  decrement?: () => void
  increment?: () => void
  isActive: boolean
  isIncrementActive?: boolean
  isDecrementActive?: boolean
}

const DayController = ({
  className,
  day,
  increment,
  decrement,
  locale,
  isActive,
  isIncrementActive,
  isDecrementActive,
}: DayControllerProps) => {
  return (
    <div
      className={clsx(
        className,
        "day-controller",
        isActive && "day-controller--active"
      )}
    >
      {decrement !== undefined && (
        <Button
          className={clsx("day-controller__left")}
          shape={"square"}
          disabled={!isDecrementActive}
          onClick={decrement}
        >
          <ArrowLeftIcon />
        </Button>
      )}
      <h3 className="day-controller__title text-16 capitalize">
        <time dateTime={format(day, "MM-dd")}>
          {format(day, "d", {
            locale: locale,
          })}{" "}
          {format(day, "MMMM", {
            locale: locale,
          })}
          {", "}
          {format(day, "EEEE", {
            locale: locale,
          })}
        </time>
      </h3>

      {increment !== undefined && (
        <Button
          className={clsx("day-controller__right")}
          shape={"square"}
          disabled={!isIncrementActive}
          onClick={increment}
        >
          <ArrowLeftIcon />
        </Button>
      )}
    </div>
  )
}

export default DayController
