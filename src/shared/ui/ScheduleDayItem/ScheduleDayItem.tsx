import "./ScheduleDayItem.scss"
import clsx from "clsx"
import type { DayData } from "@/entities/ScheduleData.ts"
import { LessonCard } from "@/shared/ui"
import type { ProfileType } from "@/entities/Profile.ts"
import { format, type Locale } from "date-fns"
import { capitalizeFirstLatter } from "@/shared/lib/capitalizeFirstLatter.ts"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"

interface ScheduleDayItemProps {
  className?: string
  dayData: DayData
  profileType: ProfileType
  locale: Locale
  isTitleIsHidden?: boolean
}

const ScheduleDayItem = ({
  className,
  dayData,
  profileType,
  locale,
  isTitleIsHidden = false,
}: ScheduleDayItemProps) => {
  const { t } = useTranslation()

  return (
    <div className={clsx(className, "schedule-day-item")}>
      {!isTitleIsHidden && (
        <h3 className="schedule-day-item__title">
          <time dateTime={format(dayData.date, "MM-dd")}>
            {format(dayData.date, "d", { locale })}{" "}
            {capitalizeFirstLatter(format(dayData.date, "MMMM", { locale }))}
            {", "}
            {capitalizeFirstLatter(format(dayData.date, "EEEE", { locale }))}
          </time>
        </h3>
      )}
      <div className="schedule-day-item__body">
        {dayData.lessons.length > 0 ? (
          <ul className="schedule-day-item__list">
            {dayData.lessons.map((lesson, index) => (
              <li
                key={lesson.lessonNumber + index}
                className="schedule-day-item__item"
              >
                <LessonCard
                  lessonData={lesson}
                  profileType={profileType}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="schedule-day-item__empty-lessons">
            {t(STRINGS_RES.there_are_no_classes)}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleDayItem
