export class LocalStorageManager {
  static get<T>(key: string): T | null {
    const dataString = localStorage.getItem(key)
    if (dataString === null) {
      return null
    }

    if ((dataString as T) !== undefined) {
      return dataString as T
    }

    const data = { ...JSON.parse(dataString) }
    if ((data as T) !== undefined) {
      return data
    }
    return null
  }

  static set<T>(key: string, value: T) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      localStorage.setItem(key, value.toString())
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  }
}
