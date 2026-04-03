import type { Plugin } from "vite"

interface Options {
  /** ID счетчика или имя env переменной */
  id?: number | string
  /** Имя переменной окружения (default: VITE_YANDEX_METRIKA_ID) */
  envVariable?: string
  /** Включить только в production? */
  productionOnly?: boolean
}

function viteYandexCounterPlugin(options: Options = {}): Plugin {
  const {
    id,
    envVariable = "VITE_YANDEX_METRIKA_ID",
    productionOnly = true,
  } = options

  let resolvedId: string | undefined

  return {
    name: "vite-plugin-yandex-metrika",

    // Важно: configResolved срабатывает ДО transformIndexHtml
    configResolved(config) {
      // 1. Сначала пробуем получить ID из параметров плагина
      if (id) {
        resolvedId = String(id)
        return
      }

      // 2. Если ID не передан, ищем в env переменных
      // process.env не работает в Vite, используем config.env
      const envValue = config.env[envVariable] || process.env[envVariable]

      if (envValue) {
        resolvedId = envValue
      } else {
        console.warn(
          `Yandex.Metrika: ID not found in env variable "${envVariable}". ` +
            `Check your .env.${config.mode} file`
        )
        resolvedId = undefined
      }

      // Проверяем режим
      if (productionOnly && config.mode === "development") {
        console.log("Yandex.Metrika: disabled in development mode")
      }
    },

    transformIndexHtml(html) {
      // Проверяем условия
      if (!resolvedId) {
        console.warn("Yandex.Metrika: skipping - ID is undefined")
        return html
      }

      if (productionOnly && process.env.NODE_ENV === "development") {
        return html
      }

      const code = `
      <!-- Yandex.Metrika -->
       <script type="text/javascript">
    ;(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })
    (window, document,"script","https://mc.yandex.ru/metrika/tag.js?id=${resolvedId}", "ym")
    ym(${resolvedId}, "init", {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
      </script>
      <noscript><div><img src=https://mc.yandex.ru/watch/${resolvedId}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
      <!-- /Yandex.Metrika -->`

      return html.replace("</head>", `${code}\n</head>`)
    },
  }
}

export default viteYandexCounterPlugin
