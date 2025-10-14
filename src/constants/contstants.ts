import type { ThemeObject } from "@/domain/types/Theme.ts"
import defaultLight from "@assets/icons/default-institute.svg"
import defaultDark from "@assets/icons/default-institute-dark.svg"
import architectureLight from "@assets/icons/architecture-institute.svg"
import architectureDark from "@assets/icons/architecture-institute-dark.svg"
import chemicalLight from "@assets/icons/chem-fac.svg"
import chemicalDark from "@assets/icons/chem-fac-dark.svg"
import correspondenceLight from "@assets/icons/correspondence.svg"
import correspondenceDark from "@assets/icons/correspondence-dark.svg"
import civilLight from "@assets/icons/civil-transport-institute.svg"
import civilDark from "@assets/icons/civil-transport-institute-dark.svg"
import magicLight from "@assets/icons/magic-games-institute.svg"
import magicDark from "@assets/icons/magic-games-institute-dark.svg"
import economicLight from "@assets/icons/economics-management-institute.svg"
import economicDark from "@assets/icons/economics-management-institute-dark.svg"
import digitalLight from "@assets/icons/digital-institute.svg"
import digitalDark from "@assets/icons/digital-institute-dark.svg"
import collageLight from "@assets/icons/collage.svg"
import collageDark from "@assets/icons/collage-dark.svg"
import type { InstituteType } from "@/domain/models/Institute.ts"
import type { SearchableState } from "@/domain/types/Search.ts"
import type { StudentProfile, TeacherProfile } from "@/domain/models/Profile.ts"
import { STRINGS_RES } from "@/constants/strings.ts"

const themeArray: ThemeObject[] = [
  {
    theme: "light",
    themeStringI18nKey: STRINGS_RES.theme_light,
  },
  {
    theme: "dark",
    themeStringI18nKey: STRINGS_RES.theme_dark,
  },
] as const

const themedInstituteIcons: Record<
  InstituteType,
  { darkSrc: string; lightSrc: string }
> = {
  default: {
    darkSrc: defaultDark,
    lightSrc: defaultLight,
  },
  architecture: { darkSrc: architectureDark, lightSrc: architectureLight },
  chemical: { darkSrc: chemicalDark, lightSrc: chemicalLight },
  correspondence: {
    darkSrc: correspondenceDark,
    lightSrc: correspondenceLight,
  },
  civil: {
    darkSrc: civilDark,
    lightSrc: civilLight,
  },
  magic: {
    darkSrc: magicDark,
    lightSrc: magicLight,
  },
  economic: {
    darkSrc: economicDark,
    lightSrc: economicLight,
  },
  digital: {
    darkSrc: digitalDark,
    lightSrc: digitalLight,
  },
  collage: {
    darkSrc: collageDark,
    lightSrc: collageLight,
  },
}

const LANGUAGES_MAP: Record<string, { nativeName: string }> = {
  en: { nativeName: "English" },
  ru: { nativeName: "Русский" },
  fr: { nativeName: "Français" },
} as const

const LANGUAGES_KEYS = [...Object.keys(LANGUAGES_MAP)] as const

const LANGUAGE_SELECTABLE_VALUES = [
  ...LANGUAGES_KEYS.map((language) => {
    return {
      key: language,
      value: LANGUAGES_MAP[language].nativeName,
    }
  }),
] as const

const defaultSearchableState: SearchableState = {
  isError: false,
  isLoading: true,
  searchItems: [],
}

const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  id: "",
  name: "",
  scheduleType: "teacher",
  lastUsed: new Date(),
}

const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  id: "",
  name: "",
  scheduleType: "teacher",
  institute: "",
  lastUsed: new Date(),
}

const PROFILES_KEY = "schedule-profiles"

const ORIGINAL_SITE = {
  hostname: "ypolytech.ru",
  link: "https://ypolytech.ru",
}

export {
  themeArray,
  themedInstituteIcons,
  defaultSearchableState,
  PROFILES_KEY,
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_STUDENT_PROFILE,
  LANGUAGES_MAP,
  LANGUAGES_KEYS,
  LANGUAGE_SELECTABLE_VALUES,
  ORIGINAL_SITE,
}
