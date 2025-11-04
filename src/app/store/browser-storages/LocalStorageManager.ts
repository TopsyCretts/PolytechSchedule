import type { InstitutesData } from "@/domain/models/Institute.ts"
import type { TeachersData } from "@/domain/models/Teachers.ts"

export class LocalStorageManager {
  static async getInstitutesData(): Promise<InstitutesData | null> {
    const dataString = localStorage.getItem("institutes")
    if (dataString === null) {
      return null
    }

    const data = { ...JSON.parse(dataString) }

    if ((data as InstitutesData) === undefined) {
      return null
    }
    return data
  }

  static get<T>(key: string): T | null {
    const dataString = localStorage.getItem(key)
    if (dataString === null) {
      return null
    }
    const data = { ...JSON.parse(dataString) }
    if ((data as T) !== undefined) {
      return data
    }
    return null
  }

  static set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static saveInstitutesData(data: InstitutesData) {
    localStorage.setItem("institutes", JSON.stringify(data))
  }

  static async getTeachersData(): Promise<TeachersData | null> {
    const dataString = localStorage.getItem("teachers")
    if (dataString === null) {
      return null
    }

    const data = { ...JSON.parse(dataString) }

    if ((data as TeachersData) === undefined) {
      return null
    }
    return data
  }

  static saveTeachersData(data: TeachersData) {
    localStorage.setItem("teachers", JSON.stringify(data))
  }
}
