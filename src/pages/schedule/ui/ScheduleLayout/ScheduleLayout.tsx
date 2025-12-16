import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import type {
  ScheduleContextValues,
  ScheduleLayoutProps,
} from "@/pages/schedule/model/SchedulePageProps.ts"
import { useTranslation } from "react-i18next"
import type { DayData, ScheduleDataStatus } from "@/entities/ScheduleData.ts"
import { PROGRESS_STATUS } from "@shared/models/DataStatus.ts"
import { useDebounce } from "use-debounce"
import { useGetScheduleByProfileQuery } from "@/pages/schedule/api/service.ts"
import { findEqualDayData } from "@/pages/schedule-calendar/lib/findEqualDayData.ts"
import { startOfToday } from "date-fns"
import { LANGUAGES_MAP } from "@shared/constants/contstants.ts"
import { Spinner } from "@shared/ui"
import RetryFallback from "@widgets/RetryFallback"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import SchedulePageHeader from "@/pages/schedule/ui/SchedulePageHeader/SchedulePageHeader.tsx"
import { Outlet } from "react-router"
import "./ScheduleLayout.scss"
import clsx from "clsx"

const ScheduleContext = createContext<ScheduleContextValues | null>(null)

const ScheduleLayout = ({
  className,
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
      isFetchError: scheduleData.status === PROGRESS_STATUS.error || isError,
      resetError: refetch,
    }
  }, [scheduleData, profile, currentDayData, i18n.language, isError, refetch])

  const isWeeksEmpty = scheduleData.data.weeks.length === 0

  let content: ReactNode

  if (isWeeksEmpty) {
    if (isFetching) {
      content = <Spinner className={"schedule-layout__spinner"} />
    } else if (isError) {
      content = (
        <RetryFallback
          className={"schedule-layout__spinner"}
          onRetry={refetch}
        />
      )
    } else {
      content = (
        <h1 style={{ textAlign: "center" }}>
          {t(STRINGS_RES.there_is_no_schedule_for_profile)}
        </h1>
      )
    }
  } else if (debouncedProfileId !== profile.id) {
    content = <Spinner className={"schedule-layout__spinner"} />
  } else {
    content = (
      <>
        <SchedulePageHeader className={"schedule-layout__header"} />
        <Outlet />
      </>
    )
  }

  return (
    <ScheduleContext.Provider
      key={profile.id}
      value={value}
    >
      <div className={clsx(className, "schedule-layout")}>{content}</div>
    </ScheduleContext.Provider>
  )
}

export { ScheduleLayout, ScheduleContext }
