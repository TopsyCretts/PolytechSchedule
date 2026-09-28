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
import { WebLoaderIndicator } from "@/shared/ui"
import { profileLoader } from "@/app/routes/schedule/profileLoader.ts"
import NewProfilePage from "@/pages/NewProfilePage"
import ScheduleCalendarView from "@/pages/schedule-calendar"
import SchedulePage from "@/pages/schedule"
import ScheduleWeekSlider from "@/pages/schedule-week-slider"
import weekLoader from "@/app/routes/schedule/weekLoader.ts"
import { APP_ROUTES } from "@/shared/constants/routes.ts"

const RouterErrorElement = lazy(() => import("@/shared/ui/RouterErrorElement"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={"/"}
      element={<LayOut />}
      loader={async () => mainLoader}
      errorElement={<RouterErrorElement />}
      hydrateFallbackElement={<WebLoaderIndicator />}
    >
      <Route
        index
        loader={mainLoader}
        element={
          <Navigate
            to={APP_ROUTES.newProfile}
            replace
          />
        }
        errorElement={<RouterErrorElement />}
      />
      <Route
        path={"new-profile"}
        element={<NewProfilePage />}
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
            to={APP_ROUTES.notFound}
            replace
          />
        }
      />
      <Route
        path={"schedule/:profileType/:profileApiId/"}
        id={"schedule"}
        loader={profileLoader}
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
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Route>
        <Route
          path={"week"}
          loader={weekLoader}
          errorElement={<RouterErrorElement />}
          element={<ScheduleWeekSlider />}
        />
        <Route
          index
          element={
            <Navigate
              to={APP_ROUTES.notFound}
              replace
            />
          }
        />
      </Route>
    </Route>
  ),
  { basename: import.meta.env.BASE_URL }
)

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
