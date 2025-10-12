import Header from "../Header"
import { Outlet, useMatch } from "react-router"

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
