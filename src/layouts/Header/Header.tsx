import "./Header.scss"
import clsx from "clsx"
import Logo from "@components/Logo"
import ArrowIcon from "@assets/icons/arrow-left.svg?react"
import { Link, NavLink, useMatch } from "react-router"
import LanguagePicker from "@components/LanguagePicker"
import ThemePicker from "@components/ThemePicker"
import BurgerMenu from "@components/BurgerMenu"
import { useEffect, useState } from "react"
import type { HeaderControlsProps } from "@/layouts/Header/types.ts"
import Profiles from "@components/Profiles"
import { Trans, useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"
import { ORIGINAL_SITE_LINK } from "@/constants/contstants.ts"

const Header = () => {
  const location = useMatch("/")

  const [isHome, setIsHome] = useState(location?.pathname === "/")

  useEffect(() => {
    setIsHome(location?.pathname === "/")
  }, [location?.pathname])

  return (
    <>
      <header className={clsx("header", "container")}>
        <HeaderAttention />
        <div className="header__inner">
          <div className="header__main">
            <NavLink
              className="header__link"
              to="/"
            >
              {!isHome && (
                <ArrowIcon
                  width={24}
                  height={24}
                  stroke="white"
                />
              )}
              <Logo
                className="header__logo"
                isTitle={isHome}
              />
            </NavLink>
            <HeaderControls isHomePage={isHome} />
          </div>
          <div className="header__extra">
            <Profiles className={"header__profiles"} />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header

const HeaderAttention = () => {
  useTranslation()
  return (
    <div className="header__attention">
      <p>
        <Trans i18nKey={STRINGS_RES.you_are_on_test_site}>
          Внимание! Вы находитесь на тестовой версии сайта. Перейти на{" "}
          <Link
            to={ORIGINAL_SITE_LINK}
            target={"_blank"}
          >
            основную версию
          </Link>
        </Trans>
      </p>
    </div>
  )
}

const HeaderControls = ({ isHomePage }: HeaderControlsProps) => {
  return (
    <div className="header__controls">
      <LanguagePicker
        className={"header__button"}
        isHiding={!isHomePage}
      />
      <ThemePicker
        className={"header__button"}
        isHiding={!isHomePage}
      />
      {!isHomePage && <BurgerMenu className={"header__button"} />}
    </div>
  )
}
