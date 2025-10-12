import "./Spinner.scss"
import clsx from "clsx"

interface SpinnerProps {
  className?: string
  wrapperClassName?: string
}

const Spinner = ({ className, wrapperClassName }: SpinnerProps) => {
  return (
    <div className={clsx(className, "spinner")}>
      <div className={clsx(wrapperClassName, "spinner__wrapper")}>
        <svg
          className="spinner__svg"
          width="50"
          height="50"
          viewBox="0 0 50 50"
        >
          <circle
            className="spinner__path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
          />
          <circle
            className="spinner__indicator"
            cx="25"
            cy="25"
            r="20"
            fill="none"
          />
        </svg>
      </div>
    </div>
  )
}

export default Spinner
