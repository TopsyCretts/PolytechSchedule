import { Outlet, useMatch } from "react-router"
import { Header } from "@widgets/header"

const LayOut = () => {
  const match = useMatch("not-found")
  return (
    <>
      {match === null && <Header />}
      <Outlet />
    </>
  )
}

export default LayOut
