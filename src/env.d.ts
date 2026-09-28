interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SITE_URL: string
  readonly VITE_APP_ENV: "development" | "staging" | "production" | "gh-pages"
  readonly VITE_YANDEX_METRIKA_ID: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
