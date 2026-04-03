import { useParams } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { PROFILE_TYPE } from "@/entities/profile/model/Profile.ts"
import { observer } from "mobx-react-lite"
import { useInjection } from "inversify-react"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { TeachersStore } from "@/entities/teachers/model/TeachersStore.ts"
import "./HeaderProfileLabel.scss"

const HeaderProfileLabel = observer(() => {
  const { profileApiId, profileType } = useParams()
  const { getInstituteByGroupId } = useInjection(InstitutesStore)
  const { getTeacherById } = useInjection(TeachersStore)

  if (!profileApiId) {
    return null
  }

  const id = Number(profileApiId)
  const isStudent = profileType === PROFILE_TYPE.student
  const isTeacher = profileType === PROFILE_TYPE.teacher

  const institute = isStudent ? getInstituteByGroupId(id) : null
  const teacher = isTeacher ? getTeacherById(id) : null

  if (!institute && !teacher) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="header-profile-label"
        key={profileApiId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isStudent && institute && (
          <>
            <div className="header-profile-label__institute hidden-mobile">
              {institute.institute}
              <div className="header-profile-label__dash">-</div>
            </div>
            <div className="header-profile-label__name">
              {institute.group.name}
            </div>
          </>
        )}
        {isTeacher && teacher && (
          <div className="header-profile-label__name">{teacher.name}</div>
        )}
      </motion.div>
    </AnimatePresence>
  )
})

export default HeaderProfileLabel
