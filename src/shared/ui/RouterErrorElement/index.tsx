import { Navigate, useRouteError } from "react-router"

const RouterErrorElement = () => {
  const error = useRouteError()
  const response = error as Response
  if (response !== undefined) {
    if (response.status === 404) {
      return (
        <Navigate
          to={"/not-found"}
          replace={true}
        />
      )
    }
  }
  return (
    <div>
      <h1>An unknown error has occurred</h1>
    </div>
  )
}

export default RouterErrorElement
