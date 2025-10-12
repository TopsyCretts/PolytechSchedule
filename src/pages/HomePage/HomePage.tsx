import "./HomePage.scss"
import clsx from "clsx"
import { ProfileCreation } from "@/layouts/ProfileCreation"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <main className={clsx("home-page")}>
      <title>{t(STRINGS_RES.polytech)}</title>
      <h1 className="visually-hidden">Страница выбора расписания</h1>
      <ProfileCreation />
    </main>
  )
}

export default HomePage
