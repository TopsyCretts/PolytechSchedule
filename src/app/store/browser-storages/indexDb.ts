import { type DBSchema, type IDBPDatabase, openDB } from "idb"
import type { InstituteData } from "@/domain/models/Institute.ts"
import type { TeacherData } from "@/domain/models/Teachers.ts"
import type { Profile } from "@/domain/models/Profile.ts"
import { DB_NAME, DB_VERSION } from "@shared/constants/contstants.ts"
import type { ScheduleData } from "@/pages/schedule/model/ScheduleData.ts"
import { type ScheduleDataDB } from "@/app/store/browser-storages/types.ts"

export const STORE_NAMES = {
  profiles: "profiles",
  schedules: "schedules",
  institutes: "institutes",
  teachers: "teachers",
} as const

type StoreName = keyof typeof STORE_NAMES

interface ScheduleDB extends DBSchema {
  profiles: {
    key: number
    value: Profile
    indexes: { "by-name": string }
  }
  institutes: {
    key: string
    value: InstituteData
  }
  teachers: {
    value: TeacherData
    key: number
    indexes: { "by-name": string }
  }
  schedules: {
    key: number
    value: ScheduleDataDB
    indexes: { "by-id": number }
  }
}

class DatabaseService {
  private db: IDBPDatabase<ScheduleDB> | null = null

  async init(): Promise<IDBPDatabase<ScheduleDB>> {
    if (this.db) {
      return this.db
    }

    this.db = await openDB<ScheduleDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("profiles")) {
          const store = db.createObjectStore("profiles", { keyPath: "id" })
          store.createIndex("by-name", "name")
        }
        if (!db.objectStoreNames.contains("institutes")) {
          db.createObjectStore("institutes", { keyPath: "name" })
        }
        if (!db.objectStoreNames.contains("teachers")) {
          const store = db.createObjectStore("teachers", { keyPath: "id" })
          store.createIndex("by-name", "name")
        }
        if (!db.objectStoreNames.contains("schedules")) {
          const store = db.createObjectStore("schedules", { keyPath: "id" })
          store.createIndex("by-id", "id")
        }
      },
    })

    return this.db
  }

  async saveSchedule(scheduleData: ScheduleData): Promise<void> {
    const db = await this.init()
    const tx = db.transaction("schedules", "readwrite")
    await tx.store.put(JSON.parse(JSON.stringify(scheduleData)))
    await tx.done
  }

  async getSchedule(id: number): Promise<ScheduleDataDB | undefined> {
    const db = await this.init()
    const tx = db.transaction("schedules", "readonly")
    const store = tx.objectStore("schedules")
    const index = store.index("by-id")

    return await index.get(id)
  }

  async getAll<K extends StoreName>(
    storeName: K,
    query?: IDBKeyRange,
    count?: number
  ): Promise<ScheduleDB[K]["value"][]> {
    const db = await this.init()
    return await db.getAll(storeName, query, count)
  }

  async saveAllTeachers(teachers: TeacherData[]): Promise<void> {
    const db = await this.init()
    const tx = db.transaction("teachers", "readwrite")
    await Promise.all(teachers.map((teacher) => tx.store.put(teacher)))
    await tx.done
  }

  async saveAllInstitutes(institutes: InstituteData[]): Promise<void> {
    const db = await this.init()
    const tx = db.transaction("institutes", "readwrite")
    await Promise.all(institutes.map((institute) => tx.store.put(institute)))
    await tx.done
  }

  async saveProfile(profile: Profile): Promise<void> {
    const db = await this.init()
    await db.put("profiles", profile)
  }

  async deleteProfile(profileId: number): Promise<void> {
    const db = await this.init()
    await db.delete("profiles", profileId)
    await db.delete("schedules", profileId)
  }
}

export const dbService = new DatabaseService()
