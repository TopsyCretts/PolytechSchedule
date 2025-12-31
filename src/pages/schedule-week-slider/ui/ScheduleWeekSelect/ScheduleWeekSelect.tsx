import { Select } from "@/shared/ui"
import { format, parse } from "date-fns"
import "./ScheduleWeekSelect.scss"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import type { ScheduleWeekSelectProps, WeeksByYear } from "../../lib/types.ts"
import { useEffect, useMemo, useRef } from "react"
import ScheduleWeekSelectToggler from "@/pages/schedule-week-slider/ui/ScheduleWeekSelect/ScheduleWeekSelectToggler.tsx"
import clsx from "clsx"
import scrollContainerToSelectedElement from "@/shared/lib/scrollContainerToSelectedElement.ts"
import { generateAvailableYearsWithWeeks } from "@/pages/schedule-week-slider/lib/generateAvailableYearsWithWeeks.ts"

const ScheduleWeekSelect = ({
  className,
  startWeekFormat,
  locale,
  selectedWeekStart,
  onSelectedWeekChange,
}: ScheduleWeekSelectProps) => {
  const { t } = useTranslation()
  const formatedSelectedString = format(selectedWeekStart, startWeekFormat)

  const weeksByYears = useMemo(() => {
    return generateAvailableYearsWithWeeks(startWeekFormat, locale)
  }, [locale])

  const handleSelection = (key: string) => {
    const date = parse(key, startWeekFormat, new Date())
    if (date !== null) {
      onSelectedWeekChange(date)
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
          title={weeksByYear.year.toString()}
          values={weeksByYear.weeks}
          initialSelectedOptionsKeys={[formatedSelectedString]}
          onOptionChange={handleSelection}
        />
      ))}
    </div>
  )
}
