import { useRouteLoaderData } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import type { Profile, StudentProfile } from "@/entities/Profile.ts"
import { observer } from "mobx-react-lite"
import "./HeaderProfileLabel.scss"
import type { profileLoader } from "@/app/routes/schedule/profileLoader.ts"
import { useDebounce } from "use-debounce"

const castProfileAsStudent = (profile: Profile): StudentProfile => {
  return profile as StudentProfile
}

const HeaderProfileLabel = observer(() => {
  const loaderData = useRouteLoaderData<typeof profileLoader>("schedule")
  const [debouncedProfile] = useDebounce(loaderData, 200)

  return (
    <AnimatePresence>
      {loaderData !== undefined &&
        debouncedProfile !== undefined &&
        loaderData.profile.id === debouncedProfile.profile.id && (
          <motion.div
            className={"header-profile-label"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {debouncedProfile.profile.profileType === "student" && (
              <div className={"header-profile-label__institute hidden-mobile"}>
                {castProfileAsStudent(debouncedProfile.profile).institute}
                <div className="header-profile-label__dash">{"-"}</div>
              </div>
            )}
            <div className="header-profile-label__name">
              {debouncedProfile.profile.name}
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  )
})

export default HeaderProfileLabel
