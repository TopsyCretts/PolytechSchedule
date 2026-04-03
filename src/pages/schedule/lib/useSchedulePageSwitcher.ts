import { useTranslation } from "react-i18next"
import { generatePath, useMatch, useNavigate } from "react-router"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import type { ProfileType } from "@/entities/profile/model/Profile.ts"
import { APP_ROUTES } from "@/shared/constants/routes.ts"
import type { SwitcherOption } from "@/shared/ui/Switcher/types.ts"
import {
  SCHEDULE_VIEW,
  type ScheduleView,
} from "@/entities/schedule/model/ScheduleData.ts"

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
      generatePath(
        currentItem.value === SCHEDULE_VIEW.week
          ? APP_ROUTES.scheduleWeek
          : APP_ROUTES.scheduleCalendar,
        { profileApiId: profileApiId.toString(), profileType }
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
