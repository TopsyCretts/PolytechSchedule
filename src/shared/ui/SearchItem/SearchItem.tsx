import "./SearchItem.scss"
import clsx from "clsx"
import { IconButton } from "@/shared/ui"
import type { SearchItemCoreProps } from "../SearchItem/types.ts"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { isEnterKeyPressed } from "@/shared/lib/isEnterKeyPressed.ts"

interface SearchItemProps extends SearchItemCoreProps {
  headingChildren?: React.ReactNode
}

const SearchItem = ({
  className,
  headingChildren = <></>,
  title,
  trailingButtonType,
  onClick,
}: SearchItemProps) => {
  const { t } = useTranslation()

  const handleClick = () => {
    onClick?.()
  }
  return (
    <div
      className={clsx(className, "search-item")}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        isEnterKeyPressed(e, handleClick)
      }}
    >
      <div className="search-item__heading">{headingChildren}</div>
      <div className="search-item__title">{title}</div>
      <IconButton
        className={clsx(
          "search-item__trailing-icon",
          trailingButtonType === "cross" && "search-item__trailing-icon--cross"
        )}
        tabIndex={-1}
        iconType={trailingButtonType}
        title={
          trailingButtonType === "right-arrow"
            ? t(STRINGS_RES.select)
            : t(STRINGS_RES.remove)
        }
        onClick={handleClick}
      />
    </div>
  )
}

export default SearchItem
