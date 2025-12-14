import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData"
import useOffline from "@shared/lib/useOffline.ts"
import OutOfDatePopover from "@shared/ui/OutOfDatePopover"
import { memo } from "react"

type ScheduleDataErrorPopoverProps = {
  className: string
  isReversed?: boolean
}

const ScheduleDataErrorPopover = memo(
  ({ className, isReversed }: ScheduleDataErrorPopoverProps) => {
    const { isOffline } = useOffline()
    const { profile, isFetchError } = useScheduleData()
    return (
      (isOffline || isFetchError) && (
        <OutOfDatePopover
          className={className}
          lastUpdate={profile.lastUpdateAt ? profile.lastUpdateAt : new Date()}
          isReversed={isReversed}
        />
      )
    )
  }
)

export default ScheduleDataErrorPopover
