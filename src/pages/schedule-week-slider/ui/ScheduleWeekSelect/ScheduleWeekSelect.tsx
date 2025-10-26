import { Select } from "@shared/ui"
import { format } from "date-fns"
import "./ScheduleWeekSelect.scss"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"
import { mapWeekDataToWeeksByYear } from "../../lib/mapWeekDataToWeeksByYear"
import type { ScheduleWeekSelectProps } from "../../lib/types.ts"
import { useMemo } from "react"
import { getWeekByFormatedString } from "@/pages/schedule-week-slider/lib/getWeekByFormatedString.ts"
import ScheduleWeekStringToggler from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekStringToggler.tsx"

const ScheduleWeekSelect = ({
  weekData,
  startWeekFormat,
  locale,
  selectedWeekStart,
  onSelectedWeekChange,
}: ScheduleWeekSelectProps) => {
  const { t } = useTranslation()
  const formatedSelectedString = format(selectedWeekStart, startWeekFormat)

  const groups = useMemo(() => {
    return mapWeekDataToWeeksByYear(weekData, startWeekFormat, locale)
  }, [weekData, startWeekFormat, locale])

  const handleSelection = (key: string) => {
    const data = getWeekByFormatedString(key, startWeekFormat, weekData)
    if (data !== null) {
      onSelectedWeekChange(data)
    }
  }

  const selectedWeek = groups
    .map((year) => year.weeks)
    .flat()
    .find((week) => week.key === formatedSelectedString)?.value

  return (
    <div className="schedule-week-select">
      <Select className={"schedule-week-select__select"}>
        <ScheduleWeekStringToggler>
          {selectedWeek !== undefined ? selectedWeek : "Ошибка в поиске недель"}
        </ScheduleWeekStringToggler>
        <Select.Backdrop />
        <Select.Container>
          <Select.Header>{t(STRINGS_RES.week_other)}</Select.Header>
          <div className="schedule-week-select__content">
            {groups.map((group) => (
              <Select.OptionsGroup
                key={group.year.toString()}
                title={format(group.year, "yyyy")}
                values={group.weeks}
                initialSelectedOptionsKeys={[formatedSelectedString]}
                onOptionChange={handleSelection}
              />
            ))}
          </div>
        </Select.Container>
      </Select>
    </div>
  )
}

export default ScheduleWeekSelect
