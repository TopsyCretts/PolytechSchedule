import { IconButton } from "@shared/ui"
import clsx from "clsx"
import "./ProfileItem.scss"
import { NavLink, useNavigate, useParams } from "react-router"
import type { ProfileType } from "@/domain/models/Profile.ts"
import { useInjection } from "inversify-react"
import { ProfilesStore } from "@/domain/profiles/ProfilesStore.ts"
import { observer } from "mobx-react-lite"
import { getScheduleProfileRoute } from "@/pages/schedule/api/profileLoader.ts"

interface ProfilesProps {
  className?: string
  profileId: number
  profileName: string
  scheduleType: ProfileType
}

const ProfileItem = observer(
  ({ className, profileId, profileName, scheduleType }: ProfilesProps) => {
    const params = useParams()
    const id = Number(params.profileId)
    const isActive = id === profileId
    const { removeProfileAndReturnClosest } =
      useInjection<ProfilesStore>(ProfilesStore)

    const navigate = useNavigate()

    const handleRemove = () => {
      const nearestProfile = removeProfileAndReturnClosest(profileId)
      if (nearestProfile !== null) {
        navigate(
          getScheduleProfileRoute(
            nearestProfile.id.toString(),
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
        className={clsx(
          className,
          "profile-item",
          "hover-orange-20",
          isActive && "profile-item--active"
        )}
      >
        <NavLink
          to={getScheduleProfileRoute(profileId.toString(), scheduleType)}
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
