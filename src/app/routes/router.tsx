import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router"
import { lazy } from "react"
import LayOut from "@/app/entrypoint/LayOut.tsx"
import { mainLoader } from "@/app/routes/main/mainLoader.ts"
import { WebLoaderIndicator } from "@shared/ui"
import { profileLoader } from "@/app/routes/schedule/profileLoader.ts"
import HomePage from "@/pages/HomePage"
import ScheduleCalendarView from "@/pages/schedule-calendar"
import SchedulePage from "@/pages/schedule"
import ScheduleWeekSlider from "@/pages/schedule-week-slider"
import ScheduleDayView from "@/pages/schedule-day"

const RouterErrorElement = lazy(() => import("@shared/ui/RouterErrorElement"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={"/"}
      element={<LayOut />}
      errorElement={<RouterErrorElement />}
      hydrateFallbackElement={<WebLoaderIndicator />}
    >
      <Route
        index
        element={<HomePage />}
        loader={mainLoader}
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
        path={"schedule/:profileType/:profileApiId/"}
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
