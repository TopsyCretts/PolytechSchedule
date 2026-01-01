import { IconButton } from "@/shared/ui"
import clsx from "clsx"
import "./ProfileItem.scss"
import { NavLink, useNavigate } from "react-router"
import type { ProfileType } from "@/entities/Profile.ts"
import { useInjection } from "inversify-react"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"
import { observer } from "mobx-react-lite"
import { getScheduleProfileRoute } from "@/app/routes/schedule/profileLoader.ts"

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
      useInjection<ProfilesStore>(ProfilesStore)

    const navigate = useNavigate()

    const handleRemove = () => {
      const nearestProfile = removeProfileAndReturnClosest(profileId)
      if (nearestProfile !== null) {
        navigate(
          getScheduleProfileRoute(
            nearestProfile.apiId.toString(),
            nearestProfile.profileType
          ),
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
          to={getScheduleProfileRoute(profileApiId.toString(), scheduleType)}
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
