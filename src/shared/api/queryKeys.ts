import "@tanstack/react-query"

type QueryKey = [
  "institutes" | "teachers" | "schedule",
  ...ReadonlyArray<unknown>,
]

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey
    mutationKey: QueryKey
  }
}
