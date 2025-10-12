interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SITE_URL: string
  readonly VITE_PUBLIC_VAPID_KEY: string
  readonly VITE_APP_ENV: "development" | "production"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
