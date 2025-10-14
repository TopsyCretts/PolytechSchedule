import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router"
import HomePage from "@/pages/HomePage"
import LayOut from "@/layouts/LayOut/LayOut.tsx"
import NotFoundPage from "@/pages/NotFoundPage"
import SchedulePage from "@/pages/SchedulePage"
import RouterErrorElement from "@components/RouterErrorElement"
import { profileLoader } from "@/routes/scheduleRoute.ts"

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
        path={"schedule/:profileId"}
        loader={profileLoader}
        element={<SchedulePage />}
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
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
