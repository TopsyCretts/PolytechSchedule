import { format, parse, startOfDay, startOfToday } from "date-fns"
import { useSearchParams } from "react-router"
import { QUERY_DATE_FORMAT } from "@/shared/constants/contstants.ts"
import { useCallback, useEffect, useState } from "react"

const useGetDateFromUrl = () => {
  const [searchParams] = useSearchParams()

  const getDateFromUrl = useCallback(() => {
    const dateParam = searchParams.get("date")
    if (!dateParam) {
      return startOfToday()
    }

    return startOfDay(parse(dateParam, QUERY_DATE_FORMAT, new Date()))
  }, [searchParams])

  const [dateFromUrl, setDateFromUrl] = useState(getDateFromUrl())

  useEffect(() => {
    setDateFromUrl(getDateFromUrl())
  }, [getDateFromUrl])

  return {
    dateFromUrl,
  }
}

const useSetDateToUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const setDateToUrl = (date: Date) => {
    const formattedDate = format(date, QUERY_DATE_FORMAT)
    searchParams.set("date", formattedDate)
    setSearchParams(searchParams, { replace: true })
  }

  return {
    setDateToUrl,
  }
}

export { useGetDateFromUrl, useSetDateToUrl }
