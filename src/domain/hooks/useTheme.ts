import { useContext } from "react"
import { ThemeContext } from "@/hoc/ThemeProvider.tsx"

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
