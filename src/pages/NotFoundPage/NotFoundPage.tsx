import "./NotFoundPage.scss"
import clsx from "clsx"
import { Link } from "react-router"
import NotfoundIcon from "@/assets/icons/404.svg"
import { Trans, useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <main className={clsx("not-found-page")}>
      <h1 className="visually-hidden">{t(STRINGS_RES.polytech)}</h1>
      <section className="not-found-page__inner">
        <h2 className="not-found-page__title">
          {t(STRINGS_RES.not_found_title)}
        </h2>
        <img
          className="not-found-page__image"
          src={NotfoundIcon}
          alt="404"
          width="578"
          height="248"
          loading="lazy"
        />
        <div className="not-found-page__back-home">
          <Trans i18nKey={STRINGS_RES.not_found_back_home}>
            <div className="not-found-page__label text-16">
              А вы пока можете вернуться
            </div>
            <Link
              className={"not-found-page__home-link"}
              to={"/"}
              replace
            >
              На главную
            </Link>
          </Trans>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage
