import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { type PropsWithChildren, Suspense, type ReactNode } from "react"

type QueryResetSuspenseBoundaryProps = PropsWithChildren<{
  retryFallback: (props: FallbackProps) => ReactNode
  loader: ReactNode
}>

const QueryResetSuspenseBoundary = ({
  retryFallback,
  loader,
  children,
}: QueryResetSuspenseBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={retryFallback}
        >
          <Suspense fallback={loader}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export { QueryResetSuspenseBoundary }
