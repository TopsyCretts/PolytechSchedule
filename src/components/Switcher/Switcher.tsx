import "./Switcher.scss"
import clsx from "clsx"
import type {
  SwitcherItemProps,
  SwitcherProps,
} from "@components/Switcher/types"

const Switcher = ({
  className,
  items,
  currentItem,
  onItemChange,
}: SwitcherProps) => {
  return (
    <div className={clsx(className, "switcher")}>
      <div className="switcher__body">
        <ul className="switcher__list">
          {items.map((item) => (
            <SwitcherItem
              key={item.value}
              item={item}
              isSelected={currentItem.value === item.value}
              onClick={onItemChange}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const SwitcherItem = ({ item, isSelected, onClick }: SwitcherItemProps) => {
  return (
    <li
      className={clsx(
        "switcher__item",
        isSelected && "switcher__item--selected"
      )}
    >
      <button
        className={clsx("switcher__button")}
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onClick(item)
        }}
      >
        {item.label}
      </button>
    </li>
  )
}

export default Switcher
