import type { ScheduleWeekDto } from "@/shared/api/dto/ScheduleDto.ts"
import {
  type DayData,
  LESSON_TYPE,
  type LessonData,
  type LessonType,
  type ScheduleData,
  type ScheduleWeekData,
} from "@/entities/schedule/model/ScheduleData.ts"
import { endOfWeek, parseISO, startOfWeek } from "date-fns"
import type { GroupData } from "@/entities/institute/model/Group.ts"
import type { TeacherData } from "@/entities/teachers/model/Teachers.ts"

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
  const parseDaysDto = (weeksDto: ScheduleWeekDto[]): Array<DayData> => {
    const resultData: Array<DayData> = []

    weeksDto.forEach((weekDto) => {
      weekDto.days.forEach((dayDto) => {
        const dayData: DayData = {
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
        resultData.push(dayData)
      })
    })

    return resultData
  }

  const allDaysData = parseDaysDto(weeksDto)

  const mergeDaysToWeeks = (days: DayData[]) => {
    // string - Date.toString()
    const mergedWeeks: Map<string, ScheduleWeekData> = new Map()

    days.forEach((day) => {
      const weekStart = startOfWeek(day.date, { weekStartsOn: 1 })
      // если нет в мапе, то добавляем
      if (!mergedWeeks.has(weekStart.toString())) {
        const newWeek: ScheduleWeekData = {
          start: weekStart,
          end: endOfWeek(weekStart),
          days: [day],
        }
        mergedWeeks.set(weekStart.toString(), newWeek)
      } else {
        // неделя с такой датой уже есть в мапе, поэтому мерджим ее с week
        const existingWeek = mergedWeeks.get(weekStart.toString())
        if (existingWeek) {
          // мапа даты дня и сам день (<дата, день>)
          // инициализируем existingWeek.days
          const mergedDays: Map<string, DayData> = new Map(
            existingWeek.days.map((data) => [data.date.toString(), data])
          )
          // если нет в mergedDays - добавляем, а если есть - мерджим
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

          mergedWeeks.set(weekStart.toString(), {
            ...existingWeek,
            days: [...mergedDays.values()],
          })
        }
      }
    })
    return [...mergedWeeks.values()]
  }

  return mergeDaysToWeeks(allDaysData)
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
