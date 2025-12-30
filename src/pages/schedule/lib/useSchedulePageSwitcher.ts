import { useTranslation } from "react-i18next"
import { useMatch, useNavigate } from "react-router"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import type { ProfileType } from "@/entities/Profile.ts"
import { APP_ROUTES } from "@/app/routes/routes.ts"
import type { SwitcherOption } from "@/shared/ui/Switcher/types.ts"
import { SCHEDULE_VIEW, type ScheduleView } from "@/entities/ScheduleData.ts"

const useSchedulePageSwitcher = (
  profileApiId: number,
  profileType: ProfileType
) => {
  const { t } = useTranslation()
  const match = useMatch(APP_ROUTES.scheduleCalendar)
  const navigate = useNavigate()
  const items: SwitcherOption<ScheduleView>[] = [
    {
      value: SCHEDULE_VIEW.week,
      label: t(STRINGS_RES.week_one),
    },
    {
      value: SCHEDULE_VIEW.calendar,
      label: t(STRINGS_RES.month_one),
    },
  ]

  const currentItem = match !== null ? items[1] : items[0]

  const handleSwitch = () => {
    navigate(
      getScheduleProfileRoute(
        profileApiId.toString(),
        profileType,
        currentItem.value === SCHEDULE_VIEW.week
          ? SCHEDULE_VIEW.calendar
          : SCHEDULE_VIEW.week
      )
    )
  }
  return {
    items,
    currentItem,
    handleSwitch,
  }
}

export default useSchedulePageSwitcher
