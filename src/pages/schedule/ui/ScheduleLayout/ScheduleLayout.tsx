import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import type {
  ScheduleContextValues,
  ScheduleLayoutProps,
} from "@/pages/schedule/model/SchedulePageProps.ts"
import { useTranslation } from "react-i18next"
import type { DayData } from "@/shared/api/entities/ScheduleData.ts"
import { useDebounce } from "use-debounce"
import { useGetScheduleByProfileQuery } from "@/entities/schedule/api/service.ts"
import { findEqualDayData } from "@/pages/schedule-calendar/lib/findEqualDayData.ts"
import { LANGUAGES_MAP } from "@/shared/constants/contstants.ts"
import { Spinner } from "@/shared/ui"
import RetryFallback from "@/widgets/RetryFallback"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { Outlet } from "react-router"
import "./ScheduleLayout.scss"
import clsx from "clsx"
import {
  useGetDateFromUrl,
  useSetDateToUrl,
} from "@/shared/hooks/useDayFromSearchParams.ts"
import { startOfToday } from "date-fns"

const ScheduleContext = createContext<ScheduleContextValues | null>(null)

const DEFAULT_VALUE = {
  weeks: [],
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
  const {
    data: scheduleData = DEFAULT_VALUE,
    isFetching,
    isError,
    refetch,
  } = useGetScheduleByProfileQuery(profile, actualGroups, teachers)
  const [currentDayData, setCurrentDayData] = useState<DayData>(() =>
    findEqualDayData(scheduleData.weeks, dateFromUrl)
  )

  const { setDateToUrl } = useSetDateToUrl()

  const setCurrentDayDataByDate = useCallback(
    (date: Date) => {
      setDateToUrl(date)
      setCurrentDayData(findEqualDayData(scheduleData.weeks, date))
    },
    [scheduleData.weeks, setDateToUrl]
  )

  useEffect(() => {
    const onToday = () => {
      setCurrentDayDataByDate(startOfToday())
    }
    window.addEventListener("goToCurrentDayEvent", onToday)
    return () => {
      window.removeEventListener("goToCurrentDayEvent", onToday)
    }
  }, [setCurrentDayDataByDate])

  useEffect(() => {
    setCurrentDayData(findEqualDayData(scheduleData.weeks, currentDayData.date))
  }, [scheduleData])

  const value = useMemo<ScheduleContextValues>(
    () => ({
      data: scheduleData,
      profile,
      currentDayData,
      setCurrentDayDataByDate,
      locale: LANGUAGES_MAP[i18n.language].locale,
      isLoading: isFetching,
      isError,
      resetError: refetch,
    }),
    [
      scheduleData,
      isError,
      isFetching,
      profile,
      currentDayData,
      setCurrentDayDataByDate,
      i18n.language,
      refetch,
    ]
  )

  const isWeeksEmpty = scheduleData.weeks.length === 0

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
