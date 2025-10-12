import type { SearchListProps } from "@/domain/types/Search.ts"
import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"
import SearchItemWithType from "@components/SearchItem/SearchItemWithType.tsx"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/constants/strings.ts"

const SearchList = ({ items, selectedItem, onItemClick }: SearchListProps) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {selectedItem === null && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <ul className={clsx("search-select__list")}>
            <AnimatePresence mode={"popLayout"}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  className="search-select__list-item"
                  layout
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <SearchItemWithType
                    title={item.searchableValue}
                    trailingButtonType="right-arrow"
                    onClick={() => {
                      onItemClick(item)
                    }}
                    type={item.type}
                  />
                </motion.li>
              ))}
              {items.length === 0 && (
                <motion.li
                  key={"search-select__empty-result"}
                  className={"search-select__empty-result"}
                  initial={{
                    opacity: 0,
                    transition: { delay: 0.2, duration: 0.4 },
                  }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: "easeInOut" }}
                >
                  {t(STRINGS_RES.nothing_was_found)}
                </motion.li>
              )}
            </AnimatePresence>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchList
