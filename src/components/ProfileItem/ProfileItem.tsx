import IconButton from "@components/IconButton"
import clsx from "clsx"
import "./ProfileItem.scss"
import { NavLink, useNavigate, useParams } from "react-router"
import type { ScheduleType } from "@/domain/models/Profile.ts"
import { useInjection } from "inversify-react"
import { ProfilesStore } from "@/domain/profiles/ProfilesStore.ts"
import { observer } from "mobx-react-lite"
import { getScheduleProfileRoute } from "@/routes/scheduleRoute.ts"

interface ProfilesProps {
  className?: string
  profileId: string
  profileName: string
  scheduleType: ScheduleType
}

const ProfileItem = observer(
  ({ className, profileId, profileName, scheduleType }: ProfilesProps) => {
    const params = useParams()
    const isActive = params.profileId === profileId
    const { removeProfile } = useInjection<ProfilesStore>(ProfilesStore)

    const navigate = useNavigate()

    const handleRemove = () => {
      const nearestProfile = removeProfile(profileId)
      if (nearestProfile !== null) {
        navigate(
          getScheduleProfileRoute(
            nearestProfile.id,
            nearestProfile.scheduleType
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
          to={getScheduleProfileRoute(profileId, scheduleType)}
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
