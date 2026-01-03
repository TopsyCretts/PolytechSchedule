import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import react from "@vitejs/plugin-react"
import path from "path"
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa"
import viteYandexCounterPlugin from "./src/vite-yandex-counter-plugin.ts"

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  injectRegister: "script",
  registerType: "autoUpdate",
  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.ts",
  includeAssets: ["images/*", "locales/*"],
  injectManifest: {
    globPatterns: ["**/*.{js,ts,json,tsx,css,html,ico,png,svg,woff2}"],
    maximumFileSizeToCacheInBytes: 3000000,
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
    enabled: true, // Включаем PWA в development
    type: "module",
    navigateFallback: "index.html",
  },
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
      VitePWA(pwaOptions),
      viteYandexCounterPlugin({
        productionOnly: process.env.VITE_APP_ENV !== "development",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      postcss: "./postcss.config.cjs",
    },
    server: {
      port: 3000,
    },
  }
})
