import "./SchedulePage.scss"
import clsx from "clsx"
import { Outlet, useLoaderData } from "react-router"
import { createContext, useEffect, useMemo, useState } from "react"
import { useInjection } from "inversify-react"
import { useGetScheduleByProfileQuery } from "@/pages/schedule/api/service.ts"
import { observer } from "mobx-react-lite"
import { findEqualDayData } from "@/pages/schedule-calendar/lib/findEqualDayData.ts"
import { startOfToday } from "date-fns"
import { LANGUAGES_MAP } from "@shared/constants/contstants.ts"
import { useTranslation } from "react-i18next"
import SchedulePageHeader from "@/pages/schedule/ui/SchedulePageHeader/SchedulePageHeader.tsx"
import type { DayData, ScheduleDataStatus } from "@/entities/ScheduleData.ts"
import type {
  ScheduleContextValues,
  ScheduleLayoutProps,
  SchedulePageProps,
} from "@/pages/schedule/model/SchedulePageProps.ts"
import { Spinner } from "@shared/ui"
import { useDebounce } from "use-debounce"
import type { profileLoader } from "@/app/routes/schedule/profileLoader.ts"
import { PROGRESS_STATUS } from "@shared/models/DataStatus.ts"
import RetryFallback from "@widgets/RetryFallback"
import { STRINGS_RES } from "@shared/constants/strings.ts"

const { InstitutesStore } = await import(
  "@/app/store/institutes/InstitutesStore.ts"
)
const { TeachersStore } = await import("@/app/store/teachers/TeachersStore.ts")

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
      <ScheduleLayout
        profile={profile}
        teachers={teachers}
        actualGroups={actualGroups}
      />
    </main>
  )
})

const ScheduleContext = createContext<ScheduleContextValues | null>(null)

const ScheduleLayout = ({
  profile,
  teachers,
  actualGroups,
}: ScheduleLayoutProps) => {
  const { t, i18n } = useTranslation()

  const [scheduleData, setScheduleData] = useState<ScheduleDataStatus>({
    data: { weeks: [] },
    status: PROGRESS_STATUS.init,
  })

  const [debouncedProfileId] = useDebounce(profile.id, 300)

  const { data, isFetching, isError, refetch } = useGetScheduleByProfileQuery(
    profile,
    (cachedData: ScheduleDataStatus) => {
      setScheduleData(cachedData)
    },
    actualGroups,
    teachers
  )

  useEffect(() => {
    if (data) {
      setScheduleData(data)
    }
  }, [data])

  const [currentDayData, setCurrentDayData] = useState<DayData>(
    findEqualDayData(scheduleData.data.weeks, startOfToday())
  )

  const value: ScheduleContextValues = useMemo(() => {
    return {
      data: scheduleData.data,
      profile: profile,
      currentDayData: currentDayData,
      setCurrentDayData,
      locale: LANGUAGES_MAP[i18n.language].locale,
      isFetchError: isError,
      resetError: refetch,
    }
  }, [scheduleData, profile, currentDayData, i18n.language, isError, refetch])

  const isWeeksEmpty = value.data.weeks.length === 0

  return (
    <ScheduleContext.Provider
      key={profile.id}
      value={value}
    >
      <SchedulePageHeader className={"schedule-page__header"} />
      {(isFetching && isWeeksEmpty) || debouncedProfileId !== profile.id ? (
        <Spinner />
      ) : !isWeeksEmpty ? (
        <Outlet />
      ) : (
        scheduleData.status === PROGRESS_STATUS.success && (
          <h1 style={{ textAlign: "center" }}>
            {t(STRINGS_RES.there_is_no_schedule_for_profile)}
          </h1>
        )
      )}
      {isError && <RetryFallback onRetry={refetch} />}
    </ScheduleContext.Provider>
  )
}

export { SchedulePage, ScheduleContext }
