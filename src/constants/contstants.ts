import type { ThemeObject } from "@/domain/types/Theme.ts"
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

const PROFILES_KEY = "schedule-profiles"

const ORIGINAL_SITE = {
  hostname: "ypolytech.ru",
  link: "https://ypolytech.ru",
} as const

export {
  themeArray,
  PROFILES_KEY,
  LANGUAGES_MAP,
  LANGUAGES_KEYS,
  LANGUAGE_SELECTABLE_VALUES,
  ORIGINAL_SITE,
}
