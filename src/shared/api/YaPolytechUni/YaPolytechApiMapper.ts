import { ApiMapper } from "@/shared/api/ApiMapper.ts"
import type { ScheduleWeekDto } from "@/shared/api/YaPolytechUni/dto/YaPolytechScheduleDto.ts"
import type {
  GroupDto,
  InstituteDto,
} from "@/shared/api/YaPolytechUni/dto/YaPolytechInstitutesDto.ts"
import type { TeacherDto } from "@/shared/api/YaPolytechUni/dto/YaPolytechTeachersDto.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import type { InstituteData } from "@/shared/api/entities/Institute.ts"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"
import {
  type DayData,
  LESSON_TYPE,
  type LessonData,
  type ScheduleData,
  type ScheduleWeekData,
} from "@/shared/api/entities/ScheduleData.ts"
import { endOfWeek, parseISO, startOfWeek } from "date-fns"

export class YaPolytechApiMapper extends ApiMapper<
  { items: ScheduleWeekDto[] },
  ScheduleWeekDto,
  InstituteDto,
  GroupDto,
  TeacherDto
> {
  toGroupData(dto: GroupDto): GroupData {
    return {
      id: dto.groupId,
      name: dto.name,
    }
  }

  toInstituteData(dto: InstituteDto): InstituteData {
    return {
      id: dto.id,
      name: dto.name,
      groups: dto.groups.map(this.toGroupData),
    }
  }

  toScheduleData(
    scheduleDto: {
      items: ScheduleWeekDto[]
    },
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): ScheduleData {
    return {
      weeks: this.toWeeksData(
        scheduleDto.items,
        allActualGroups,
        actualTeachers
      ),
    }
  }

  toTeacherData(dto: TeacherDto): TeacherData {
    return {
      id: dto.id,
      name: dto.name,
    }
  }

  toWeeksData(
    weeksDto: ScheduleWeekDto[],
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): ScheduleWeekData[] {
    {
      const parseDaysDto = (weeksDto: ScheduleWeekDto[]): Array<DayData> => {
        const resultData: Array<DayData> = []

        weeksDto.forEach((weekDto) => {
          weekDto.days.forEach((dayDto) => {
            const dayData: DayData = {
              date: parseISO(dayDto.info.date),
              lessons: dayDto.lessons.map((lesson): LessonData => {
                return {
                  name: lesson.lessonName,
                  type: this.getLessonType(lesson.type),
                  start: parseISO(lesson.startAt),
                  end: parseISO(lesson.endAt),
                  lessonNumber: lesson.number || 1,
                  teachers: this.getTeachersByIds(
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
                  groups: this.getGroupsByNames(lesson.groups, allActualGroups),
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
  }

  private getGroupsByNames(
    groupNames: string[] | undefined,
    actualGroups: GroupData[]
  ) {
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
  private getTeachersByIds(
    teachers: { teacherName?: string; teacherId?: number }[],
    actualTeachers: TeacherData[]
  ) {
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

  private getLessonType(numberType: number) {
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
}
