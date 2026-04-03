import js from "@eslint/js"
import globals from "globals"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import reactRefreshPlugin from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import { defineConfig, globalIgnores } from "eslint/config"

const ignores = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/*.log",
  "**/npm-debug.log*",
  "**/.git/**",
  "**/.idea/**",
  "**/.vscode/**",
  "**/.DS_Store",
]

export default defineConfig([
  globalIgnores(ignores),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettierConfig, // eslint-config-prettier уже совместим с flat config
    ],
    plugins: {
      // Объектный формат: имя плагина → объект плагина
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Правила Prettier как плагина
      ...prettierPlugin.configs.recommended.rules,

      // React Hooks (вручную, так как recommended-latest несовместим)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh
      "react-refresh/only-export-components": "warn",

      // Ваши кастомные правила
      "no-console": "warn",
      eqeqeq: "warn",
      curly: "warn",
      "no-else-return": "warn",
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
        project: false, // отключаем проверку типов для ускорения
      },
    },
  },
])
