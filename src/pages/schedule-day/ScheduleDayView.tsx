import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import ScheduleDayItem from "@shared/ui/ScheduleDayItem"
import DayController from "@shared/ui/DayController"
import { isToday } from "date-fns"
import { useNavigate } from "react-router"
import { useCallback } from "react"
import "./ScheduleDayView.scss"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import { MATCH_MEDIA } from "@shared/constants/media.ts"
import useMediaQueryListEvent from "@shared/lib/useMediaQueryListEvent.ts"
import DataStatusPopover from "@widgets/DataStatusPopover"

const ScheduleDayView = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { currentDayData: day, profile, locale } = useScheduleData()

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const { isMatchesMedia } = useMediaQueryListEvent(MATCH_MEDIA.tablet)

  return (
    <section className={clsx("schedule-day-view", "container")}>
      <header className={clsx("schedule-day-view__header")}>
        <h2 className={clsx("visually-hidden")}>
          {t(STRINGS_RES.schedule)} на день
        </h2>
        <DayController
          day={day.date}
          locale={locale}
          decrement={handleBack}
          isActive={isToday(day.date)}
          isDecrementActive={true}
        />
        <div className={"schedule-day-view__offline-indicator-wrapper"}>
          <DataStatusPopover
            className={"schedule-day-view__offline-indicator"}
            isReversed={isMatchesMedia}
          />
        </div>
      </header>
      <ScheduleDayItem
        key={day.date.toString()}
        className={"schedule-day-view__day-item"}
        dayData={day}
        locale={locale}
        profileType={profile.profileType}
        isTitleIsHidden={true}
      />
    </section>
  )
}

export default ScheduleDayView
