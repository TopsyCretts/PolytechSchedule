import { Switcher } from "@shared/ui"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import clsx from "clsx"
import useSchedulePageSwitcher from "@/pages/schedule/lib/useSchedulePageSwitcher.ts"
import type { SchedulePageSwitcherProps } from "@/pages/schedule/model/SchedulePageSwitcherProps.ts"
import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"

const SchedulePageSwitcherDesktop = ({
  className,
}: SchedulePageSwitcherProps) => {
  const { t } = useTranslation()

  const { profile } = useScheduleData()

  const { items, currentItem, handleSwitch } = useSchedulePageSwitcher(
    profile.apiId,
    profile.profileType
  )

  return (
    <>
      <title>{`${t(STRINGS_RES.schedule)} | ${currentItem.label}`}</title>
      <Switcher
        className={clsx(className)}
        currentItem={currentItem}
        items={items}
        onItemChange={handleSwitch}
      />
    </>
  )
}

export default SchedulePageSwitcherDesktop
