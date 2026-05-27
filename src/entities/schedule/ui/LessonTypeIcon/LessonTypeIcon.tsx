import type { LessonType } from "@/shared/api/entities/ScheduleData.ts"
import LectureIcon from "@/shared/assets/icons/lecture.svg?react"
import PracticalIcon from "@/shared/assets/icons/practical.svg?react"
import LaboratoryIcon from "@/shared/assets/icons/labarotory.svg?react"
import ExamIcon from "@/shared/assets/icons/exam.svg?react"
import UnknownIcon from "@/shared/assets/icons/unknown_lesson_type.svg?react"

interface LessonTypeIconProps {
  className?: string
  lessonType?: LessonType
  width?: number
  height?: number
}

const iconMap = {
  lecture: LectureIcon,
  practical: PracticalIcon,
  laboratory: LaboratoryIcon,
  exam: ExamIcon,
  unknown: UnknownIcon,
} as const

const LessonTypeIcon = ({
  className,
  lessonType = "unknown",
}: LessonTypeIconProps) => {
  const IconComponent = iconMap[lessonType] || iconMap.unknown
  return <IconComponent className={className} />
}

export default LessonTypeIcon
