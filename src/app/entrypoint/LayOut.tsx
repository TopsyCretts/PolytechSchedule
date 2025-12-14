import { Outlet, useMatch } from "react-router"
import { Header } from "@widgets/header"
import ScrollToTop from "@/app/routes/ScrollToTop.tsx"

const LayOut = () => {
  const match = useMatch("not-found")
  return (
    <>
      <ScrollToTop />
      {match === null && <Header />}
      <Outlet />
    </>
  )
}

export default LayOut
