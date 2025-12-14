import clsx from "clsx"
import SchedulePageSwitcherMobile from "@/pages/schedule/ui/SchedulePageSwitcherMobile"
import SchedulePageSwitcherDesktop from "@/pages/schedule/ui/SchedulePageSwitcher/SchedulePageSwitcherDesktop.tsx"
import useMediaQueryListEvent from "@shared/lib/useMediaQueryListEvent.ts"
import { MATCH_MEDIA } from "@shared/constants/media.ts"
import useOffline from "@shared/lib/useOffline.ts"
import { useMatch } from "react-router"
import "./SchedulePageHeader.scss"
import { APP_ROUTES } from "@/app/routes/routes.ts"
import ScheduleDataErrorPopover from "@/pages/schedule/ui/ScheduleDataErrorPopover"

type SchedulePageViewHeaderProps = {
  className?: string
}

const SchedulePageHeader = ({ className }: SchedulePageViewHeaderProps) => {
  const { isOffline } = useOffline()

  const dayMatch = useMatch(APP_ROUTES.scheduleDay)
  const weekMatch = useMatch(APP_ROUTES.scheduleWeek)

  const { isMatchesMedia: isLaptop } = useMediaQueryListEvent(
    MATCH_MEDIA.tablet
  )

  return (
    <header
      className={clsx(
        className,
        "schedule-page-view-header",
        isOffline && !isLaptop && "schedule-page-view-header--grid",
        "container-large",
        dayMatch !== null && "hidden",
        weekMatch !== null && "hidden-mobile"
      )}
    >
      <SchedulePageSwitcherMobile
        className={clsx(
          "schedule-page-view-header__mobile-switcher",
          "visible-tablet"
        )}
        isTitleVisible
      />
      <SchedulePageSwitcherDesktop
        className={clsx("schedule-page-view-header__switcher", "hidden-tablet")}
      />
      <ScheduleDataErrorPopover
        className={"schedule-page-view-header__offline-indicator"}
        isReversed={isLaptop}
      />
    </header>
  )
}

export default SchedulePageHeader
