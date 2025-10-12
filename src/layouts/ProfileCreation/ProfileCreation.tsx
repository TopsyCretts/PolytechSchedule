import "./ProfileCreation.scss"
import clsx from "clsx"
import Switcher from "@components/Switcher"
import { Suspense, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"
import StudentProfileCreationForm from "@/layouts/ProfileCreation/StudentProfileCreationForm.tsx"
import TeacherProfileCreationForm from "@/layouts/ProfileCreation/TeacherProfileCreationForm.tsx"
import Spinner from "@components/Spinner"
import QueryErrorResetWrapper from "@/hoc/QueryErrorResetWrapper/QueryErrorResetWrapper.tsx"

const ProfileCreation = () => {
  const { t } = useTranslation()
  const items = useMemo(() => {
    return [
      { label: t(STRINGS_RES.teacher_one), value: "teacher" },
      { label: t(STRINGS_RES.student_one), value: "student" },
    ]
  }, [t])

  const [currentItem, setCurrentItem] = useState(items[0])

  return (
    <section className={clsx("container-small")}>
      <div className="profile-creation">
        <div className="profile-creation__body">
          <Switcher
            currentItem={currentItem}
            items={items}
            onItemChange={setCurrentItem}
          />

          {currentItem.value === "student" ? (
            <QueryErrorResetWrapper
              key={"student"}
              fallbackClassName={"profile-creation__retry-fallback"}
            >
              <Suspense
                fallback={
                  <Spinner className={"profile-creation__loading-fallback"} />
                }
              >
                <StudentProfileCreationForm
                  className={"profile-creation__form"}
                  onProfileCreation={() => {}}
                />
              </Suspense>
            </QueryErrorResetWrapper>
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
