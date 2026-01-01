import { type DBSchema, type IDBPDatabase, openDB } from "idb"
import type { InstituteData } from "@/entities/Institute.ts"
import type { TeacherData } from "@/entities/Teachers.ts"
import { DB_NAME, DB_VERSION } from "@/shared/constants/contstants.ts"
import { type ScheduleData } from "@/entities/ScheduleData.ts"
import type { ScheduleDataDB } from "@/app/store/indexDb/models/ScheduleDataDB.ts"
import type { ProfileDB } from "@/app/store/indexDb/models/ProfileDB.ts"
import type { Profile } from "@/entities/Profile.ts"

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
  }
}

class DatabaseService {
  private db: IDBPDatabase<ScheduleDB> | null = null

  async init(): Promise<IDBPDatabase<ScheduleDB>> {
    if (this.db) {
      return this.db
    }

    this.db = await openDB<ScheduleDB>(DB_NAME, DB_VERSION, {
      upgrade: async (db, oldVersion, newVersion) => {
        // Если старая версия не равна новой, удаляем все
        if (oldVersion !== newVersion && oldVersion > 0) {
          console.log(`Обновление с версии ${oldVersion} до ${newVersion}`)

          // Удаляем все существующие хранилища
          const storeNames = Array.from(db.objectStoreNames)

          for (const storeName of storeNames) {
            db.deleteObjectStore(storeName)
            console.log(`Удалено хранилище: ${storeName}`)
          }
        }

        if (!db.objectStoreNames.contains(STORE_NAMES.profiles)) {
          const store = db.createObjectStore(STORE_NAMES.profiles, {
            keyPath: "id",
            autoIncrement: true,
          })
          store.createIndex("by-name", "name")
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.institutes)) {
          db.createObjectStore(STORE_NAMES.institutes, { keyPath: "name" })
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.teachers)) {
          const store = db.createObjectStore(STORE_NAMES.teachers, {
            keyPath: "id",
          })
          store.createIndex("by-name", "name")
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.schedules)) {
          db.createObjectStore(STORE_NAMES.schedules, {
            autoIncrement: true,
          })
        }
      },
    })

    return this.db
  }

  async saveSchedule(
    profileId: number,
    scheduleData: ScheduleData
  ): Promise<void> {
    const db = await this.init()
    const tx = db.transaction(STORE_NAMES.schedules, "readwrite")
    await tx.store.put(JSON.parse(JSON.stringify(scheduleData)), profileId)
    await tx.done
  }

  async getSchedule(id: number): Promise<ScheduleDataDB | undefined> {
    const db = await this.init()
    const tx = db.transaction(STORE_NAMES.schedules, "readonly")

    return await tx.store.get(id)
  }

  async getProfile(id: number): Promise<ProfileDB | undefined> {
    const db = await this.init()
    const tx = db.transaction(STORE_NAMES.profiles, "readonly")

    return await tx.store.get(id)
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
    const tx = db.transaction(STORE_NAMES.teachers, "readwrite")
    await Promise.all(teachers.map((teacher) => tx.store.put(teacher)))
    await tx.done
  }

  async saveAllInstitutes(institutes: InstituteData[]): Promise<void> {
    const db = await this.init()
    const tx = db.transaction(STORE_NAMES.institutes, "readwrite")
    await Promise.all(institutes.map((institute) => tx.store.put(institute)))
    await tx.done
  }

  async saveProfile(profile: ProfileDB): Promise<number> {
    const db = await this.init()

    return await db.put(STORE_NAMES.profiles, profile as unknown as Profile)
  }

  async deleteProfile(profileId: number): Promise<void> {
    const db = await this.init()
    await db.delete(STORE_NAMES.profiles, profileId)
    await db.delete(STORE_NAMES.schedules, profileId)
  }
}

export const dbService = new DatabaseService()
