import type { ThemeObject } from "@/domain/types/Theme.ts"
import { STRINGS_RES } from "@/constants/strings.ts"
import type { Locale } from "date-fns"
import { enUS, fr, ru } from "date-fns/locale"
import type { LessonType } from "@/pages/schedule/model/ScheduleData.ts"

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

const LANGUAGES_MAP: Record<string, { nativeName: string; locale: Locale }> = {
  en: { nativeName: "English", locale: enUS },
  ru: { nativeName: "Русский", locale: ru },
  fr: { nativeName: "Français", locale: fr },
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

const LESSONS_MAP: Record<
  LessonType,
  { lessonCardHeaderColor: string; nameI18nkey: string }
> = {
  lecture: {
    lessonCardHeaderColor: "var(--color-green)",
    nameI18nkey: STRINGS_RES.lecture,
  },
  practical: {
    lessonCardHeaderColor: "var(--color-orange)",
    nameI18nkey: STRINGS_RES.practice,
  },
  laboratory: {
    lessonCardHeaderColor: "var(--color-blue)",
    nameI18nkey: STRINGS_RES.laboratory,
  },
  exam: {
    lessonCardHeaderColor: "var(--color-red)",
    nameI18nkey: STRINGS_RES.exam,
  },
  unknown: {
    lessonCardHeaderColor: "var(--color-text-themed)",
    nameI18nkey: "",
  },
} as const

const CALENDAR_SPECIAL_MONTH_FORMAT = "MMMM-yyyy" as const

export {
  themeArray,
  PROFILES_KEY,
  LANGUAGES_MAP,
  LANGUAGES_KEYS,
  LANGUAGE_SELECTABLE_VALUES,
  ORIGINAL_SITE,
  LESSONS_MAP,
  CALENDAR_SPECIAL_MONTH_FORMAT,
}
