import "./SchedulePage.scss"
import clsx from "clsx"
import { useEffect, useMemo } from "react"
import { useInjection } from "inversify-react"
import { observer } from "mobx-react-lite"
import type { SchedulePageProps } from "@/pages/schedule/model/SchedulePageProps.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import { ScheduleLayout } from "@/pages/schedule/ui/ScheduleLayout/ScheduleLayout.tsx"
import { ProfilesStore } from "@/app/store/profiles/ProfilesStore.ts"

const SchedulePage = observer(({ className }: SchedulePageProps) => {
  const { getCurrentProfile: currentProfile } = useInjection(ProfilesStore)

  useEffect(() => {
    console.log(currentProfile?.id)
  }, [currentProfile?.id])

  if (currentProfile === null) {
    throw new Response("Profile creation failed", { status: 404 })
  }

  const { getInstitutes: institutes, getAllGroups } =
    useInjection(InstitutesStore)
  const { getTeachers: teachers } = useInjection(TeachersStore)

  const actualGroups = useMemo(() => {
    return getAllGroups(institutes)
  }, [institutes, getAllGroups])

  return (
    <main className={clsx(className, "schedule-page", "overflow-x-hidden")}>
      <ScheduleLayout
        className={"schedule-page__schedule-layout"}
        profile={currentProfile}
        teachers={teachers}
        actualGroups={actualGroups}
      />
    </main>
  )
})

export default SchedulePage
