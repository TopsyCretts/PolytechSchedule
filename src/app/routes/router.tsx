import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router"
import { profileLoader } from "@/pages/schedule"
import { lazy } from "react"
import LayOut from "@/hoc/LayOut.tsx"

const HomePage = lazy(() => import("@/pages/HomePage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const SchedulePage = lazy(() => import("@/pages/schedule"))
const ScheduleCalendarView = lazy(
  () => import("@/pages/schedule-calendar/ui/ScheduleCalendarView")
)
const ScheduleWeekSlider = lazy(() => import("@/pages/schedule-week-slider"))
const ScheduleDayView = lazy(() => import("@/pages/schedule-day"))
const RouterErrorElement = lazy(() => import("@shared/ui/RouterErrorElement"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={"/"}
      element={<LayOut />}
      errorElement={<RouterErrorElement />}
    >
      <Route
        index
        element={<HomePage />}
        errorElement={<RouterErrorElement />}
      />
      <Route
        path={"new-profile"}
        element={<HomePage />}
        errorElement={<RouterErrorElement />}
      />
      <Route
        path={"not-found"}
        element={<NotFoundPage />}
        errorElement={<RouterErrorElement />}
      />
      <Route
        path={"*"}
        element={
          <Navigate
            to={"/not-found"}
            replace
          />
        }
      />
      <Route
        path={"schedule/:profileId/"}
        id={"schedule"}
        loader={async ({ request, context, params }) =>
          profileLoader({ request, context, params })
        }
        element={<SchedulePage />}
        errorElement={<RouterErrorElement />}
      >
        <Route
          path={"calendar/"}
          errorElement={<RouterErrorElement />}
        >
          <Route
            index
            element={<ScheduleCalendarView />}
            errorElement={<RouterErrorElement />}
          />
          <Route
            path={"day"}
            errorElement={<RouterErrorElement />}
            element={<ScheduleDayView />}
          />
        </Route>
        <Route
          path={"week"}
          errorElement={<RouterErrorElement />}
          element={<ScheduleWeekSlider />}
        />
        <Route
          index
          element={
            <Navigate
              to="/not-found"
              replace
            />
          }
        />
      </Route>
    </Route>
  )
)

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
