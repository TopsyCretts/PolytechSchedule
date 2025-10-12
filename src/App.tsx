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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={"/"}
      element={<LayOut />}
    >
      <Route
        index
        element={<HomePage />}
      />
      <Route
        path={"new-profile"}
        element={<HomePage />}
      />
      <Route
        path={"schedule/:profileId"}
        element={<SchedulePage />}
      />
      <Route
        path={"not-found"}
        element={<NotFoundPage />}
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
