import useScheduleData from "@/pages/schedule-calendar/lib/useScheduleData.ts"
import useOffline from "@shared/lib/useOffline.ts"
import RowPopover from "@shared/ui/RowPopover"
import { memo } from "react"
import clsx from "clsx"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import { format } from "date-fns"
import InfoIcon from "@/assets/icons/info.svg?react"
import CheckIcon from "@/assets/icons/rounded-check.svg?react"
import { useTranslation } from "react-i18next"
import "./DataStatusPopover.scss"
import { PROGRESS_STATUS } from "@shared/models/DataStatus.ts"

type ScheduleDataErrorPopoverProps = {
  className: string
  isReversed?: boolean
}

const DataStatusPopover = memo(
  ({ className, isReversed }: ScheduleDataErrorPopoverProps) => {
    const { t } = useTranslation()

    const { isOffline } = useOffline()
    const { status, profile } = useScheduleData()

    const isSomethingWrong = isOffline || status === PROGRESS_STATUS.error

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

    return status !== PROGRESS_STATUS.success && !isSomethingWrong ? null : (
      <RowPopover
        className={clsx(
          className,
          "data-status-popover",
          isSomethingWrong
            ? "data-status-popover--error"
            : "data-status-popover--success"
        )}
        togglerContent={isSomethingWrong ? <InfoIcon /> : <CheckIcon />}
        isReversed={isReversed}
        titleI18nKey={title}
      >
        {isSomethingWrong &&
          (profile.lastUpdateAt ? (
            <>
              {t(STRINGS_RES.last_update_at)}{" "}
              <time dateTime={"YYYY-MM-DD HH:MM"}>
                {format(profile.lastUpdateAt, "yyyy-MM-dd HH:mm")}
              </time>
            </>
          ) : (
            // t(STRINGS_RES.profile_has_not_updated_previously)
            <>
              {t(STRINGS_RES.last_update_at)}{" "}
              <time dateTime={"YYYY-MM-DD HH:MM"}>
                {format(Date.now(), "yyyy-MM-dd HH:mm")}
              </time>
            </>
          ))}
      </RowPopover>
    )
  }
)

export default DataStatusPopover
