import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./i18n.ts"
import { ThemeProvider } from "@/hoc"
import { SearchScheduleProvider } from "@/hoc/SearchScheduleProvider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Spinner from "@components/Spinner"
import { ErrorBoundary } from "react-error-boundary"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<h1>Something goes wrong!</h1>}>
      <Suspense fallback={<Spinner />}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SearchScheduleProvider>
              <App />
            </SearchScheduleProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
)
