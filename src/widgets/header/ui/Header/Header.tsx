import "./Header.scss"
import clsx from "clsx"
import { Logo } from "@/shared/ui"
import { Link, useMatch, useParams } from "react-router"
import LanguagePicker from "@/widgets/LanguagePicker"
import ThemeToggler from "@/widgets/ThemeToggler"
import BurgerMenu from "@/widgets/BurgerMenu"
import type { HeaderControlsProps } from "@/widgets/header/lib/types.ts"
import Profiles from "@/widgets/header/ui/Profiles"
import { Trans, useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import {
  ORIGINAL_SITE,
  QUERY_DATE_FORMAT,
} from "@/shared/constants/contstants.ts"
import HeaderProfileLabel from "@/widgets/header/ui/HeaderProfileLabel/HeaderProfileLabel.tsx"
import { format, startOfToday } from "date-fns"
import type { ProfileType } from "@/entities/Profile.ts"
import useMediaQueryListEvent from "@/shared/lib/useMediaQueryListEvent.ts"
import { MATCH_MEDIA } from "@/shared/constants/media.ts"
import { SCHEDULE_VIEW } from "@/entities/ScheduleData.ts"
import { APP_ROUTES, routeWithParams } from "@/app/routes/routes.ts"
import ArrowIcon from "@/assets/icons/arrow-long-right.svg?react"

const Header = () => {
  const location = useMatch(APP_ROUTES.newProfile)
  const isHome = location?.pathname === APP_ROUTES.newProfile

  return (
    <header className={clsx("header", "container")}>
      <HeaderAttention />
      <div className="header__inner">
        <div className="header__main">
          <HeaderLink isHomePage={isHome} />
          <div className="header__profile-label-wrapper">
            <HeaderProfileLabel />
            <MoveOnTodayLink />
          </div>
          <HeaderControls isHomePage={isHome} />
        </div>
        <div className="header__extra">
          <Profiles className={"header__profiles"} />
        </div>
      </div>
    </header>
  )
}

export default Header

const HeaderLink = ({ isHomePage }: HeaderControlsProps) => {
  return (
    <Link
      className="header__link"
      to="/new-profile"
    >
      <Logo
        className="header__logo h3"
        isTitle={isHomePage}
      />
    </Link>
  )
}

const MoveOnTodayLink = () => {
  const { profileApiId, profileType } = useParams()
  const { t } = useTranslation()

  const { isMatchesMedia: isLaptop } = useMediaQueryListEvent(
    MATCH_MEDIA.laptop
  )

  if (!profileApiId || (profileType as ProfileType) === undefined) {
    return null
  }

  return (
    <Link
      className="header__today-link"
      to={routeWithParams(
        "/schedule",
        [profileType!, profileApiId.toString()],
        { date: format(startOfToday(), QUERY_DATE_FORMAT) },
        isLaptop ? SCHEDULE_VIEW.week : SCHEDULE_VIEW.calendar
      )}
    >
      {t(STRINGS_RES.on_today)} {format(startOfToday(), "dd.MM")}
      <ArrowIcon className={"header__icon"} />
    </Link>
  )
}

const HeaderAttention = () => {
  useTranslation()
  return (
    window.location.hostname !== ORIGINAL_SITE.hostname && (
      <div className="header__attention">
        <p>
          <Trans i18nKey={STRINGS_RES.you_are_on_test_site}>
            Внимание! Вы находитесь на тестовой версии сайта. Перейти на{" "}
            <Link
              to={ORIGINAL_SITE.link}
              target={"_blank"}
            >
              основную версию
            </Link>
          </Trans>
        </p>
      </div>
    )
  )
}

const HeaderControls = ({ isHomePage }: HeaderControlsProps) => {
  return (
    <div className="header__controls">
      <LanguagePicker
        className={"header__button"}
        isHiding={!isHomePage}
      />
      <ThemeToggler
        className={"header__button"}
        isHiding={!isHomePage}
      />
      {!isHomePage && <BurgerMenu className={"header__button"} />}
    </div>
  )
}
