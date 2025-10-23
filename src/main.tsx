import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./i18n.ts"
import { ThemeProvider } from "@/hoc"
import { QueryClientProvider } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { mainContainer } from "@/mainContainer.ts"
import { Provider } from "inversify-react"
import { queryClient } from "@/api"
import WebLoaderIndicator from "@shared/ui/WebLoaderIndicator/WebLoaderIndicator.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<h1>Something goes wrong!</h1>}>
      <Suspense fallback={<WebLoaderIndicator />}>
        <QueryClientProvider client={queryClient}>
          <Provider container={mainContainer}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
)
