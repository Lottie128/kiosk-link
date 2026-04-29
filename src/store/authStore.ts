import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KioskStudent } from '../lib/supabase'

interface AuthStore {
  student: KioskStudent | null
  setStudent: (s: KioskStudent) => void
  logout: () => void
  updatePhoto: (photoUrl: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      student: null,
      setStudent: (student) => set({ student }),
      logout: () => set({ student: null }),
      updatePhoto: (photoUrl) =>
        set(s => s.student ? { student: { ...s.student, photo_url: photoUrl } } : {}),
    }),
    { name: 'kiosk-link-student' },
  ),
)
