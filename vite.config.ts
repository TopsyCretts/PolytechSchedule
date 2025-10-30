import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import react from "@vitejs/plugin-react"
import path from "path"
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa"

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  injectRegister: "script-defer",
  registerType: "autoUpdate",
  strategies: "generateSW",
  srcDir: "src",
  includeAssets: ["images/*"],
  workbox: {
    globPatterns: [
      "**/*.{ts,tsx,css,html,ico,png,svg,woff2}",
      "**/*-*.js", // Для chunks с хешами в названии (например: component-abc123.js)
    ],
    maximumFileSizeToCacheInBytes: 3000000,
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,

    // Специальные настройки для API расписания
    runtimeCaching: [
      {
        // Кэшируем JS chunks с CacheFirst стратегией
        urlPattern: /\.js$/,
        handler: "CacheFirst",
        options: {
          cacheName: "js-chunks-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год (chunks не меняются)
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // API расписания - кэшируем надолго т.к. расписание меняется редко
        urlPattern: /^https:\/\/gg-api\.ystuty\.ru\/api\/schedule\/v1\/.*/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "schedule-api-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 10 * 24 * 60 * 60, // 240 часа
          },
          cacheableResponse: {
            statuses: [0, 200], // Кэшируем даже если CORS ошибки (status 0)
          },
        },
      },
      {
        // Изображения и медиа
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "images-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
          },
        },
      },
    ],
  },
  manifest: {
    name: "Политех",
    short_name: "Политех",
    description: "Узнавай расписание пар и радуйся жизни",
    icons: [
      {
        src: "/images/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/pwa-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/images/screenshot-desktop.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/images/screenshot-mobile.png",
        sizes: "375x670",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
  },
  devOptions: {
    enabled: false, // Включаем PWA в development
    type: "classic",
  },
}

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
    VitePWA(pwaOptions),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@hooks": path.resolve(__dirname, "./src/domain/hooks"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  server: {
    port: 3000,
  },
})
