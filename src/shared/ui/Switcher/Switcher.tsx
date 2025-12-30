import "./Switcher.scss"
import clsx from "clsx"
import type {
  SwitcherItemProps,
  SwitcherProps,
} from "@/shared/ui/Switcher/types"

const Switcher = <T extends string>({
  className,
  items,
  currentItem,
  onItemChange,
}: SwitcherProps<T>) => {
  return (
    <div
      className={clsx(className, "switcher")}
      role={"switch"}
    >
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

const SwitcherItem = <T extends string>({
  item,
  isSelected,
  onClick,
}: SwitcherItemProps<T>) => {
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
