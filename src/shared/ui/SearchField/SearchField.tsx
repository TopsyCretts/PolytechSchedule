import "./SearchField.scss"
import clsx from "clsx"
import SearchIcon from "@/shared/assets/icons/search.svg?react"
import type { SearchFieldProps } from "@/shared/models/Search.ts"
import { type ChangeEvent, useState } from "react"
import { IconButton } from "@/shared/ui"

const SearchField = ({
  className,
  id,
  label,
  name,
  placeholder,
  initialValue = "",
  inputHidden,
  onValueChange,
}: SearchFieldProps) => {
  const [localValue, setLocalValue] = useState(initialValue)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLocalValue(value)
    onValueChange?.(value)
  }

  const handleClear = () => {
    setLocalValue("")
    onValueChange?.("")
  }

  return (
    <div className={clsx(className, "search-field")}>
      <label
        className="search-field__label"
        htmlFor={id}
      >
        {label}
      </label>
      <div
        className={clsx("search-field__body", inputHidden && "visually-hidden")}
      >
        <SearchIcon className="search-field__icon" />
        <input
          className="search-field__input"
          id={id}
          name={name}
          autoComplete="off"
          placeholder={placeholder}
          readOnly={inputHidden}
          value={localValue}
          onChange={handleChange}
        />
        {localValue && (
          <IconButton
            className={"search-field__cross"}
            onClick={handleClear}
            iconType={"cross"}
          />
        )}
      </div>
    </div>
  )
}

export default SearchField
