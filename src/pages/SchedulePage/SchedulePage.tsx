import "./SchedulePage.scss"
import clsx from "clsx"
import { useParams } from "react-router"

interface SchedulePageProps {
  className?: string
}

const SchedulePage = ({ className }: SchedulePageProps) => {
  const params = useParams()

  return (
    <>
      <title>Schedule</title>
      <div className={clsx(className, "schedule-page")}>
        SchedulePage profile:{params.profileId}
      </div>
    </>
  )
}

export default SchedulePage
