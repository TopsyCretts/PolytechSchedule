import "./SchedulePage.scss"
import clsx from "clsx"
import { useLoaderData } from "react-router"
import type { profileLoader } from "@/pages/schedule"

interface SchedulePageProps {
  className?: string
}

const SchedulePage = ({ className }: SchedulePageProps) => {
  const { profile } = useLoaderData<typeof profileLoader>()

  return (
    <>
      <title>Schedule</title>
      <div className={clsx(className, "schedule-page")}>
        SchedulePage profile:{profile.id}
      </div>
    </>
  )
}

export default SchedulePage
