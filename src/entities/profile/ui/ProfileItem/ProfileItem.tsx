import { IconButton } from "@/shared/ui"
import clsx from "clsx"
import "./ProfileItem.scss"
import { generatePath, NavLink, useNavigate } from "react-router"
import type { ProfileType } from "@/entities/profile/model/Profile.ts"
import { useInjection } from "inversify-react"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { observer } from "mobx-react-lite"
import { APP_ROUTES } from "@/shared/constants/routes.ts"

interface ProfilesProps {
  className?: string
  htmlId?: string
  profileId: number
  profileApiId: number
  profileName: string
  scheduleType: ProfileType
  isActive: boolean
}

const ProfileItem = observer(
  ({
    htmlId,
    profileId,
    className,
    profileApiId,
    profileName,
    scheduleType,
    isActive,
  }: ProfilesProps) => {
    const { removeProfileAndReturnClosest } =
      useInjection<ProfilesManagerStore>(ProfilesManagerStore)

    const navigate = useNavigate()

    const handleRemove = async () => {
      const nearestProfile = await removeProfileAndReturnClosest(profileId)
      if (nearestProfile !== null) {
        navigate(
          generatePath(APP_ROUTES.scheduleCalendar, {
            profileType: scheduleType,
            profileApiId: nearestProfile.apiId.toString(),
          }),
          { replace: true }
        )
      } else {
        navigate("/new-profile", { replace: true })
      }
    }

    return (
      <li
        id={htmlId}
        className={clsx(
          className,
          "profile-item",
          "hover-orange-20",
          isActive && "profile-item--active"
        )}
      >
        <NavLink
          to={generatePath(APP_ROUTES.scheduleCalendar, {
            profileApiId: profileApiId.toString(),
            profileType: scheduleType,
          })}
          className={"profile-item__link"}
          title={profileName}
        >
          {profileName}
        </NavLink>
        {isActive && (
          <IconButton
            className={"profile-item__cross"}
            iconType={"cross"}
            onClick={handleRemove}
          />
        )}
      </li>
    )
  }
)

export default ProfileItem
