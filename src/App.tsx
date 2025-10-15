import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router"
import { lazy } from "react"
import { profileLoader } from "@/pages/schedule"

const HomePage = lazy(() => import("@/pages/HomePage"))
const LayOut = lazy(() => import("@/hoc/LayOut.tsx"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const SchedulePage = lazy(() => import("@/pages/schedule"))
const RouterErrorElement = lazy(() => import("@components/RouterErrorElement"))

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
        path={"schedule/:profileId"}
        id={"schedule"}
        loader={async ({ request, context, params }) =>
          profileLoader({ request, context, params })
        }
        element={<SchedulePage />}
        errorElement={<RouterErrorElement />}
      />
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
