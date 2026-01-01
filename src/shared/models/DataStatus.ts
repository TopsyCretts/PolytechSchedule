const PROGRESS_STATUS = {
  init: "init",
  loading: "loading",
  success: "success",
  error: "error",
} as const

type ProgressStatus = keyof typeof PROGRESS_STATUS

type DataStatus<T> = {
  status: ProgressStatus
  data: T
}

export type { ProgressStatus, DataStatus }

export { PROGRESS_STATUS }
