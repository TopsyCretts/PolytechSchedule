import "./SchedulePage.scss"
import clsx from "clsx"
import { Outlet, useLoaderData } from "react-router"
import type { profileLoader } from "@/pages/schedule"
import QueryErrorResetWrapper from "@/hoc/QueryErrorResetWrapper/QueryErrorResetWrapper.tsx"
import { createContext, Suspense, useMemo, useState } from "react"
import { Spinner } from "@shared/ui"
import { useInjection } from "inversify-react"
import { useGetScheduleByProfileQuery } from "@/pages/schedule/api/service.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { GroupData } from "@/domain/models/Group.ts"
import { observer } from "mobx-react-lite"
import type { BaseProfile, ProfileType } from "@/domain/models/Profile.ts"
import type { DayData, ScheduleData } from "../../model/ScheduleData"
import SchedulePageSwitcher from "@/pages/schedule/ui/SchedulePageSwitcher/SchedulePageSwitcher.tsx"
import { findEqualDayData } from "@/pages/schedule-calendar/lib/findEqualDayData.ts"
import { type Locale, startOfToday } from "date-fns"
import { LANGUAGES_MAP } from "@shared/constants/contstants.ts"
import { useTranslation } from "react-i18next"

const { InstitutesStore } = await import(
  "@/app/store/institutes/InstitutesStore.ts"
)
const { TeachersStore } = await import("@/app/store/teachers/TeachersStore.ts")

interface SchedulePageProps {
  className?: string
}

const SchedulePage = observer(({ className }: SchedulePageProps) => {
  const { profile } = useLoaderData<typeof profileLoader>()

  const { getInstitutes: institutes, getAllGroups } =
    useInjection(InstitutesStore)
  const { getTeachers: teachers } = useInjection(TeachersStore)

  const actualGroups = useMemo(() => {
    return getAllGroups(institutes)
  }, [institutes, getAllGroups])

  return (
    <main className={clsx(className, "schedule-page", "overflow-x-hidden")}>
      <SchedulePageSwitcher
        profileId={profile.id}
        profileType={profile.profileType}
      />
      <QueryErrorResetWrapper key={profile.id}>
        <Suspense fallback={<Spinner />}>
          <ScheduleLayout
            profile={profile}
            teachers={teachers}
            actualGroups={actualGroups}
          />
        </Suspense>
      </QueryErrorResetWrapper>
    </main>
  )
})

interface ScheduleProps {
  profile: BaseProfile
  teachers: TeacherData[]
  actualGroups: GroupData[]
}

const ScheduleContext = createContext<{
  data: ScheduleData
  profileType: ProfileType
  currentDayData: DayData
  setCurrentDayData: (dayData: DayData) => void
  locale: Locale
} | null>(null)

const ScheduleLayout = ({ profile, teachers, actualGroups }: ScheduleProps) => {
  const { i18n } = useTranslation()
  const { data } = useGetScheduleByProfileQuery(profile, actualGroups, teachers)

  const [currentDayData, setCurrentDayData] = useState<DayData>(
    findEqualDayData(data.weeks, startOfToday())
  )

  return (
    <ScheduleContext.Provider
      key={profile.id}
      value={{
        data,
        profileType: profile.profileType,
        currentDayData: currentDayData,
        setCurrentDayData,
        locale: LANGUAGES_MAP[i18n.language].locale,
      }}
    >
      <Outlet />
    </ScheduleContext.Provider>
  )
}

export { SchedulePage, ScheduleContext }
