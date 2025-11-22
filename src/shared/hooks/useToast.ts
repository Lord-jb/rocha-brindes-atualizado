// FILE: src/shared/hooks/useToast.ts
import { create } from 'zustand'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  hideToast: () => void
} 

export const useToast = create<ToastState>((set) => ({
  message: '',
  type: 'success',
  isVisible: false,
  showToast: (message, type = 'success') => set({ message, type, isVisible: true }),
  hideToast: () => set({ isVisible: false })
}))