import { useMatch, useParams } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { APP_ROUTES } from "@/routes/routes.ts"
import type { Profile, StudentProfile } from "@/domain/models/Profile.ts"
import { useInjection } from "inversify-react"
import { ProfilesStore } from "@/domain/profiles/ProfilesStore.ts"
import { observer } from "mobx-react-lite"
import "./HeaderProfileLabel.scss"

const castProfileAsStudent = (profile: Profile): StudentProfile => {
  return profile as StudentProfile
}

const HeaderProfileLabel = observer(() => {
  const match = useMatch({ path: APP_ROUTES.schedule, end: false })
  const { getProfile } = useInjection(ProfilesStore)
  const params = useParams()
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setCurrentProfile(null)
    if (match !== null && params.profileId !== undefined) {
      const profile = getProfile(params.profileId)
      setTimeout(() => {
        setCurrentProfile(profile)
      }, 100)
    }
  }, [params, match])

  return (
    <AnimatePresence>
      {currentProfile !== null && match !== null && (
        <motion.div
          className={"header-profile-label"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {currentProfile.scheduleType === "student" && (
            <div className={"header-profile-label__institute hidden-mobile"}>
              {castProfileAsStudent(currentProfile).institute}
              <div className="header-profile-label__dash">{"-"}</div>
            </div>
          )}
          <div className="header-profile-label__name">
            {currentProfile.name}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default HeaderProfileLabel
