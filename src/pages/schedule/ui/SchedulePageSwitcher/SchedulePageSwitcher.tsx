import { Switcher } from "@shared/ui"
import { useMatch, useNavigate } from "react-router"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"
import type { ProfileType } from "@/domain/models/Profile.ts"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import clsx from "clsx"

interface SchedulePageSwitcherProps {
  profileId: number
  profileType: ProfileType
}

const SchedulePageSwitcher = ({
  profileId,
  profileType,
}: SchedulePageSwitcherProps) => {
  const { t } = useTranslation()
  const match = useMatch("/schedule/:profileId/calendar")
  const dayMatch = useMatch("/schedule/:profileId/calendar/day")
  const navigate = useNavigate()
  const items = [
    {
      value: "week",
      label: t(STRINGS_RES.week_one),
    },
    {
      value: "calendar",
      label: t(STRINGS_RES.month_one),
    },
  ]

  const currentItem = match !== null ? items[1] : items[0]

  const handleSwitch = (item: { value: string }) => {
    navigate(
      getScheduleProfileRoute(profileId.toString(), profileType, item.value)
    )
  }

  return (
    <>
      <title>{`${t(STRINGS_RES.schedule)} | ${currentItem.label}`}</title>
      <Switcher
        className={clsx(
          "schedule-page__switcher",
          "container-extra-small",
          dayMatch !== null && "hidden"
        )}
        currentItem={currentItem}
        items={items}
        onItemChange={handleSwitch}
      />
    </>
  )
}

export default SchedulePageSwitcher
