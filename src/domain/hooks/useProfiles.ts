import { PROFILES_KEY } from "@/constants/contstants"
import type {
  Profile,
  ProfilesState,
  StudentProfile,
  TeacherProfile,
} from "@/domain/models/Profile.ts"
import { useEffect, useState } from "react"

export const useProfiles = () => {
  const [state, setState] = useState<ProfilesState>({
    profiles: [],
    activeProfileId: null,
  })

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(PROFILES_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProfilesState
        // Восстанавливаем Date объекты
        const profiles: Profile[] = parsed.profiles.map((profile) => ({
          ...profile,
          lastUsed: new Date(profile.lastUsed),
        }))
        setState({ ...parsed, profiles })
      } catch (error) {
        console.error("Error loading profiles:", error)
      }
    }
  }, [])

  const saveProfiles = (profileState: ProfilesState) => {
    setState(profileState)
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profileState))
  }

  // Создание профиля студента
  const createStudentProfile = (
    name: string,
    institute: string,
    group: string
  ): StudentProfile => ({
    id: group,
    name,
    scheduleType: "student",
    institute,
    group,
    lastUsed: new Date(),
  })

  // Создание профиля преподавателя
  const createTeacherProfile = (name: string, teacherName: string) => {
    const newProfile: TeacherProfile = {
      id: teacherName,
      name,
      scheduleType: "teacher",
      teacherName,
      lastUsed: new Date(),
    }
    addProfile(newProfile)
    return newProfile.id
  }

  const getOrCreateProfile = (
    id: string
    // scheduleType: ScheduleType,
    // defaultName?: string
  ) => {
    const existing = state.profiles.find((profile) => profile.id === id)

    if (existing) {
      // Обновляем время использования
      updateProfileLastUsedTime(id)
      return existing
    }

    // if (scheduleType === "student") {
    //   createStudentProfile(defaultName || "Студент", "", "")
    // } else {
    //   createTeacherProfile(defaultName || "Преподаватель", "")
    // }
  }

  // Добавление профиля
  const addProfile = (profile: Profile) => {
    const newProfileState = {
      ...state,
      profiles: [...state.profiles, profile],
      activeProfileId: profile.id,
    }
    saveProfiles(newProfileState)
  }

  // Обновление профиля
  const updateProfileLastUsedTime = (id: string) => {
    const newProfileState = {
      ...state,
      profiles: state.profiles.map((profile) =>
        profile.id === id ? { ...profile, lastUsed: new Date() } : profile
      ),
    }
    saveProfiles(newProfileState)
  }

  // Удаление профиля
  const removeProfile = (id: string) => {
    let profileIndex: number | null = null
    const newProfileState = {
      ...state,
      profiles: state.profiles.filter((profile, index) => {
        const predicate = profile.id !== id
        if (predicate) {
          profileIndex = index
        }
        return predicate
      }),
      activeProfileId:
        state.activeProfileId === id &&
        profileIndex !== null &&
        profileIndex >= 1
          ? state.profiles[state.profiles.length - 1].id
          : null,
    }

    saveProfiles(newProfileState)
  }

  const setActiveProfile = (id: string | null) => {
    setState((prev) => ({
      ...prev,
      activeProfileId: id,
    }))
  }

  return {
    profiles: state.profiles,
    activeProfileID: state.activeProfileId,
    activeProfileId: state.activeProfileId,
    createStudentProfile,
    createTeacherProfile,
    getOrCreateProfile,
    addProfile,
    updateProfileLastUsedTime,
    removeProfile,
    setActiveProfile,
  }
}
