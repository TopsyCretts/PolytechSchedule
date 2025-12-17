import clsx from "clsx"
import SchedulePageSwitcherMobile from "@/pages/schedule/ui/SchedulePageSwitcherMobile"
import SchedulePageSwitcherDesktop from "@/pages/schedule/ui/SchedulePageSwitcher/SchedulePageSwitcherDesktop.tsx"
import useMediaQueryListEvent from "@shared/lib/useMediaQueryListEvent.ts"
import { MATCH_MEDIA } from "@shared/constants/media.ts"
import { useMatch } from "react-router"
import "./SchedulePageHeader.scss"
import { APP_ROUTES } from "@/app/routes/routes.ts"
import DataStatusPopover from "@widgets/DataStatusPopover"
import type { BaseComponent } from "@shared/models/BaseComponent.ts"

const SchedulePageHeader = ({ className }: BaseComponent) => {
  const dayMatch = useMatch(APP_ROUTES.scheduleDay)
  const weekMatch = useMatch(APP_ROUTES.scheduleWeek)

  const { isMatchesMedia: isLaptop } = useMediaQueryListEvent(
    MATCH_MEDIA.laptop
  )

  return (
    <header
      className={clsx(
        className,
        "schedule-page-view-header",
        "schedule-page-view-header--grid",
        "container-large",
        dayMatch !== null && "hidden",
        weekMatch !== null && "hidden-mobile"
      )}
    >
      <div className={"schedule-page-view-header__spacer"}></div>
      <SchedulePageSwitcherMobile
        className={clsx(
          "schedule-page-view-header__mobile-switcher",
          "visible-mobile"
        )}
        isTitleVisible
      />
      <SchedulePageSwitcherDesktop
        className={clsx("schedule-page-view-header__switcher", "hidden-mobile")}
      />
      <DataStatusPopover
        className={"schedule-page-view-header__offline-indicator"}
        isReversed={isLaptop}
      />
    </header>
  )
}

export default SchedulePageHeader
