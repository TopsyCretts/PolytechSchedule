import "./SchedulePage.scss"
import clsx from "clsx"
import { useMemo } from "react"
import { useInjection } from "inversify-react"
import { observer } from "mobx-react-lite"
import type { SchedulePageProps } from "@/pages/schedule/model/SchedulePageProps.ts"
import { InstitutesStore } from "@/entities/institute/model/InstitutesStore.ts"
import { TeachersStore } from "@/entities/teachers/model/TeachersStore.ts"
import { ScheduleLayout } from "@/pages/schedule/ui/ScheduleLayout/ScheduleLayout.tsx"
import { ProfilesManagerStore } from "@/features/profile/model/ProfilesManagerStore.ts"

const SchedulePage = observer(({ className }: SchedulePageProps) => {
  const { getCurrentProfile: currentProfile } =
    useInjection(ProfilesManagerStore)

  if (currentProfile === null) {
    throw new Response("Profile creation failed", { status: 404 })
  }

  const { getInstitutes: institutes = [], getAllGroups } =
    useInjection(InstitutesStore)
  const { getTeachers: teachers = [] } = useInjection(TeachersStore)

  const actualGroups = useMemo(() => {
    return getAllGroups(institutes)
  }, [institutes, getAllGroups])

  return (
    <main className={clsx(className, "schedule-page", "overflow-x-hidden")}>
      <ScheduleLayout
        key={currentProfile.id}
        className={"schedule-page__schedule-layout"}
        profile={currentProfile}
        teachers={teachers}
        actualGroups={actualGroups}
      />
    </main>
  )
})

export default SchedulePage
