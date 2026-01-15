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
import { PROGRESS_STATUS } from "@/shared/models/DataStatus.ts"
import { useDebounce } from "use-debounce"
import { useGetScheduleByProfileQuery } from "@/pages/schedule/api/service.ts"
import { findEqualDayData } from "@/pages/schedule-calendar/lib/findEqualDayData.ts"
import { LANGUAGES_MAP } from "@/shared/constants/contstants.ts"
import { Spinner } from "@/shared/ui"
import RetryFallback from "@/widgets/RetryFallback"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { Outlet } from "react-router"
import "./ScheduleLayout.scss"
import clsx from "clsx"
import { useGetDateFromUrl } from "@/shared/lib/useDayFromSearchParams.ts"

const ScheduleContext = createContext<ScheduleContextValues | null>(null)

const DEFAULT_VALUE = {
  data: { weeks: [] },
  status: PROGRESS_STATUS.init,
}

const ScheduleLayout = ({
  className,
  profile,
  teachers,
  actualGroups,
}: ScheduleLayoutProps) => {
  const { t, i18n } = useTranslation()
  const { dateFromUrl } = useGetDateFromUrl()
  const [debouncedKeyForLoading] = useDebounce(profile.apiId + profile.id, 300)
  const [scheduleData, setScheduleData] =
    useState<ScheduleDataStatus>(DEFAULT_VALUE)
  const [currentDayData, setCurrentDayData] = useState<DayData>(() =>
    findEqualDayData(DEFAULT_VALUE.data.weeks, dateFromUrl)
  )

  const { data, isFetching, isError, refetch } = useGetScheduleByProfileQuery(
    profile,
    (cachedData: ScheduleDataStatus) => {
      setScheduleData(cachedData)
    },
    actualGroups,
    teachers,
    scheduleData.status
  )

  useEffect(() => {
    setScheduleData(DEFAULT_VALUE)
  }, [profile.id])

  useEffect(() => {
    if (data) {
      setScheduleData(data)
    }
  }, [data])

  useEffect(() => {
    setCurrentDayData(
      findEqualDayData(scheduleData.data.weeks, currentDayData.date)
    )
  }, [scheduleData])

  useEffect(() => {
    if (isError) {
      setScheduleData((prev) => ({
        data: prev.data,
        status: PROGRESS_STATUS.error,
      }))
    }
  }, [isError])

  const value = useMemo<ScheduleContextValues>(
    () => ({
      data: scheduleData.data,
      profile,
      currentDayData,
      setCurrentDayData,
      locale: LANGUAGES_MAP[i18n.language].locale,
      status: scheduleData.status,
      resetError: refetch,
    }),
    [
      scheduleData.data,
      scheduleData.status,
      profile,
      currentDayData,
      i18n.language,
      refetch,
    ]
  )

  const isWeeksEmpty = scheduleData.data.weeks.length === 0

  let content: ReactNode

  if (isWeeksEmpty) {
    if (isFetching) {
      content = <Spinner className="schedule-layout__spinner" />
    } else if (isError) {
      content = (
        <RetryFallback
          className="schedule-layout__spinner"
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
  } else if (debouncedKeyForLoading !== profile.apiId + profile.id) {
    content = <Spinner className="schedule-layout__spinner" />
  } else {
    content = <Outlet />
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
