import "./CalendarLessons.scss"
import clsx from "clsx"
import type { LessonData } from "@/shared/api/entities/ScheduleData.ts"
import CalendarLesson from "@/pages/schedule-calendar/ui/CalendarLesson"

interface CalendarLessonsListProps {
  className?: string
  lessons: LessonData[]
}

const CalendarLessons = ({ className, lessons }: CalendarLessonsListProps) => {
  return (
    <ul className={clsx(className, "calendar-lessons-list")}>
      {lessons.map(({ lessonNumber, name, type }: LessonData, i) => (
        <CalendarLesson
          key={`lesson-${i}`}
          lessonName={name}
          lessonNumber={lessonNumber}
          lessonType={type}
        />
      ))}
    </ul>
  )
}

export default CalendarLessons
