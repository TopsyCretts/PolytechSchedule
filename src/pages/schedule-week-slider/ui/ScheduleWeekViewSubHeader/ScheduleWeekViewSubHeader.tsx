import "./ScheduleWeekViewSubHeader.scss"
import ScheduleWeekSelect from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekSelect.tsx"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import type { ScheduleWeekData } from "@/entities/ScheduleData.ts"
import clsx from "clsx"
import { Button } from "@/shared/ui"
import ArrowIcon from "@/assets/icons/arrow-left.svg?react"
import DataStatusPopover from "@/widgets/DataStatusPopover"
import { memo } from "react"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { useGetDateFromUrl } from "@/shared/lib/useDayFromSearchParams.ts"
import { useNavigate } from "react-router"
import { routeWithParams } from "@/app/routes/routes.ts"
import { format } from "date-fns"
import { QUERY_DATE_FORMAT } from "@/shared/constants/contstants.ts"

interface ScheduleWeekViewHeaderProps extends BaseComponent {
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
  }: ScheduleWeekViewHeaderProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { getDateFromUrl } = useGetDateFromUrl()
    const { data, locale, profile } = useScheduleData()

    const handleLinkClick = () => {
      navigate(
        routeWithParams(
          "/schedule",
          [profile.profileType, profile.apiId.toString()],
          { date: format(getDateFromUrl(), QUERY_DATE_FORMAT) },
          "calendar"
        )
      )
    }

    return (
      <div className={clsx(className, "schedule-week-view-sub-header")}>
        <h2 className="visually-hidden">Рассписание на неделю</h2>
        <div className={"schedule-week-view-sub-header__inner"}>
          <Button
            className={clsx("schedule-week-view-sub-header__link")}
            role={"link"}
            onClick={handleLinkClick}
          >
            <ArrowIcon className={"schedule-week-view-sub-header__icon"} />
            {t(STRINGS_RES.calendar)}
          </Button>
          <ScheduleWeekSelect
            className={"schedule-week-view-sub-header__week-select"}
            weekData={data.weeks}
            startWeekFormat={"dd-MM-yyyy"}
            locale={locale}
            selectedWeekStart={selectedWeek.startDate}
            onSelectedWeekChange={handleWeekSelection}
          />
          <DataStatusPopover
            className={""}
            isReversed={true}
          />
        </div>
      </div>
    )
  }
)

export default ScheduleWeekViewSubHeader
