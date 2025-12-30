import { format, parse, startOfToday } from "date-fns"
import { useSearchParams } from "react-router"
import { QUERY_DATE_FORMAT } from "@/shared/constants/contstants.ts"

const useGetDateFromUrl = () => {
  const [searchParams] = useSearchParams()

  const getDateFromUrl = () => {
    const dateParam = searchParams.get("date")
    if (!dateParam) {
      return startOfToday()
    }

    return parse(dateParam, QUERY_DATE_FORMAT, new Date())
  }

  return {
    getDateFromUrl,
  }
}

const useSetDateToUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const setDateToUrl = (date: Date) => {
    const formattedDate = format(date, QUERY_DATE_FORMAT)
    searchParams.set("date", formattedDate)
    setSearchParams(searchParams)
  }

  return {
    setDateToUrl,
  }
}

export { useGetDateFromUrl, useSetDateToUrl }
