import { computed, makeAutoObservable, observable, runInAction } from "mobx"
import {
  type DefaultError,
  type QueryClient,
  type QueryKey,
  QueryObserver,
  type QueryObserverOptions,
  type QueryObserverResult,
} from "@tanstack/react-query"

class MobXQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  @observable private currentResult: QueryObserverResult<TData, TError> | null =
    null

  private queryObserver: QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >

  constructor(
    private getOptions: () => QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >,
    private queryClient: QueryClient
  ) {
    makeAutoObservable(this)
    this.queryObserver = new QueryObserver(
      this.queryClient,
      this.defaultQueryOptions
    )
    this.queryObserver.subscribe((result) => {
      runInAction(() => (this.currentResult = result))
    })
  }

  @computed
  get result() {
    return (
      this.currentResult ??
      this.queryObserver.getOptimisticResult(this.defaultQueryOptions)
    )
  }

  @computed
  get data(): TData | undefined {
    return this.result?.data
  }

  @computed
  get suspendedData() {
    const data = this.result?.data
    if (!data) {
      if (this.result?.error) {
        throw this.result.error
      }
      throw this.queryObserver.fetchOptimistic(this.defaultQueryOptions)
    }

    return data
  }

  @computed
  get isLoading() {
    return this.result.isPending
  }

  async resetError() {
    const queryKey = this.defaultQueryOptions.queryKey
    await this.queryClient.resetQueries({ queryKey, exact: true })
  }

  private get defaultQueryOptions() {
    return this.queryClient.defaultQueryOptions(this.getOptions())
  }
}

export default MobXQuery
