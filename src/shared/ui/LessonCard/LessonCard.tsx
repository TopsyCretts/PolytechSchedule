import "./LessonCard.scss"
import clsx from "clsx"
import { Link } from "react-router"
import type { LessonData } from "@/pages/schedule/model/ScheduleData.ts"
import type { ProfileType } from "@/domain/models/Profile.ts"
import { format, isWithinInterval } from "date-fns"
import { memo } from "react"
import { LessonTypeIcon } from "@shared/ui"
import { getScheduleProfileRoute } from "@/pages/schedule/api/profileLoader.ts"
import { LESSONS_MAP } from "@/constants/contstants.ts"
import { useTranslation } from "react-i18next"

interface LessonCardProps {
  className?: string
  lessonData: LessonData
  profileType: ProfileType
}

const TIME_FORMAT = "HH:mm"

const LessonCard = memo(
  ({ className, lessonData, profileType }: LessonCardProps) => {
    const { t } = useTranslation()

    return (
      <article
        className={clsx(
          className,
          "lesson-card",
          lessonData.end.getTime() < new Date().getTime() &&
            "lesson-card--inactive"
        )}
      >
        <div className="lesson-card__duration">
          <time
            className="lesson-card__start-time"
            dateTime={format(lessonData.start, TIME_FORMAT)}
          >
            {format(lessonData.start, TIME_FORMAT)}
          </time>
          <time
            className="lesson-card__end-time"
            dateTime={format(lessonData.end, TIME_FORMAT)}
          >
            {format(lessonData.end, TIME_FORMAT)}
          </time>
        </div>
        <div
          className={clsx(
            "lesson-card__path-indicator",
            isWithinInterval(new Date(), { ...lessonData }) &&
              "lesson-card__path-indicator--active"
          )}
        ></div>
        <div className="lesson-card__inner">
          <h3
            className="lesson-card__title h2"
            style={{
              color: LESSONS_MAP[lessonData.type].lessonCardHeaderColor,
            }}
          >
            #{lessonData.lessonNumber} {lessonData.name}
          </h3>
          <div className="lesson-card__body">
            <div className="lesson-card__description">
              <div className="lesson-card__lesson-type">
                <LessonTypeIcon
                  className="lesson-card__icon"
                  lessonType={lessonData.type}
                />
                {t(LESSONS_MAP[lessonData.type].nameI18nkey)}
              </div>
              {lessonData.auditory !== undefined && (
                <div className="lesson-card__auditory">
                  {lessonData.auditory}
                </div>
              )}
            </div>
            <ul className="lesson-card__link-list">
              {profileType === "student"
                ? lessonData.teachers.map((teacher, index) => (
                    <GetLinkOrString
                      key={index}
                      data={teacher}
                      profileType={"teacher"}
                    />
                  ))
                : lessonData.groups.map((group, index) => (
                    <GetLinkOrString
                      key={index}
                      data={group}
                      profileType={"student"}
                    />
                  ))}
            </ul>
          </div>
        </div>
      </article>
    )
  }
)

export default LessonCard

const GetLinkOrString = ({
  data,
  profileType,
}: {
  data: string | { id: number; name: string }
  profileType: ProfileType
}) => {
  if (typeof data === "string") {
    return <span> {data}</span>
  }
  return (
    <Link to={getScheduleProfileRoute(data.id.toString(), profileType)}>
      {data.name}
    </Link>
  )
}
