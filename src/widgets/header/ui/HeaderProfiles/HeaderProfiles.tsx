import "./HeaderProfiles.scss"
import clsx from "clsx"
import { ProfileItem } from "@/entities/profile"
import { useTranslation } from "react-i18next"
import NewProfileItem from "@/widgets/header/ui/NewProfileItem"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { useInjection } from "inversify-react"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"
import { observer } from "mobx-react-lite"
import { useMatch, useParams } from "react-router"
import { useEffect, useRef, useState } from "react"
import { APP_ROUTES } from "@/shared/constants/routes.ts"
import scrollContainerToSelectedElement from "@/shared/lib/scrollContainerToSelectedElement.ts"

interface ProfilesProps {
  className?: string
}

const newProfileLinkId = "new-profile-link-id"

const HeaderProfiles = observer(({ className }: ProfilesProps) => {
  const { t } = useTranslation()
  const { getProfiles: profiles } =
    useInjection<ProfilesManagerStore>(ProfilesManagerStore)
  const match = useMatch(APP_ROUTES.newProfile)
  const params = useParams()
  const [paramId, setParamId] = useState<string | undefined>()

  useEffect(() => {
    const newCurrentProfileId = params.profileApiId
    if (newCurrentProfileId !== undefined && newCurrentProfileId !== paramId) {
      setParamId(
        profiles
          .find((p) => p.apiId.toString() === newCurrentProfileId)
          ?.id.toString()
      )
    } else {
      setParamId(undefined)
    }
  }, [params])

  const profilesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (paramId) {
      scrollContainerToSelectedElement(
        profilesContainerRef.current!,
        paramId,
        "horizontal"
      )
    }
  }, [paramId])

  useEffect(() => {
    if (match !== null && profiles.length !== null) {
      scrollContainerToSelectedElement(
        profilesContainerRef.current!,
        newProfileLinkId,
        "horizontal",
        2
      )
    }
  }, [match, profiles.length])

  return (
    <section className={clsx(className, "profiles")}>
      <h2 className="visually-hidden">
        {t(STRINGS_RES.schedule_profile_other)}
      </h2>
      <div
        ref={profilesContainerRef}
        className="profiles__inner"
      >
        <ul className="profiles__list">
          {profiles.map(({ id, apiId, name, profileType }) => (
            <ProfileItem
              key={id}
              className={"profiles__item"}
              htmlId={id.toString()}
              profileId={id}
              profileName={name}
              profileApiId={apiId}
              isActive={paramId === id.toString()}
              scheduleType={profileType}
            />
          ))}
          <NewProfileItem
            className={"profiles__new-profile-link"}
            id={newProfileLinkId}
          />
        </ul>
      </div>
    </section>
  )
})

export default HeaderProfiles
