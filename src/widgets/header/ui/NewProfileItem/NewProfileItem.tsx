import "./NewProfileItem.scss"
import clsx from "clsx"
import { NavLink, useMatch } from "react-router"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import { useTranslation } from "react-i18next"

interface NewProfileLinkProps {
  className?: string
  id?: string
}

const NewProfileItem = ({ className, id }: NewProfileLinkProps) => {
  const { t } = useTranslation()
  const matches = useMatch("/new-profile")

  return (
    <li
      id={id}
      className={clsx(
        className,
        "new-profile-item",
        "hover-orange-20",
        matches !== null && "new-profile-item--active"
      )}
    >
      <NavLink
        to={"/new-profile"}
        className={"new-profile-item__link"}
        title={t(STRINGS_RES.create_new_schedule_profile)}
      >
        {t(STRINGS_RES.new_profile)}
      </NavLink>
    </li>
  )
}

export default NewProfileItem
