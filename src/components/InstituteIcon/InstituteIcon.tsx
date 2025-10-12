import clsx from "clsx"
import type { InstituteType } from "@/domain/models/Institute.ts"
import { themedInstituteIcons } from "@/constants/contstants.ts"
import { useTheme } from "@/domain/hooks"

interface InstituteIconProps {
  className?: string
  instituteType?: InstituteType
  width?: number
  height?: number
}

const InstituteIcon = ({
  className,
  instituteType = "default",
  height,
  width,
}: InstituteIconProps) => {
  const { isDark } = useTheme()
  return (
    <img
      className={clsx(className)}
      alt=""
      src={getInstituteIcon(instituteType, isDark)}
      width={width}
      height={height}
      loading="lazy"
    />
  )
}

const getInstituteIcon = (institute: InstituteType, isDarkTheme: boolean) => {
  const icon = themedInstituteIcons[institute]
  return isDarkTheme ? icon.lightSrc : icon.darkSrc
}

export default InstituteIcon
