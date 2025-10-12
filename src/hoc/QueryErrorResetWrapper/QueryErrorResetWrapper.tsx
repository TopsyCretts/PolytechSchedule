import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import RetryFallback from "@components/RetryFallback"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import clsx from "clsx"

interface ResetProps {
  fallbackClassName?: string
  children: React.ReactNode
  onReset?: () => void
}

const QueryErrorResetWrapper = ({
  fallbackClassName,
  children,
  onReset,
}: ResetProps) => {
  const handleOnReset = (callBack: () => void) => {
    onReset?.()
    callBack()
  }

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }: FallbackProps) => (
            <RetryFallback
              className={clsx(fallbackClassName)}
              onRetry={() => {
                handleOnReset(resetErrorBoundary)
              }}
            />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default QueryErrorResetWrapper
