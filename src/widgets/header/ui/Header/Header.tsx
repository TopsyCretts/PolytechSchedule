import "./Header.scss"
import clsx from "clsx"
import { Logo } from "@/shared/ui"
import ArrowIcon from "@/assets/icons/arrow-left.svg?react"
import { Link, useMatch } from "react-router"
import LanguagePicker from "@/widgets/LanguagePicker"
import ThemeToggler from "@/widgets/ThemeToggler"
import BurgerMenu from "@/widgets/BurgerMenu"
import type { HeaderControlsProps } from "@/widgets/header/lib/types.ts"
import Profiles from "@/widgets/header/ui/Profiles"
import { Trans, useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { ORIGINAL_SITE } from "@/shared/constants/contstants.ts"
import HeaderProfileLabel from "@/widgets/header/ui/HeaderProfileLabel/HeaderProfileLabel.tsx"

const Header = () => {
  const location = useMatch("/")
  const isHome = location?.pathname === "/"

  return (
    <header className={clsx("header", "container")}>
      <HeaderAttention />
      <div className="header__inner">
        <div className="header__main">
          <HeaderLink isHomePage={isHome} />
          <HeaderProfileLabel />
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
      to="/"
    >
      {!isHomePage && (
        <ArrowIcon
          className={"header__arrow-icon"}
          width={24}
          height={24}
        />
      )}
      <Logo
        className="header__logo h3"
        isTitle={isHomePage}
      />
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
