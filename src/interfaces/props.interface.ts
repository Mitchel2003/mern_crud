import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Task, ThemeContextProps } from "./context.interface";
import { ControllerRenderProps } from "react-hook-form";

import { SetStateAction, Dispatch, ReactNode } from "react";
/*--------------------------------------------------Component Props--------------------------------------------------*/
export const navAuth = ['/task/new', '/tasks']
export const navGuest = ['/login', '/register']

//interface defautl props
export interface Props { children?: ReactNode }
export type TaskCardProps = { task: Task, isFavorite: boolean }

//navbar
export type NavbarProps = {
  isAuth: boolean;
  path: string[];
  method?: () => void;
  theme?: string
}

//theme components
export interface LoginComponentsProps extends ThemeContextProps { }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------hooks--------------------------------------------------*/
/*useQuery*/
export type QueryReact = {
  fetchTask: (id: string) => UseQueryResult<Task, Error>
  fetchTasks: () => UseQueryResult<Task[], Error>
}
/*useMutation*/
export type CustomMutation = {
  createOrUpdateTask: (id: string) => UseMutationResult<Task, Error, object, unknown>
  deleteTask: () => UseMutationResult<Task, Error, string, unknown>
}
/*useCallback (react)*/
export type UseCallbackProps = {
  field: ControllerRenderProps<any, string>;
  setPreview: Dispatch<SetStateAction<string | null>>;
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Layout--------------------------------------------------*/
export type LayoutProps = (children: ReactNode) => JSX.Element
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Task--------------------------------------------------*/
export type TaskFunction = (tasks: Task[], favorite: string[]) => ReactNode

export type FavoriteTaskState = {
  favoriteTaskIds: string[];
  addFavoriteTask: (id: string) => void;
  removeFavoriteTask: (id: string) => void;
}
/*---------------------------------------------------------------------------------------------------------*/