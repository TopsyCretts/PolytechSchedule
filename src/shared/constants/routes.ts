const APP_ROUTES = {
  home: "/",
  newProfile: "/new-profile",
  scheduleCalendar: "/schedule/:profileType/:profileApiId/calendar",
  scheduleWeek: "/schedule/:profileType/:profileApiId/week",
  notFound: "/not-found",
} as const

export { APP_ROUTES }
