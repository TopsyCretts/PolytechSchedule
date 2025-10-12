import "./SearchItem.scss"
import clsx from "clsx"
import IconButton from "@components/IconButton"
import type { SearchItemCoreProps } from "@components/SearchItem/types.ts"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"

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
      onClick={handleClick}
    >
      <div className="search-item__heading">{headingChildren}</div>
      <div className="search-item__title">{title}</div>
      <IconButton
        className={clsx(
          "search-item__trailing-icon",
          trailingButtonType === "cross" && "search-item__trailing-icon--cross"
        )}
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
