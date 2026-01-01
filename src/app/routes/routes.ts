const routeWithParams = (
  path: string,
  params: string[],
  searchParams?: Record<string, string>,
  destination: string = ""
) => {
  let newPath = path
  params.map((param) => {
    const encodedParam = encodeURIComponent(param)
    newPath = `${newPath}/${encodedParam}`
  })
  newPath = `${newPath}/${destination}`
  const urlParams = new URLSearchParams(searchParams)

  return `${newPath}?${urlParams}`
}

const APP_ROUTES = {
  home: "/",
  newProfile: "/new-profile",
  scheduleIndex: "/schedule",
  scheduleCalendar: "schedule/:profileType/:profileApiId/calendar",
  scheduleWeek: "schedule/:profileType/:profileApiId/week",
  notFound: "/not-found",
} as const

export { routeWithParams, APP_ROUTES }
