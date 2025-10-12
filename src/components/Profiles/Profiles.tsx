import "./Profiles.scss"
import clsx from "clsx"
import ProfileItem from "@components/ProfileItem"
import { useTranslation } from "react-i18next"
import NewProfileLink from "@components/NewProfileLink"
import type { BaseProfile } from "@/domain/models/Profile.ts"
import { STRINGS_RES } from "@/constants/strings.ts"

interface ProfilesProps {
  className?: string
}

const profiles: BaseProfile[] = Array(6)
  .fill(0)
  .map((_, index) => {
    return {
      id: "Profile " + index,
      name: "Profile " + (index + 1),
      scheduleType: "student",
      lastUsed: new Date(),
    }
  })

const Profiles = ({ className }: ProfilesProps) => {
  const { t } = useTranslation()
  return (
    <section className={clsx(className, "profiles")}>
      <h2 className="visually-hidden">
        {t(STRINGS_RES.schedule_profile_other)}
      </h2>
      <div className="profiles__inner">
        <ul className="profiles__list">
          {profiles.map((profile, index) => (
            <ProfileItem
              key={profile.id}
              className={"profiles__item"}
              profileName={profile.name}
              profileId={String(index)}
              scheduleType={profile.scheduleType}
            />
          ))}
          <NewProfileLink className={"profiles__new-profile-link"} />
        </ul>
      </div>
    </section>
  )
}

export default Profiles
