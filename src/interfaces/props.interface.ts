import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Task } from "./context.interface";
import { ReactNode } from "react";
/*--------------------------------------------------Component Props--------------------------------------------------*/
export const navAuth = ['/task/new', '/tasks']
export const navGuest = ['/login', '/register']

//interface defautl props
export interface Props { children?: ReactNode }
export type TaskCardProps = { task: Task, isFavorite: boolean }

//navbar
export type NavbarProps = { isAuth: boolean, path: string[], method?: () => void }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Task--------------------------------------------------*/
export type FavoriteTaskState = {
  favoriteTaskIds: string[];
  addFavoriteTask: (id: string) => void;
  removeFavoriteTask: (id: string) => void;
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Query React--------------------------------------------------*/
export type QueryReact = {//useQuery
  fetchTask: (id: string) => UseQueryResult<Task, Error>
  fetchTasks: () => UseQueryResult<Task[], Error>
}
export type CustomMutation = {//useMutation
  createOrUpdateTask: (id: string) => UseMutationResult<Task, Error, object, unknown>
  deleteTask: () => UseMutationResult<Task, Error, string, unknown>
}
/*---------------------------------------------------------------------------------------------------------*/