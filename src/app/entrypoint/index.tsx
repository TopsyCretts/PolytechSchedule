import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import "../../i18n.ts"
import { ThemeProvider } from "@/hoc"
import { QueryClientProvider } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { Provider } from "inversify-react"
import { queryClient } from "@shared/api"
import WebLoaderIndicator from "@shared/ui/WebLoaderIndicator/WebLoaderIndicator.tsx"
import AppRouter from "../routes/router.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<h1>Something goes wrong!</h1>}>
      <Suspense fallback={<WebLoaderIndicator />}>
        <QueryClientProvider client={queryClient}>
          <Provider container={mainContainer}>
            <ThemeProvider>
              <AppRouter />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
)
