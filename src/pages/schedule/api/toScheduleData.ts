import type { ScheduleWeekDto } from "@/pages/schedule/api/dto/ScheduleDto.ts"
import {
  type DayData,
  LESSON_TYPE,
  type LessonData,
  type LessonType,
  type ScheduleData,
  type ScheduleWeekData,
} from "@/entities/ScheduleData.ts"
import { endOfWeek, parseISO, startOfWeek } from "date-fns"
import type { GroupData } from "@/entities/Group.ts"
import type { TeacherData } from "@/entities/Teachers.ts"

export const toScheduleData = async <T extends { items: ScheduleWeekDto[] }>(
  data: T,
  allActualGroups: GroupData[],
  actualTeachers: TeacherData[]
): Promise<ScheduleData> => {
  return {
    weeks: toWeekData(data.items, allActualGroups, actualTeachers),
  }
}

const toWeekData = (
  weeksDto: ScheduleWeekDto[],
  allActualGroups: GroupData[],
  actualTeachers: TeacherData[]
): ScheduleWeekData[] => {
  const parseDto = (
    weeksDto: ScheduleWeekDto[]
  ): Array<ScheduleWeekData | null> => {
    return weeksDto.map((weekDto) => {
      const firstDateOfWeekString = weekDto.days.find((_, index) => index === 0)
        ?.info.date
      if (firstDateOfWeekString !== undefined) {
        const weekStart = startOfWeek(firstDateOfWeekString!, {
          weekStartsOn: 1,
        })
        const weekEnd = endOfWeek(firstDateOfWeekString!, { weekStartsOn: 1 })
        return {
          start: weekStart,
          end: weekEnd,
          days: weekDto.days.map((dayDto): DayData => {
            return {
              date: parseISO(dayDto.info.date),
              lessons: dayDto.lessons.map((lesson): LessonData => {
                return {
                  name: lesson.lessonName,
                  type: getLessonType(lesson.type),
                  start: parseISO(lesson.startAt),
                  end: parseISO(lesson.endAt),
                  lessonNumber: lesson.number || 1,
                  teachers: getTeachersByIds(
                    [
                      {
                        teacherName: lesson.teacherName,
                        teacherId: lesson.teacherId,
                      },
                      {
                        teacherId: lesson.additionalTeacherId,
                        teacherName: lesson.additionalTeacherName,
                      },
                    ],
                    actualTeachers
                  ),
                  groups: getGroupsByNames(lesson.groups, allActualGroups),
                  auditory: lesson.auditoryName,
                  isDistant: false,
                  additionalInfo: lesson.subInfo,
                }
              }),
            }
          }),
        }
      }
      return null
    })
  }

  const parsedWeeks = parseDto(weeksDto)

  const filteredWeeks: ScheduleWeekData[] = parsedWeeks.filter(
    (item) => item !== null
  )

  const mergeWeeks = (weeks: ScheduleWeekData[]) => {
    // string - Date.toString()
    const mergedWeeks: Map<string, ScheduleWeekData> = new Map()

    weeks.forEach((week) => {
      // если нет в мапе, то добавляем
      if (!mergedWeeks.has(week.start.toString())) {
        mergedWeeks.set(week.start.toString(), week)
      } else {
        // неделя с такой датой уже есть в мапе, поэтому мерджим ее с week
        const existingWeek = mergedWeeks.get(week.start.toString())
        if (existingWeek) {
          // мапа даты дня и сам день (<дата, день>)
          // инициализируем existingWeek.days
          const mergedDays: Map<string, DayData> = new Map(
            existingWeek.days.map((data) => [data.date.toString(), data])
          )
          // проходимся по week.days аналогично:
          // если нет в mergedDays - добавляем, а если есть - мерджим
          week.days.forEach((day) => {
            if (!mergedDays.has(day.date.toString())) {
              mergedDays.set(day.date.toString(), day)
            } else {
              // мерджим уроки
              const existingDay = mergedDays.get(day.date.toString())
              if (existingDay) {
                mergedDays.set(day.date.toString(), {
                  ...day,
                  lessons: [...existingDay.lessons, ...day.lessons],
                })
              }
            }
          })

          mergedWeeks.set(week.start.toString(), {
            ...existingWeek,
            days: [...mergedDays.values()],
          })
        }
      }
    })
    return [...mergedWeeks.values()]
  }

  return mergeWeeks(filteredWeeks)
}

const getGroupsByNames = (
  groupNames: string[] | undefined,
  actualGroups: GroupData[]
) => {
  if (!groupNames) {
    return []
  }
  return groupNames.map((groupName) => {
    const groupData = actualGroups.find((group) => group.name === groupName)
    if (groupData !== undefined) {
      return groupData
    }
    return groupName
  })
}

const getTeachersByIds = (
  teachers: { teacherName?: string; teacherId?: number }[],
  actualTeachers: TeacherData[]
) => {
  const newTeachers: Array<TeacherData | string> = []

  teachers.forEach(({ teacherId, teacherName }) => {
    if (teacherId !== undefined) {
      const existingTeacher = actualTeachers.find(
        (teacher) => teacher.id === teacherId
      )
      if (existingTeacher !== undefined) {
        newTeachers.push(existingTeacher)
        return
      }
    }
    if (teacherName !== undefined) {
      newTeachers.push(teacherName)
      return
    }
  })
  return newTeachers
}

const getLessonType = (numberType: number): LessonType => {
  switch (numberType) {
    case 2:
      return LESSON_TYPE.lecture
    case 4:
      return LESSON_TYPE.practical
    case 8:
      return LESSON_TYPE.laboratory
    case 256:
      return LESSON_TYPE.exam
    default:
      return LESSON_TYPE.unknown
  }
}
