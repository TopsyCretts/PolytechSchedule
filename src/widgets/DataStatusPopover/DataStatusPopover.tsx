import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import useOffline from "@/shared/hooks/useOffline.ts"
import RowPopover from "@/shared/ui/RowPopover"
import { memo, type ReactNode } from "react"
import clsx from "clsx"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { format } from "date-fns"
import InfoIcon from "@/shared/assets/icons/info.svg?react"
import CheckIcon from "@/shared/assets/icons/rounded-check.svg?react"
import { useTranslation } from "react-i18next"
import "./DataStatusPopover.scss"
import BookMarkPopover from "@/shared/ui/BookMarkPopover"
import { Spinner } from "@/shared/ui"

type ScheduleDataErrorPopoverProps = {
  className: string
  isReversed?: boolean
  type: "row" | "bookmark"
}

const DataStatusPopover = memo(
  ({ className, isReversed, type }: ScheduleDataErrorPopoverProps) => {
    const { t } = useTranslation()

    const { isOffline } = useOffline()
    const { isError, profile, isLoading } = useScheduleData()

    const isSomethingWrong = isOffline || isError

    let title: string

    if (isSomethingWrong) {
      if (isOffline) {
        title = STRINGS_RES.offline_mode
      } else {
        title = STRINGS_RES.data_update_error
      }
    } else {
      title = STRINGS_RES.schedule_is_current
    }

    const toggler: ReactNode = isSomethingWrong ? (
      <InfoIcon />
    ) : isLoading ? (
      <Spinner className={"data-status-popover-spinner"} />
    ) : (
      <CheckIcon />
    )

    let content: ReactNode

    if (isSomethingWrong) {
      if (profile.lastUpdateAt) {
        content = (
          <>
            {t(STRINGS_RES.last_update_at)}{" "}
            <time dateTime={"YYYY-MM-DD HH:MM"}>
              {format(profile.lastUpdateAt, "yyyy-MM-dd HH:mm")}
            </time>
          </>
        )
      } else {
        content = t(STRINGS_RES.profile_has_not_updated_previously)
      }
    } else if (isLoading) {
      content = "Загрузка"
    }

    const classes = clsx(
      className,
      "data-status-popover",
      isSomethingWrong
        ? "data-status-popover--error"
        : "data-status-popover--success"
    )

    return type === "row" ? (
      <RowPopover
        className={classes}
        togglerContent={toggler}
        isReversed={isReversed}
        titleI18nKey={title}
      >
        {content}
      </RowPopover>
    ) : (
      <BookMarkPopover
        className={classes}
        togglerContent={toggler}
        titleI18nKey={title}
      >
        {content}
      </BookMarkPopover>
    )
  }
)

export default DataStatusPopover
