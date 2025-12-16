import "./SchedulePage.scss"
import clsx from "clsx"
import { useLoaderData } from "react-router"
import { useMemo } from "react"
import { useInjection } from "inversify-react"
import { observer } from "mobx-react-lite"
import type { SchedulePageProps } from "@/pages/schedule/model/SchedulePageProps.ts"
import type { profileLoader } from "@/app/routes/schedule/profileLoader.ts"
import { InstitutesStore } from "@/app/store/institutes/InstitutesStore.ts"
import { TeachersStore } from "@/app/store/teachers/TeachersStore.ts"
import { ScheduleLayout } from "@/pages/schedule/ui/ScheduleLayout/ScheduleLayout.tsx"

const SchedulePage = observer(({ className }: SchedulePageProps) => {
  const { profile } = useLoaderData<typeof profileLoader>()

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
        profile={profile}
        teachers={teachers}
        actualGroups={actualGroups}
      />
    </main>
  )
})

export default SchedulePage
