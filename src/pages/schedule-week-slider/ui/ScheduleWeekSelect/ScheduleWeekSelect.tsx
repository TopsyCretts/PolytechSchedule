import { Select } from "@/shared/ui"
import { format } from "date-fns"
import "./ScheduleWeekSelect.scss"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { mapWeekDataToWeeksByYear } from "../../lib/mapWeekDataToWeeksByYear"
import type { ScheduleWeekSelectProps, WeeksByYear } from "../../lib/types.ts"
import { useEffect, useMemo, useRef } from "react"
import { getWeekByFormatedString } from "@/pages/schedule-week-slider/lib/getWeekByFormatedString.ts"
import ScheduleWeekSelectToggler from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekSelectToggler.tsx"
import clsx from "clsx"
import scrollContainerToSelectedElement from "@/shared/lib/scrollContainerToSelectedElement.ts"

const ScheduleWeekSelect = ({
  className,
  weekData,
  startWeekFormat,
  locale,
  selectedWeekStart,
  onSelectedWeekChange,
}: ScheduleWeekSelectProps) => {
  const { t } = useTranslation()
  const formatedSelectedString = format(selectedWeekStart, startWeekFormat)

  const weeksByYears = useMemo(() => {
    return mapWeekDataToWeeksByYear(weekData, startWeekFormat, locale)
  }, [weekData, startWeekFormat, locale])

  const handleSelection = (key: string) => {
    const data = getWeekByFormatedString(key, startWeekFormat, weekData)
    if (data !== null) {
      onSelectedWeekChange(data)
    }
  }

  const selectedWeek = weeksByYears
    .map((year) => year.weeks)
    .flat()
    .find((week) => week.key === formatedSelectedString)?.value

  return (
    <div className={clsx(className, "schedule-week-select")}>
      <Select className={"schedule-week-select__select"}>
        <ScheduleWeekSelectToggler>
          {selectedWeek !== undefined ? selectedWeek : "Ошибка в поиске недель"}
        </ScheduleWeekSelectToggler>
        <Select.Backdrop />
        <Select.Container>
          <Select.Header>{t(STRINGS_RES.week_other)}</Select.Header>
          <Content
            formatedSelectedString={formatedSelectedString}
            weekByYears={weeksByYears}
            handleSelection={handleSelection}
          />
        </Select.Container>
      </Select>
    </div>
  )
}

export default ScheduleWeekSelect

interface ScheduleWeekSelectContent {
  formatedSelectedString: string
  weekByYears: WeeksByYear[]
  handleSelection: (key: string) => void
}

const Content = ({
  formatedSelectedString,
  weekByYears,
  handleSelection,
}: ScheduleWeekSelectContent) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollContainerToSelectedElement(
      containerRef.current!,
      formatedSelectedString,
      "vertical",
      100
    )
  })

  return (
    <div
      className="schedule-week-select__content"
      ref={containerRef}
    >
      {weekByYears.map((weeksByYear) => (
        <Select.OptionsGroup
          key={weeksByYear.year.toString()}
          title={format(weeksByYear.year, "yyyy")}
          values={weeksByYear.weeks}
          initialSelectedOptionsKeys={[formatedSelectedString]}
          onOptionChange={handleSelection}
        />
      ))}
    </div>
  )
}
