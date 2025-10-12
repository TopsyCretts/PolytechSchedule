import "@tanstack/react-query"

type QueryKey = ["institutes" | "teachers", ...ReadonlyArray<unknown>]

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey
    mutationKey: QueryKey
  }
}
