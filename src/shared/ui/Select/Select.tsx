import "./Select.scss"
import clsx from "clsx"
import { Button } from "@/shared/ui"
import SelectorArrowsIcon from "@/assets/icons/selector-arrows.svg?react"
import type {
  SelectButtonTogglerProps,
  SelectContainerProps,
  SelectGroupProps,
  SelectHeaderProps,
  SelectListProps,
  SelectOptionProps,
  SelectProps,
  SelectStringTogglerProps,
  SelectValues,
} from "./types"
import { createContext, useCallback, useContext, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import CrossIcon from "@/assets/icons/cross.svg?react"
import { useTranslation } from "react-i18next"
import { STRINGS_RES } from "@/shared/constants/strings.ts"
import { isEnterKeyPressed } from "@/shared/lib/isEnterKeyPressed.ts"

const SelectContext = createContext<SelectValues | null>(null)

const Select = ({ className, children }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const memoizedContextValues: SelectValues = {
    isOpen,
    toggle: () => setIsOpen((prev) => !prev),
  }

  return (
    <SelectContext.Provider value={memoizedContextValues}>
      <div className={clsx(className, "select")}>{children}</div>
    </SelectContext.Provider>
  )
}

function useSelect() {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error("This component must be used within a <Select> component.")
  }

  return context
}

const ButtonToggler = ({
  className,
  children,
  onClick,
  title,
  ...props
}: SelectButtonTogglerProps) => {
  const { t } = useTranslation()

  const { toggle, isOpen } = useSelect()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    toggle()
    onClick?.(event)
  }

  return (
    <Button
      className={clsx(className, "select__button-toggler")}
      onClick={handleClick}
      title={!isOpen ? title : t(STRINGS_RES.close)}
      {...props}
    >
      {!isOpen ? children : <CrossIcon />}
    </Button>
  )
}

const StingToggler = ({ className, children }: SelectStringTogglerProps) => {
  const { toggle } = useSelect()
  return (
    <button
      className={clsx(className, "select__sting-toggler string-toggler")}
      onClick={toggle}
    >
      <div className="string-toggler__title">{children}</div>
      <SelectorArrowsIcon className="string-toggler__arrows" />
    </button>
  )
}

const BackDrop = () => {
  const { toggle, isOpen } = useSelect()
  return (
    isOpen && (
      <div
        className="select__backdrop backdrop"
        onClick={(event) => {
          event.stopPropagation()
          toggle()
        }}
      />
    )
  )
}

const Container = ({
  children,
  width = "12.5rem",
  ref,
}: SelectContainerProps) => {
  const { isOpen } = useSelect()
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          className="select__wrapper"
          initial={{ height: 0, width: 0, opacity: 0.5 }}
          animate={{ height: "auto", width: width, opacity: 1 }}
          exit={{ height: 0, width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Header = ({ children }: SelectHeaderProps) => {
  const { t } = useTranslation()
  const { toggle } = useSelect()

  return (
    <div className="select__header">
      <span className="select__title text-16 bold">{children}</span>
      <Button
        className={"select__cross"}
        onClick={toggle}
        title={t(STRINGS_RES.close)}
        shape={"square"}
      >
        {<CrossIcon />}
      </Button>
    </div>
  )
}

const Option = ({
  className,
  optionKey,
  children,
  numerated,
  isSelected,
  onOptionClick,
}: SelectOptionProps) => {
  const handleOptionClick = () => {
    if (!isSelected) {
      onOptionClick?.(optionKey)
    }
  }
  return (
    <li
      className={clsx(
        className,
        "select__item",
        numerated && "select__item--numerated",
        isSelected && "select__item--selected"
      )}
      id={optionKey}
      tabIndex={0}
      onKeyDown={(e) => {
        isEnterKeyPressed(e, handleOptionClick)
      }}
      onClick={(event) => {
        event.stopPropagation()
        handleOptionClick()
      }}
    >
      {children}
    </li>
  )
}

const Options = ({
  values,
  numerated,
  initialSelectedOptionsKeys = [],
  multiSelection = false,
  onOptionChange,
  onMultipleChange,
}: SelectListProps) => {
  const { toggle } = useSelect()
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialSelectedOptionsKeys
  )

  const handleOptionClick = useCallback(
    (value: string) => {
      if (!multiSelection) {
        onOptionChange?.(value)
        setSelectedOptions([value])
        toggle()
        return
      }
      const optionIndex = selectedOptions.findIndex((item) => item === value)
      let prevSelectedOptions = [...selectedOptions]
      if (optionIndex !== -1) {
        prevSelectedOptions = [
          ...prevSelectedOptions.filter((_, i) => i !== optionIndex),
        ]
      } else {
        prevSelectedOptions.push(value)
      }
      onMultipleChange?.(prevSelectedOptions)
      setSelectedOptions(prevSelectedOptions)
    },
    [multiSelection, selectedOptions]
  )

  return (
    <ul className="select__list">
      {values.map((option) => (
        <Option
          key={option.key}
          numerated={numerated}
          optionKey={option.key}
          onOptionClick={handleOptionClick}
          isSelected={selectedOptions.includes(option.key)}
        >
          {option.value}
        </Option>
      ))}
    </ul>
  )
}

const OptionGroup = ({ title, ...props }: SelectGroupProps) => {
  useSelect()
  return (
    <div className="select__group">
      <h3 className={"select__group-title text-16 bold"}>{title}</h3>
      <Options {...props} />
    </div>
  )
}

Select.Container = Container
Select.Options = Options
Select.OptionsGroup = OptionGroup
Select.Header = Header
Select.Backdrop = BackDrop
Select.ButtonToggler = ButtonToggler
Select.StringToggler = StingToggler

export { Select, SelectContext }
