export const isEnterKeyPressed = (
  e: React.KeyboardEvent,
  onEnterClick: () => void
) => {
  if (e.key === "Enter") {
    onEnterClick()
    return true
  }
  return false
}
