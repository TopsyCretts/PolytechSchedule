import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../../i18n.ts"
import { QueryClientProvider } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { mainContainer } from "@/app/store/mainContainer.ts"
import { Provider } from "inversify-react"
import { queryClient } from "@/shared/api"
import AppRouter from "../routes/router.tsx"
import { OfflineProvider, ThemeProvider } from "@/shared/models/providers"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<h1>Something goes wrong!</h1>}>
      <OfflineProvider>
        <QueryClientProvider client={queryClient}>
          <Provider container={mainContainer}>
            <ThemeProvider>
              <AppRouter />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </OfflineProvider>
    </ErrorBoundary>
  </StrictMode>
)
