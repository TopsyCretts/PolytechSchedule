import "./CalendarLesson.scss"
import clsx from "clsx"
import type { LessonType } from "@/entities/schedule/model/ScheduleData.ts"

interface CalendarLessonProps {
  className?: string
  lessonNumber: number
  lessonName: string
  lessonType: LessonType
}

const CalendarLesson = ({
  className,
  lessonType,
  lessonNumber,
  lessonName,
}: CalendarLessonProps) => {
  return (
    <li
      className={clsx(
        className,
        "calendar-lesson",
        getLessonModificator(lessonType)
      )}
    >
      <div className="calendar-lesson__title">
        {lessonNumber}. {lessonName}
      </div>
    </li>
  )
}

const getLessonModificator = (lessonType: LessonType) => {
  switch (lessonType) {
    case "lecture":
      return "calendar-lesson--lecture"
    case "practical":
      return "calendar-lesson--practical"
    case "laboratory":
      return "calendar-lesson--laboratory"
    case "exam":
      return "calendar-lesson--exam"
    default:
      return ""
  }
}

export default CalendarLesson
