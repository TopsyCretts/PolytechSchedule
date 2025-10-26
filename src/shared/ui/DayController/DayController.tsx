import "./DayController.scss"
import clsx from "clsx"
import { format, type Locale } from "date-fns"
import ArrowLeftIcon from "@assets/icons/arrow-left.svg?react"
import { capitalizeFirstLatter } from "@shared/lib/capitalizeFirstLatter.ts"

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
      <button
        className={clsx(
          "day-controller__left",
          !isDecrementActive && "day-controller__inactive-button"
        )}
        onClick={decrement}
      >
        <ArrowLeftIcon />
      </button>
      <time
        className="day-controller__title"
        dateTime={format(day, "MM-dd")}
      >
        {format(day, "d", {
          locale: locale,
        })}{" "}
        {capitalizeFirstLatter(
          format(day, "MMMM", {
            locale: locale,
          })
        )}
        {", "}
        {capitalizeFirstLatter(
          format(day, "EEEE", {
            locale: locale,
          })
        )}
      </time>
      <button
        className={clsx(
          "day-controller__right",
          !isIncrementActive && "day-controller__inactive-button"
        )}
        onClick={increment}
      >
        <ArrowLeftIcon />
      </button>
    </div>
  )
}

export default DayController
