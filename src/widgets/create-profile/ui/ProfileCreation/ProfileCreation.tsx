import "./ProfileCreation.scss"
import clsx from "clsx"
import { Spinner, Switcher } from "@shared/ui"
import { Suspense, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import StudentProfileCreationForm from "@widgets/create-profile/ui/ProfileCreation/StudentProfileCreationForm.tsx"
import TeacherProfileCreationForm from "@widgets/create-profile/ui/ProfileCreation/TeacherProfileCreationForm.tsx"
import QueryErrorResetWrapper from "@shared/hoc/QueryErrorResetWrapper/QueryErrorResetWrapper.tsx"
import { PROFILE_TYPE } from "@/entities/Profile.ts"

const ProfileCreation = () => {
  const { t } = useTranslation()
  const items = useMemo(() => {
    return [
      { label: t(STRINGS_RES.teacher_one), value: PROFILE_TYPE.teacher },
      { label: t(STRINGS_RES.student_one), value: PROFILE_TYPE.student },
    ]
  }, [t])

  const [currentItem, setCurrentItem] = useState(items[1])

  return (
    <section className={clsx("container-small")}>
      <div className="profile-creation">
        <div className="profile-creation__body">
          <Switcher
            currentItem={currentItem}
            items={items}
            onItemChange={setCurrentItem}
          />
          {currentItem.value === PROFILE_TYPE.student ? (
            <StudentProfileCreationForm
              className={"profile-creation__form"}
              onProfileCreation={() => {}}
            />
          ) : (
            <QueryErrorResetWrapper
              key={"teacher"}
              fallbackClassName={"profile-creation__retry-fallback"}
            >
              <Suspense
                fallback={
                  <Spinner className={"profile-creation__loading-fallback"} />
                }
              >
                <TeacherProfileCreationForm
                  className={"profile-creation__form"}
                  onProfileCreation={() => {}}
                />
              </Suspense>
            </QueryErrorResetWrapper>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProfileCreation
