import type {
  ScheduleData,
  ScheduleWeekData,
} from "@/shared/api/entities/ScheduleData.ts"
import type { InstituteData } from "@/shared/api/entities/Institute.ts"
import type { GroupData } from "@/shared/api/entities/Group.ts"
import type { TeacherData } from "@/shared/api/entities/Teacher.ts"

export abstract class ApiMapper<
  TScheduleDto = unknown,
  TWeekDto = unknown,
  TInstituteDto = unknown,
  TGroupDto = unknown,
  TTeacherDto = unknown,
> {
  abstract toScheduleData(
    scheduleDto: TScheduleDto,
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): ScheduleData
  abstract toWeeksData(
    weeksDto: TWeekDto[],
    allActualGroups: GroupData[],
    actualTeachers: TeacherData[]
  ): ScheduleWeekData[]
  abstract toInstituteData(dto: TInstituteDto): InstituteData
  abstract toGroupData(dto: TGroupDto): GroupData
  abstract toTeacherData(dto: TTeacherDto): TeacherData
}
