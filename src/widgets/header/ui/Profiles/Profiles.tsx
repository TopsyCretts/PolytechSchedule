import "./Profiles.scss"
import clsx from "clsx"
import ProfileItem from "@widgets/header/ui/ProfileItem"
import { useTranslation } from "react-i18next"
import NewProfileItem from "@widgets/header/ui/NewProfileItem"
import { STRINGS_RES } from "@/constants/strings.ts"
import { useInjection } from "inversify-react"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"
import { observer } from "mobx-react-lite"

interface ProfilesProps {
  className?: string
}

const Profiles = observer(({ className }: ProfilesProps) => {
  const { t } = useTranslation()
  const { getProfiles: profiles } = useInjection<ProfilesStore>(ProfilesStore)
  return (
    <section className={clsx(className, "profiles")}>
      <h2 className="visually-hidden">
        {t(STRINGS_RES.schedule_profile_other)}
      </h2>
      <div className="profiles__inner">
        <ul className="profiles__list">
          {profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              className={"profiles__item"}
              profileName={profile.name}
              profileId={profile.id}
              scheduleType={profile.profileType}
            />
          ))}
          <NewProfileItem className={"profiles__new-profile-link"} />
        </ul>
      </div>
    </section>
  )
})

export default Profiles
