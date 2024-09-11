import { FavoriteTaskState } from "../interfaces/props.interface";
import { create } from "zustand";

export const useFavoriteTask = create<FavoriteTaskState>((set) => ({
  favoriteTaskIds: [],
  toggleFavoriteTask: (id: string) => set((state) => ({
    favoriteTaskIds: state.favoriteTaskIds.includes(id)
      ? state.favoriteTaskIds.filter((e) => e !== id)
      : [...state.favoriteTaskIds, id]
  }))
}));