import "./ProfileCreation.scss"
import clsx from "clsx"
import { Spinner, Switcher } from "@/shared/ui"
import { type PropsWithChildren, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { PROFILE_TYPE } from "@/entities/profile/model/Profile.ts"
import type { BaseComponent } from "@/shared/models/BaseComponent.ts"
import {
  StudentProfileCreationForm,
  TeacherProfileCreationForm,
} from "@/features/profile/ui/ProfileCreationForm"
import { QueryResetSuspenseBoundary } from "@/shared/api/QueryResetSuspenseBoundary.tsx"
import RetryFallback from "@/widgets/RetryFallback"
import { observer } from "mobx-react-lite"
import { useInjection } from "inversify-react"
import { InstitutesStore } from "@/entities/institute"
import { TeachersStore } from "@/entities/teachers"

const ProfileCreation = observer(({ className }: BaseComponent) => {
  const { t } = useTranslation()
  const items = useMemo(() => {
    return [
      { label: t(STRINGS_RES.teacher_one), value: PROFILE_TYPE.teacher },
      { label: t(STRINGS_RES.student_one), value: PROFILE_TYPE.student },
    ]
  }, [t])

  const { resetError: resetInstitutesError } =
    useInjection<InstitutesStore>(InstitutesStore)
  const { resetError: resetTeachersError } =
    useInjection<TeachersStore>(TeachersStore)
  const [currentItem, setCurrentItem] = useState(items[1])

  return (
    <section className={clsx(className, "profile-creation", "container-small")}>
      <div className="profile-creation__inner">
        <div className="profile-creation__body">
          <Switcher
            className={"profile-creation__switcher"}
            currentItem={currentItem}
            items={items}
            onItemChange={setCurrentItem}
          />
          {currentItem.value === PROFILE_TYPE.student ? (
            <ProfileCreationErrorBoundary onReset={resetInstitutesError}>
              <StudentProfileCreationForm
                className={"profile-creation__form"}
                onProfileCreation={() => {}}
              />
            </ProfileCreationErrorBoundary>
          ) : (
            <ProfileCreationErrorBoundary onReset={resetTeachersError}>
              <TeacherProfileCreationForm
                className={"profile-creation__form"}
                onProfileCreation={() => {}}
              />
            </ProfileCreationErrorBoundary>
          )}
        </div>
      </div>
    </section>
  )
})

export default ProfileCreation

const ProfileCreationErrorBoundary = ({
  children,
  onReset,
}: PropsWithChildren<{ onReset: () => void }>) => {
  return (
    <QueryResetSuspenseBoundary
      loader={<Spinner className={"profile-creation__loading-fallback"} />}
      retryFallback={({ resetErrorBoundary }) => (
        <RetryFallback
          className={"profile-creation__retry-fallback"}
          onRetry={() => {
            onReset()
            resetErrorBoundary()
          }}
        />
      )}
    >
      {children}
    </QueryResetSuspenseBoundary>
  )
}
