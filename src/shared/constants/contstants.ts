import type { ThemeObject } from "@shared/models/Theme.ts"
import { STRINGS_RES } from "@shared/constants/strings.ts"
import type { Locale } from "date-fns"
import { enUS, fr, ru } from "date-fns/locale"
import type { LessonType } from "@/entities/ScheduleData.ts"

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

const DB_NAME = "schedule-db"
const DB_VERSION = 3

const LOCAL_STORAGE_KEY = {
  theme: "theme",
  institutesLastUpdate: "institutes-last-update",
  teachersLastUpdate: "teachers-last-update",
  lastProfileId: "last-profile-id",
} as const

const SESSION_STORAGE_KEY = {
  isLastProfileInitiated: "is-last-profile-init",
} as const

export {
  themeArray,
  LANGUAGES_MAP,
  LANGUAGES_KEYS,
  LANGUAGE_SELECTABLE_VALUES,
  ORIGINAL_SITE,
  LESSONS_MAP,
  CALENDAR_SPECIAL_MONTH_FORMAT,
  DB_NAME,
  DB_VERSION,
  LOCAL_STORAGE_KEY,
  SESSION_STORAGE_KEY,
}
