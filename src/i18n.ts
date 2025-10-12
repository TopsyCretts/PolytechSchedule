import i18next from "i18next"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

await i18next
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: localStorage.getItem("i18nextLng") || "ru",
    supportedLngs: ["en", "ru", "fr"],
    fallbackLng: "ru",
    preload: ["en", "ru", "fr"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })
