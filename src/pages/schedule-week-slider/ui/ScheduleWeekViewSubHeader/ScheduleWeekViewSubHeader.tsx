import "./ScheduleWeekViewSubHeader.scss"
import SchedulePageSwitcherMobile from "@/pages/schedule/ui/SchedulePageSwitcherMobile"
import ScheduleWeekSelect from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekSelect.tsx"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import clsx from "clsx"
import useMediaQueryListEvent from "@shared/lib/useMediaQueryListEvent.ts"
import { MATCH_MEDIA } from "@shared/constants/media.ts"
import { Button } from "@shared/ui"
import ArrowIcon from "@/assets/icons/arrow-left.svg?react"
import ScheduleDataErrorPopover from "@/pages/schedule/ui/ScheduleDataErrorPopover"
import { memo } from "react"

interface ScheduleWeekViewHeaderProps {
  className?: string
  handleWeekSelection: (data: ScheduleWeekData) => void
  selectedWeek: { startDate: Date; index: number }
  onNextWeek: () => void
  onPrevWeek: () => void
}

const ScheduleWeekViewSubHeader = memo(
  ({
    className,
    handleWeekSelection,
    selectedWeek,
    onPrevWeek,
    onNextWeek,
  }: ScheduleWeekViewHeaderProps) => {
    const { data, locale } = useScheduleData()

    const { isMatchesMedia } = useMediaQueryListEvent(MATCH_MEDIA.mobile_s)

    return (
      <div className={clsx(className, "schedule-week-view-sub-header")}>
        <h2 className="visually-hidden">Рассписание на неделю</h2>
        <div className={"schedule-week-view-sub-header__inner"}>
          <Button
            className={clsx(
              "schedule-week-view-sub-header__arrow-button",
              "schedule-week-view-sub-header__arrow-button--prev"
            )}
            isSquare={true}
            disabled={selectedWeek.index === 0}
            onClick={onPrevWeek}
          >
            <ArrowIcon />
          </Button>
          <Button
            className={clsx(
              "schedule-week-view-sub-header__arrow-button",
              "schedule-week-view-sub-header__arrow-button--next"
            )}
            isSquare={true}
            disabled={selectedWeek.index === data.weeks.length - 1}
            onClick={onNextWeek}
          >
            <ArrowIcon />
          </Button>
          <SchedulePageSwitcherMobile
            className={"visible-mobile"}
            isTitleVisible={!isMatchesMedia}
          />
          <ScheduleWeekSelect
            className={"schedule-week-view-sub-header__week-select"}
            weekData={data.weeks}
            startWeekFormat={"dd-MM-yyyy"}
            locale={locale}
            selectedWeekStart={selectedWeek.startDate}
            onSelectedWeekChange={handleWeekSelection}
          />
          <ScheduleDataErrorPopover
            className={"visible-mobile"}
            isReversed={true}
          />
        </div>
      </div>
    )
  }
)

export default ScheduleWeekViewSubHeader
