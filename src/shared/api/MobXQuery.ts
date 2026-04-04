import { computed, createAtom, makeAutoObservable, reaction } from "mobx"
import {
  type DefaultError,
  type QueryClient,
  type QueryKey,
  QueryObserver,
  type QueryObserverOptions,
} from "@tanstack/react-query"

class MobXQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  private atom = createAtom(
    "MobXQuery",
    () => this.startTracking(),
    () => this.stopTracking()
  )

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
  }

  get result() {
    this.atom.reportObserved()
    this.setDefaultQueryOptionsToQueryObserver()
    return this.queryObserver.getOptimisticResult(this.defaultQueryOptions)
  }

  @computed
  get data(): TData | undefined {
    return this.result?.data
  }

  @computed
  get suspendedData() {
    if (!this.result?.data) {
      if (this.result?.error) {
        throw this.result.error
      }
      throw this.queryObserver.fetchOptimistic(this.defaultQueryOptions)
    }

    return this.result.data
  }

  @computed
  isLoading() {
    return this.result.isPending
  }

  private unsubscribe = () => {}

  private startTracking() {
    const unsubscribeReaction = reaction(
      () => this.defaultQueryOptions,
      () => {
        this.setDefaultQueryOptionsToQueryObserver()
      }
    )

    const unsubscribeObserver = this.queryObserver.subscribe(() => {
      this.atom.reportChanged()
    })

    this.unsubscribe = () => {
      unsubscribeReaction()
      unsubscribeObserver()
    }
  }

  private stopTracking() {
    this.unsubscribe()
  }

  private setDefaultQueryOptionsToQueryObserver() {
    this.queryObserver.setOptions(this.defaultQueryOptions)
  }

  private get defaultQueryOptions() {
    return this.queryClient.defaultQueryOptions(this.getOptions())
  }
}

export default MobXQuery
