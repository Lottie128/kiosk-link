import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Student } from '../lib/supabase'
import { findOrCreateStudent } from '../lib/supabase'

interface AuthStore {
  student: Student | null
  isLoading: boolean
  error: string | null
  login: (name: string, classNum: number, section: 'A' | 'B') => Promise<void>
  logout: () => void
  updatePhoto: (photoUrl: string) => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      student: null,
      isLoading: false,
      error: null,

      async login(name, classNum, section) {
        set({ isLoading: true, error: null })
        try {
          const { student } = await findOrCreateStudent(name, classNum, section)
          set({ student, isLoading: false })
        } catch (e) {
          set({ error: (e as Error).message || 'Failed to enter lab. Try again.', isLoading: false })
        }
      },

      logout: () => set({ student: null }),

      updatePhoto: (photoUrl) =>
        set(s => s.student ? { student: { ...s.student, photo_url: photoUrl } } : {}),

      clearError: () => set({ error: null }),
    }),
    { name: 'kiosk-link-student' },
  ),
)
