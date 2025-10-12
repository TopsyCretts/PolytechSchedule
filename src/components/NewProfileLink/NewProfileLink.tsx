import "./NewProfileLink.scss"
import clsx from "clsx"
import { NavLink } from "react-router"
import { STRINGS_RES } from "@/constants/strings.ts"
import { useTranslation } from "react-i18next"

interface NewProfileLinkProps {
  className?: string
}

const NewProfileLink = ({ className }: NewProfileLinkProps) => {
  const { t } = useTranslation()

  return (
    <NavLink
      to={"/new-profile"}
      className={({ isActive }) =>
        clsx(
          className,
          "new-profile-link",
          "hover-orange-20",
          isActive && "new-profile-link--active"
        )
      }
      title={t(STRINGS_RES.create_new_schedule_profile)}
    >
      {t(STRINGS_RES.new_profile)}
    </NavLink>
  )
}

export default NewProfileLink
