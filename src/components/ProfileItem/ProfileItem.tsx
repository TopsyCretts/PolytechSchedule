import IconButton from "@components/IconButton"
import clsx from "clsx"
import "./ProfileItem.scss"
import { NavLink, useParams } from "react-router"
import type { ScheduleType } from "@/domain/models/Profile.ts"

interface ProfilesProps {
  className?: string
  profileId: string
  profileName: string
  scheduleType: ScheduleType
}

const scheduleLink = (profileId: string, scheduleType: ScheduleType) => {
  return `/schedule/${profileId}?scheduleType=${scheduleType}`
}

const ProfileItem = ({
  className,
  profileId,
  profileName,
  scheduleType,
}: ProfilesProps) => {
  const params = useParams()
  const isActive = params.profileId === profileId

  return (
    <div
      className={clsx(
        className,
        "profile-item",
        "hover-orange-20",
        isActive && "profile-item--active"
      )}
    >
      <NavLink
        to={scheduleLink(profileId, scheduleType)}
        className={"profile-item__link"}
        title={profileName}
      >
        {profileName}
      </NavLink>
      {isActive && (
        <IconButton
          className={"profile-item__cross"}
          iconType={"cross"}
          onClick={() => {}}
        />
      )}
    </div>
  )
}

export default ProfileItem
