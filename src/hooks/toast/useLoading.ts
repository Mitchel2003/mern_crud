import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  text: string
  show: (text?: string) => void
  hide: () => void
}

export const useLoadingScreen = create<LoadingState>((set) => ({
  isLoading: false,
  text: 'Cargando...',
  show: (text = 'Cargando...') => set({ isLoading: true, text }),
  hide: () => set({ isLoading: false }),
})) 