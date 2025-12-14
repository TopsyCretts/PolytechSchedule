import DefaultLight from "@assets/icons/default-institute.svg?react"
import ArchitectureLight from "@assets/icons/architecture-institute.svg?react"
import ChemicalLight from "@assets/icons/chem-fac.svg?react"
import CorrespondenceLight from "@assets/icons/correspondence.svg?react"
import CivilLight from "@assets/icons/civil-transport-institute.svg?react"
import MagicLight from "@assets/icons/magic-games-institute.svg?react"
import EconomicLight from "@assets/icons/economics-management-institute.svg?react"
import DigitalLight from "@assets/icons/digital-institute.svg?react"
import CollageLight from "@assets/icons/collage.svg?react"
import type { InstituteType } from "@/entities/Institute.ts"

interface InstituteIconProps {
  className?: string
  instituteType?: InstituteType
  width?: number
  height?: number
}
const iconMap = {
  default: DefaultLight,
  architecture: ArchitectureLight,
  chemical: ChemicalLight,
  correspondence: CorrespondenceLight,
  civil: CivilLight,
  magic: MagicLight,
  economic: EconomicLight,
  digital: DigitalLight,
  collage: CollageLight,
} as const

const InstituteIcon = ({
  className,
  instituteType = "default",
}: InstituteIconProps) => {
  const IconComponent = iconMap[instituteType] || iconMap.default
  return <IconComponent className={className} />
}

export default InstituteIcon
