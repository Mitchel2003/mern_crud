import { Task } from "./context.interface";
import { ReactNode } from "react";

/*--------------------------------------------------Component Props--------------------------------------------------*/
export const navAuth = ['/task/new', '/tasks']
export const navGuest = ['/login', '/register']

//interface defautl props
export interface Props { children?: ReactNode }
export type TaskCardProps = { task: Task, isFavorite: boolean }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Task--------------------------------------------------*/
export type FavoriteTaskState = {
    favoriteTaskIds: string[];
    toggleFavoriteTask: (id: string) => void
}
/*---------------------------------------------------------------------------------------------------------*/